import { getPublishedPosts, toBlogPostSummary } from '@/lib/notion/database'
import {
  ApiPaginatedResponseSchema,
  BlogPostSummarySchema,
} from '@/lib/schemas/blog-post'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('q')?.trim() ?? ''
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10', 10), 100)

    if (!keyword || keyword.length < 2) {
      return Response.json(
        { error: '2글자 이상의 검색어를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (page < 1 || isNaN(page)) {
      return Response.json(
        { error: '유효하지 않은 페이지 번호입니다.' },
        { status: 400 }
      )
    }

    // 모든 포스트 조회 후 검색
    const allPosts = await getPublishedPosts(1000)
    const lowerKeyword = keyword.toLowerCase()

    const searchResults = allPosts.filter(post => {
      const searchText =
        `${post.title} ${post.excerpt} ${post.tags.join(' ')} ${post.category}`.toLowerCase()
      return searchText.includes(lowerKeyword)
    })

    const total = searchResults.length
    const totalPages = Math.ceil(total / limit)

    if (page > totalPages && totalPages > 0) {
      return Response.json({ error: '페이지를 초과했습니다.' }, { status: 404 })
    }

    const startIndex = (page - 1) * limit
    const paginatedPosts = searchResults.slice(startIndex, startIndex + limit)

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
    console.error('Failed to search posts:', error)
    return Response.json(
      { error: '검색 중에 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
