#!/bin/bash

# 배포 후 E2E 검증 스크립트
# 사용법: ./scripts/verify-deployment.sh https://yourdomain.com

if [ -z "$1" ]; then
  echo "사용법: $0 <production-url>"
  echo "예: $0 https://my-blog.vercel.app"
  exit 1
fi

URL=$1
echo "🚀 배포 검증 시작: $URL"
echo ""

# 1. 기본 접근성 확인
echo "✅ 1. 기본 페이지 접근성 확인"
echo "---"
curl -s -o /dev/null -w "상태 코드: %{http_code}\n" "$URL" || echo "실패: 메인 페이지"
curl -s -o /dev/null -w "상태 코드: %{http_code}\n" "$URL/blog" || echo "실패: 블로그 페이지"
curl -s -o /dev/null -w "상태 코드: %{http_code}\n" "$URL/api/posts" || echo "실패: API 포스트"
echo ""

# 2. SEO 파일 확인
echo "✅ 2. SEO 파일 확인"
echo "---"
curl -s -o /dev/null -w "sitemap.xml: %{http_code}\n" "$URL/sitemap.xml"
curl -s -o /dev/null -w "robots.txt: %{http_code}\n" "$URL/robots.txt"
curl -s -o /dev/null -w "feed.xml: %{http_code}\n" "$URL/api/feed.xml"
echo ""

# 3. API 캐시 헤더 확인
echo "✅ 3. API 캐시 헤더 확인"
echo "---"
echo "POST 목록 캐시:"
curl -s -I "$URL/api/posts" | grep "Cache-Control" || echo "캐시 헤더 없음"
echo "검색 API 캐시:"
curl -s -I "$URL/api/search" | grep "Cache-Control" || echo "캐시 헤더 없음"
echo ""

# 4. 콘텐츠 검증
echo "✅ 4. 콘텐츠 검증"
echo "---"
BLOG_RESPONSE=$(curl -s "$URL/api/posts?page=1&limit=1")
if echo "$BLOG_RESPONSE" | grep -q '"success":true'; then
  echo "✓ 포스트 API 응답: 성공"
  POST_COUNT=$(echo "$BLOG_RESPONSE" | grep -o '"total":[0-9]*' | cut -d':' -f2)
  echo "  - 총 포스트 수: $POST_COUNT"
else
  echo "✗ 포스트 API 응답: 실패"
fi
echo ""

# 5. 이미지 로드 확인
echo "✅ 5. 성능 체크"
echo "---"
echo "페이지 로드 시간 측정..."
TIME=$(curl -s -o /dev/null -w "%{time_total}" "$URL/blog")
echo "블로그 페이지 로드 시간: ${TIME}초"

if (( $(echo "$TIME < 3" | bc -l) )); then
  echo "✓ 로드 시간 우수"
else
  echo "⚠ 로드 시간 개선 필요"
fi
echo ""

# 6. 검색 API 확인
echo "✅ 6. 검색 기능 확인"
echo "---"
SEARCH_RESPONSE=$(curl -s "$URL/api/search?q=test&page=1&limit=5")
if echo "$SEARCH_RESPONSE" | grep -q '"success":true'; then
  echo "✓ 검색 API: 정상"
else
  echo "✗ 검색 API: 오류"
fi
echo ""

echo "🎉 배포 검증 완료!"
echo ""
echo "📋 다음 단계:"
echo "  1. 브라우저에서 $URL 방문"
echo "  2. 모든 페이지 수동 확인"
echo "  3. PageSpeed Insights에서 성능 측정: https://pagespeed.web.dev/"
echo "  4. 검색 엔진 등록 확인"
