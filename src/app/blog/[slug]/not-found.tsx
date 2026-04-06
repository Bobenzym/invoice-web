import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center gap-6 py-24">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">포스트를 찾을 수 없습니다.</p>
        <p className="text-muted-foreground text-sm">
          요청한 포스트가 존재하지 않거나 삭제되었습니다.
        </p>
      </div>
      <Button asChild>
        <Link href="/blog">블로그로 돌아가기</Link>
      </Button>
    </div>
  )
}
