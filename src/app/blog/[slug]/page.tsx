import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { BlogPostDetailSkeleton } from '@/components/shared/loading-skeleton'
import { BlogPostDetail } from '@/components/blog/blog-post-detail'
import { getPostBySlug } from '@/lib/notion/database'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다.',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      images: post.coverImage
        ? [{ url: post.coverImage, alt: post.title }]
        : [],
    },
  }
}

export async function generateStaticParams() {
  // 상세 페이지는 온디맨드 렌더링 (ISR)
  // 배포 후 dynamic=force-static으로 변경 가능
  return []
}

async function BlogPostContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <BlogPostDetail post={post} />
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  return (
    <div className="container space-y-8 py-12">
      <Suspense fallback={<BlogPostDetailSkeleton />}>
        <BlogPostContent slug={slug} />
      </Suspense>
    </div>
  )
}
