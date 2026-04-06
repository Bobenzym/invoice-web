import { BlogPostDetailSkeleton } from '@/components/shared/loading-skeleton'

export default function Loading() {
  return (
    <div className="container py-12">
      <BlogPostDetailSkeleton />
    </div>
  )
}
