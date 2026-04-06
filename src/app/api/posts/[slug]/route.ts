import { getPostBySlug } from '@/lib/notion/database'
import { ApiResponseSchema, BlogPostSchema } from '@/lib/schemas/blog-post'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return Response.json(
        { error: 'slug 파라미터가 필요합니다.' },
        { status: 400 }
      )
    }

    const post = await getPostBySlug(slug)

    if (!post) {
      return Response.json(
        { error: '포스트를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const schema = ApiResponseSchema(BlogPostSchema)
    const response = schema.parse({
      success: true,
      data: post,
    })

    return Response.json(response)
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return Response.json(
      { error: '포스트를 조회하는 중에 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
