import { notion } from './client'
import type { BlogPost } from '@/lib/types/blog-post'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PageObjectResponse = any

/**
 * Notion Page의 속성값을 추출하는 헬퍼 함수
 */
function getPropertyValue(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: Record<string, any>,
  key: string,
  type: 'title' | 'rich_text' | 'date' | 'select' | 'multi_select' | 'url'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const prop = properties[key]

  if (!prop) return null

  switch (type) {
    case 'title':
      return prop.title?.[0]?.plain_text || ''
    case 'rich_text':
      return prop.rich_text?.[0]?.plain_text || ''
    case 'date':
      return prop.date?.start ? new Date(prop.date.start) : null
    case 'select':
      return prop.select?.name || ''
    case 'multi_select':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (prop.multi_select || []).map((item: any) => item.name)
    case 'url':
      return prop.url || ''
    default:
      return null
  }
}

/**
 * Notion Page를 BlogPost로 변환
 * @param page Notion Page 객체
 * @returns BlogPost 객체
 */
/**
 * Notion Page의 블록 콘텐츠 조회
 * @param pageId Notion Page ID
 * @returns 블록 배열
 */
async function getPageBlocks(pageId: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.blocks as any).children.list({
      block_id: pageId,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response.results as any[]).map(block => ({
      id: block.id,
      type: block.type,
      ...block[block.type],
    }))
  } catch (error) {
    console.error(`Failed to fetch blocks for page ${pageId}:`, error)
    return []
  }
}

export async function mapNotionPageToBlogPost(
  page: PageObjectResponse
): Promise<BlogPost> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties = page.properties as Record<string, any>

  const title = getPropertyValue(properties, 'Title', 'title')
  const slug = getPropertyValue(properties, 'Slug', 'rich_text')
  const excerpt = getPropertyValue(properties, 'Excerpt', 'rich_text')
  const author = getPropertyValue(properties, 'Author', 'rich_text')
  const category = getPropertyValue(properties, 'Category', 'select')
  const tags = getPropertyValue(properties, 'Tags', 'multi_select') || []
  const publishedAt = getPropertyValue(properties, 'Published Date', 'date')
  const coverImage = getPropertyValue(properties, 'Cover Image', 'url')
  const status = getPropertyValue(properties, 'Status', 'select')

  // 블록 콘텐츠 조회
  const blocks = await getPageBlocks(page.id)

  // 읽기 시간 추정 (블록 콘텐츠 기준, 평균 200자/분)
  const totalContentLength = blocks.reduce((sum, block) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const richText = (block as any).rich_text || []
    const text = richText
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => item.plain_text)
      .join('')
    return sum + text.length
  }, 0)
  const readingTime = Math.max(
    1,
    Math.ceil((totalContentLength || excerpt?.length || 0) / 200)
  )

  return {
    id: page.id,
    slug: slug || page.id,
    title: title || 'Untitled',
    excerpt: excerpt || '',
    content: blocks,
    tags: Array.isArray(tags) ? tags : [],
    category: category || 'Uncategorized',
    author: author || 'Unknown',
    publishedAt: publishedAt || new Date(),
    updatedAt: new Date(page.last_edited_time),
    coverImage: coverImage || undefined,
    status: (status as 'draft' | 'published') || 'draft',
    readingTime,
  }
}
