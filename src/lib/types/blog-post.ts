// Notion 블록 타입
export interface NotionBlock {
  id: string
  type: string
  [key: string]: unknown
}

// 블로그 포스트 전체 정보
export interface BlogPost {
  id: string // Notion Page ID
  slug: string // URL slug
  title: string
  excerpt: string
  content: NotionBlock[] // Notion 블록 배열
  tags: string[]
  category: string
  author: string
  publishedAt: Date
  updatedAt: Date
  coverImage?: string
  status: 'draft' | 'published'
  readingTime: number
}

// 블로그 포스트 요약 (목록용)
export interface BlogPostSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  tags: string[]
  category: string
  author: string
  publishedAt: Date
  coverImage?: string
  readingTime: number
}
