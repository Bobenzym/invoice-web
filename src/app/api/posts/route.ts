import { getPublishedPosts, toBlogPostSummary } from '@/lib/notion/database'
import {
  ApiPaginatedResponseSchema,
  BlogPostSummarySchema,
} from '@/lib/schemas/blog-post'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10', 10), 100)
    const tag = searchParams.get('tag') ?? undefined
    const category = searchParams.get('category') ?? undefined
    const search = searchParams.get('search')?.trim() ?? undefined

    if (page < 1 || isNaN(page)) {
      return Response.json(
        { error: '유효하지 않은 페이지 번호입니다.' },
        { status: 400 }
      )
    }

    let allPosts = await getPublishedPosts(1000)

    // 필터링: 태그
    if (tag) {
      allPosts = allPosts.filter(post =>
        post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      )
    }

    // 필터링: 카테고리
    if (category) {
      allPosts = allPosts.filter(
        post => post.category.toLowerCase() === category.toLowerCase()
      )
    }

    // 필터링: 검색
    if (search) {
      const lowerSearch = search.toLowerCase()
      allPosts = allPosts.filter(
        post =>
          post.title.toLowerCase().includes(lowerSearch) ||
          post.excerpt.toLowerCase().includes(lowerSearch) ||
          post.tags.some(t => t.toLowerCase().includes(lowerSearch))
      )
    }

    const total = allPosts.length
    const totalPages = Math.ceil(total / limit)

    if (page > totalPages && totalPages > 0) {
      return Response.json({ error: '페이지를 초과했습니다.' }, { status: 404 })
    }

    const startIndex = (page - 1) * limit
    const paginatedPosts = allPosts.slice(startIndex, startIndex + limit)

    const summaries = paginatedPosts.map(post => toBlogPostSummary(post))

    const schema = ApiPaginatedResponseSchema(BlogPostSummarySchema)
    const response = schema.parse({
      success: true,
      data: summaries,
      pagination: {
        currentPage: page,
        totalPages,
        pageSize: limit,
        total,
      },
    })

    return Response.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return Response.json(
      { error: '포스트를 조회하는 중에 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
