import { getAllBlogs } from '@/lib/blog';
import { calculateReadTime } from '@/lib/read-time';

import BlogClient from './blog-client';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;

  // Get all blog posts on the server side
  const allBlogPosts = getAllBlogs();

  // Add category and readTime to posts
  const enhancedBlogPosts = allBlogPosts.map((post) => ({
    ...post,
    category: post.tags[0] || 'Resource',
    readTime: calculateReadTime(post.content),
  }));

  return <BlogClient posts={enhancedBlogPosts} />;
}
