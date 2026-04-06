import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface BlogPostFooterProps {
  slug: string
}

export function BlogPostFooter({ slug }: BlogPostFooterProps) {
  return (
    <footer className="border-border border-t py-8">
      <div className="space-y-6">
        {/* 공유 영역 */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">이 포스트 공유:</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`
                )}&text=블로그 포스트 공유`}
                target="_blank"
                rel="noopener noreferrer"
              >
                X (Twitter)
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </Button>
          </div>
        </div>

        {/* 네비게이션 */}
        <Button variant="outline" asChild>
          <Link href="/blog">← 블로그로 돌아가기</Link>
        </Button>
      </div>
    </footer>
  )
}
