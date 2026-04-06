import Link from 'next/link'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container space-y-6 py-20">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Notion CMS Blog
            </h1>
            <p className="text-muted-foreground text-lg">
              Notion을 데이터 소스로 사용하는 완전 관리형 블로그 플랫폼입니다.
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/blog">블로그 보러가기</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
