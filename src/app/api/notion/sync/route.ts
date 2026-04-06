import { revalidateTag } from 'next/cache'

/**
 * Notion 웹훅 엔드포인트
 * Notion Database의 변경사항을 감지하여 ISR 캐시를 무효화합니다.
 *
 * Notion에서 설정할 웹훅:
 * - Event: Database items 변경 (created, updated, deleted)
 * - Webhook URL: https://yourdomain.com/api/notion/sync
 */
export async function POST(request: Request) {
  try {
    // 웹훅 요청 검증 (production에서는 서명 검증 추가)
    const body = await request.json()

    if (!body) {
      return Response.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      )
    }

    // ISR 캐시 태그 무효화
    // 포스트 데이터가 변경되었으므로 관련 캐시를 무효화합니다.
    revalidateTag('posts')
    revalidateTag('post-by-slug')
    revalidateTag('posts-by-tag')
    revalidateTag('posts-by-category')

    return Response.json(
      {
        success: true,
        message: 'Cache invalidated successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return Response.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}
