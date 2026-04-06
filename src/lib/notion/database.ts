import { env } from '@/lib/env'
import type { BlogPost, BlogPostSummary } from '@/lib/types/blog-post'

import { mapNotionPageToBlogPost } from './blog-post-mapper'
import { notion } from './client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PageObjectResponse = any

/**
 * 발행된 모든 포스트 조회
 * @param limit 최대 조회 수 (기본값: 100)
 * @returns BlogPost 배열
 */
export async function getPublishedPosts(limit = 100): Promise<BlogPost[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.databases as any).query({
      database_id: env.NOTION_BLOG_DATABASE_ID,
      filter: {
        property: 'Status',
        select: {
          equals: 'published',
        },
      },
      sorts: [
        {
          property: 'Published Date',
          direction: 'descending',
        },
      ],
      page_size: Math.min(limit, 100),
    })

    const posts = await Promise.all(
      (response.results as PageObjectResponse[]).map(page =>
        mapNotionPageToBlogPost(page)
      )
    )

    return posts
  } catch (error) {
    console.error('Failed to fetch published posts:', error)
    return []
  }
}

/**
 * slug으로 포스트 조회
 * @param slug 포스트의 slug
 * @returns BlogPost 객체 또는 null
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.databases as any).query({
      database_id: env.NOTION_BLOG_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Slug',
            rich_text: {
              equals: slug,
            },
          },
          {
            property: 'Status',
            select: {
              equals: 'published',
            },
          },
        ],
      },
    })

    if (response.results.length === 0) {
      return null
    }

    const post = await mapNotionPageToBlogPost(
      response.results[0] as PageObjectResponse
    )
    return post
  } catch (error) {
    console.error(`Failed to fetch post by slug ${slug}:`, error)
    return null
  }
}

/**
 * 태그별 포스트 조회
 * @param tag 태그명
 * @returns BlogPost 배열
 */
export async function listPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.databases as any).query({
      database_id: env.NOTION_BLOG_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Tags',
            multi_select: {
              contains: tag,
            },
          },
          {
            property: 'Status',
            select: {
              equals: 'published',
            },
          },
        ],
      },
      sorts: [
        {
          property: 'Published Date',
          direction: 'descending',
        },
      ],
    })

    const posts = await Promise.all(
      (response.results as PageObjectResponse[]).map(page =>
        mapNotionPageToBlogPost(page)
      )
    )

    return posts
  } catch (error) {
    console.error(`Failed to fetch posts by tag ${tag}:`, error)
    return []
  }
}

/**
 * 카테고리별 포스트 조회
 * @param category 카테고리명
 * @returns BlogPost 배열
 */
export async function listPostsByCategory(
  category: string
): Promise<BlogPost[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.databases as any).query({
      database_id: env.NOTION_BLOG_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Category',
            select: {
              equals: category,
            },
          },
          {
            property: 'Status',
            select: {
              equals: 'published',
            },
          },
        ],
      },
      sorts: [
        {
          property: 'Published Date',
          direction: 'descending',
        },
      ],
    })

    const posts = await Promise.all(
      (response.results as PageObjectResponse[]).map(page =>
        mapNotionPageToBlogPost(page)
      )
    )

    return posts
  } catch (error) {
    console.error(`Failed to fetch posts by category ${category}:`, error)
    return []
  }
}

/**
 * 포스트 요약 정보 추출 (목록용)
 * @param post BlogPost 객체
 * @returns BlogPostSummary 객체
 */
export function toBlogPostSummary(post: BlogPost): BlogPostSummary {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags,
    category: post.category,
    author: post.author,
    publishedAt: post.publishedAt,
    coverImage: post.coverImage,
    readingTime: post.readingTime,
  }
}
