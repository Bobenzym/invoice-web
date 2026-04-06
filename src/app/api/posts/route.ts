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

    if (page < 1 || isNaN(page)) {
      return Response.json(
        { error: '유효하지 않은 페이지 번호입니다.' },
        { status: 400 }
      )
    }

    const allPosts = await getPublishedPosts(1000)
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

    return Response.json(response)
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return Response.json(
      { error: '포스트를 조회하는 중에 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
