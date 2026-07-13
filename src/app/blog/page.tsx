import { prisma } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest insights, tips, and updates from Wujood.",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, title: true, excerpt: true, publishedAt: true, imageUrl: true },
  });

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Blog</h1>
        <p className="text-text-secondary mb-10">Latest insights, tips, and updates from Wujood.</p>

        {posts.length === 0 ? (
          <p className="text-text-muted text-center py-16">No posts yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block border border-border-subtle rounded-xl p-6 hover:border-accent-gold/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <h2 className="text-xl font-semibold text-text-primary mb-1">{post.title}</h2>
                {post.excerpt && <p className="text-text-secondary text-sm mb-2">{post.excerpt}</p>}
                <p className="text-xs text-text-muted">{dateFormatter.format(new Date(post.publishedAt!))}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
