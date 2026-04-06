'use client'

import { useEffect, useState } from 'react'

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

interface BlogPostTocProps {
  content: string
}

export function BlogPostToc({ content }: BlogPostTocProps) {
  const [items, setItems] = useState<TableOfContentsItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // DOM에서 h2, h3 헤더 추출
    const headings = document.querySelectorAll('h2, h3')
    const tocItems: TableOfContentsItem[] = []

    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`
      if (!heading.id) heading.id = id

      const text = heading.textContent || ''
      const level = parseInt(heading.tagName[1], 10)

      tocItems.push({ id, text, level })
    })

    setItems(tocItems)

    // 스크롤 이벤트 리스너
    const handleScroll = () => {
      let current = ''
      for (const item of tocItems) {
        const element = document.getElementById(item.id)
        if (element && element.getBoundingClientRect().top < 100) {
          current = item.id
        }
      }
      setActiveId(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [content])

  if (items.length === 0) {
    return null
  }

  return (
    <aside className="sticky top-20 space-y-4">
      <div>
        <h3 className="mb-3 text-sm font-semibold">목차</h3>
        <nav className="space-y-1 text-sm">
          {items.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block truncate transition-colors ${
                activeId === item.id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              } ${item.level === 3 ? 'ml-4' : ''}`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}
