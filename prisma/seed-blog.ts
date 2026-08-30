import { PrismaClient } from "@prisma/client";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

// ponytail: reads markdown files already created for Boss review — single source, no duplication
function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) throw new Error("Invalid frontmatter");
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    // strip quotes and brackets
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    meta[key] = val;
  }
  return { meta, body: match[2].trim() };
}

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) throw new Error("No ADMIN user found — run prisma/seed.ts first");

  const blogDir = join(__dirname, "..", "content", "blog");
  const files = readdirSync(blogDir).filter((f) => f.endsWith(".md"));

  if (files.length === 0) throw new Error(`No markdown files in ${blogDir}`);

  for (const file of files) {
    const raw = readFileSync(join(blogDir, file), "utf-8");
    const { meta, body } = parseFrontmatter(raw);

    const slug = meta.slug || file.replace(/\.md$/, "");
    const title = meta.title || slug;
    const excerpt = meta.description || "";
    // ponytail: tags stored as JSON string in frontmatter — parse if present, else []
    let tags: string[] = [];
    if (meta.tags) {
      try {
        // frontmatter tags like ["a", "b"]
        tags = JSON.parse(meta.tags.replace(/'/g, '"'));
      } catch {
        tags = meta.tags
          .replace(/[\[\]"]/g, "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    const publishedAt = meta.date ? new Date(meta.date) : new Date("2026-08-27");

    // upsert by slug — idempotent, safe to re-run
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      await prisma.blogPost.update({
        where: { slug },
        data: { title, excerpt, content: body, tags, publishedAt, authorId: admin.id },
      });
      console.log(`Updated: ${slug}`);
    } else {
      await prisma.blogPost.create({
        data: { title, slug, excerpt, content: body, tags, publishedAt, authorId: admin.id },
      });
      console.log(`Created: ${slug}`);
    }
  }

  console.log(`\nDone — ${files.length} posts seeded. Visit /blog to review.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
