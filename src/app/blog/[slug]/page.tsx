import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({ where: { slug, publishedAt: { not: null } } });
  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.excerpt || undefined };
}

const dateFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" });

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({ where: { slug, publishedAt: { not: null } } });
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/blog" className="text-sm text-accent-gold hover:underline mb-6 inline-block">&larr; Back to Blog</Link>
        <h1 className="text-4xl font-bold text-text-primary mb-2">{post.title}</h1>
        <p className="text-sm text-text-muted mb-8">{dateFormatter.format(new Date(post.publishedAt!))}</p>
        <div className="prose prose-invert max-w-none text-text-primary whitespace-pre-wrap">
          {post.content}
        </div>
      </div>
    </div>
  );
}
