# ✅ 배포 체크리스트 (Task 12)

## Phase 1: 배포 전 준비

### 로컬 검증

- [ ] `npm run check-all` 모두 통과
- [ ] `npm run build` 성공
- [ ] 모든 포스트가 Notion에서 발행됨 (Status = published)
- [ ] 커버 이미지 URL이 유효함

### Git 준비

- [ ] 모든 변경사항 커밋됨
- [ ] 로컬 변경사항 없음 (`git status`)
- [ ] `.env.local`이 `.gitignore`에 있음
- [ ] main 브랜치에서 최신 버전

### 리소스 준비

- [ ] Notion API Key 준비
- [ ] Notion Database ID 준비
- [ ] Production URL 결정 (예: https://yourdomain.com)
- [ ] Vercel 계정 준비

---

## Phase 2: Vercel 설정

### 프로젝트 생성

- [ ] [vercel.com](https://vercel.com)에서 로그인
- [ ] GitHub 계정 연결
- [ ] 리포지토리 선택
- [ ] 프로젝트 import 완료

### 환경 변수 설정

- [ ] `NOTION_API_KEY` 설정
- [ ] `NOTION_BLOG_DATABASE_ID` 설정
- [ ] `NEXT_PUBLIC_SITE_URL` 설정 (production URL)
- [ ] 모든 환경 (Production, Preview, Development) 확인

### 빌드 설정

- [ ] Framework: Next.js (자동 감지)
- [ ] Build Command: `npm run build` (기본값)
- [ ] Install Command: `npm install` (기본값)
- [ ] Output Directory: `.next` (기본값)

---

## Phase 3: 배포

### 배포 실행

- [ ] GitHub에 `git push origin main`
- [ ] Vercel이 자동 배포 시작
- [ ] Deployments 탭에서 진행상황 모니터링
- [ ] 배포 완료 확인

### 배포 검증

- [ ] Production URL에서 접근 가능
- [ ] 콘솔 에러 없음 (DevTools)
- [ ] 모든 API 응답 200 OK

---

## Phase 4: 기능 검증 (E2E)

### 홈페이지

- [ ] `/` 로드됨
- [ ] 블로그 소개 텍스트 표시
- [ ] 블로그로 이동 링크 작동

### 블로그 목록 페이지

- [ ] `/blog` 로드됨
- [ ] 포스트 카드 표시됨
- [ ] 포스트 수가 맞음
- [ ] 검색 폼 표시됨
- [ ] 필터 사이드바 표시됨
- [ ] 페이지네이션 작동

### 블로그 상세 페이지

- [ ] `/blog/[slug]` 로드됨
- [ ] 포스트 제목 표시됨
- [ ] 커버 이미지 로드됨
- [ ] 본문 콘텐츠 렌더링됨
- [ ] 목차(TOC) 표시됨
- [ ] 메타정보 (작성자, 날짜, 읽기시간) 표시됨
- [ ] 태그/카테고리 링크 작동

### 필터 기능

- [ ] `/blog/category/[category]` 포스트 표시
- [ ] `/blog/tag/[tag]` 포스트 표시
- [ ] 사이드바 필터 링크 작동
- [ ] 필터된 포스트 정확함

### 검색 기능

- [ ] 검색 폼이 보임
- [ ] 검색어 입력 가능
- [ ] 검색 결과 표시
- [ ] 결과가 정확함
- [ ] 빈 검색어로 에러 메시지 표시
- [ ] 결과 없을 때 메시지 표시

### 에러 처리

- [ ] 존재하지 않는 포스트 접근 시 404 표시
- [ ] 서버 에러 시 에러 페이지 표시
- [ ] 재시도 버튼 작동

### SEO 및 피드

- [ ] `/sitemap.xml` 접근 가능 (XML)
- [ ] `/robots.txt` 접근 가능 (text)
- [ ] `/api/feed.xml` 접근 가능 (RSS)
- [ ] Sitemap에 모든 페이지 포함
- [ ] 메타 태그 확인 (OG, description 등)

---

## Phase 5: 성능 검증

### 로드 시간

- [ ] 블로그 메인: < 3초
- [ ] 포스트 상세: < 3초
- [ ] 검색 결과: < 2초

### 캐시 헤더

- [ ] POST /api/posts: Cache-Control header 확인
- [ ] GET /api/search: Cache-Control header 확인
- [ ] GET /api/feed.xml: Cache-Control header 확인

### 이미지 최적화

- [ ] 이미지가 작은 크기로 로드됨
- [ ] 반응형 이미지 로드됨
- [ ] 이미지 포맷 최적화됨 (WebP 등)

### Core Web Vitals (PageSpeed Insights)

- [ ] LCP (Largest Contentful Paint): < 2.5s ✅
- [ ] FID (First Input Delay): < 100ms ✅
- [ ] CLS (Cumulative Layout Shift): < 0.1 ✅
- [ ] Overall Score: 90 이상 (목표)

### 번들 사이즈

- [ ] First Load JS: < 200KB
- [ ] 번들 분석: next/bundle-analyzer
- [ ] 불필요한 라이브러리 없음

---

## Phase 6: 보안 및 모니터링

### 보안

- [ ] HTTPS 강제됨 (자동)
- [ ] 환경 변수 암호화됨 (Vercel)
- [ ] Notion API Key 노출 없음
- [ ] CORS 설정 정상

### 모니터링

- [ ] Vercel Analytics 활성화됨
- [ ] Error 로그 확인 가능
- [ ] Performance 메트릭 수집 중
- [ ] 배포 로그 정상

### 백업 및 복구

- [ ] Notion 데이터 백업 계획 있음
- [ ] 배포 롤백 절차 이해함
- [ ] 웹훅 설정 확인 (선택)

---

## Phase 7: 최종 확인

### 팀 공지

- [ ] 배포 완료 알림 발송
- [ ] Production URL 공유
- [ ] 문제 보고 방법 공유

### 문서화

- [ ] DEPLOYMENT.md 최신화
- [ ] 배포 일시 기록
- [ ] 배포 노트 작성

### 다음 단계 계획

- [ ] 커스텀 도메인 설정 (선택)
- [ ] 모니터링 서비스 연결 (선택)
- [ ] SEO 최적화 (Google Search Console)
- [ ] 정기 유지보수 계획

---

## 배포 완료! 🎉

모든 항목을 확인했다면:

1. **Production URL**에서 최종 검증
2. **팀에 공지** - 배포 완료
3. **모니터링 시작** - 사용자 반응 및 성능 추적
4. **정기 유지보수** 계획 수립

---

## 문제 발생 시

### 기능 오류

1. Vercel Logs 확인 (`Deployments > Logs`)
2. 로컬에서 재현 시도
3. 필요시 롤백 (`vercel rollback` 또는 재배포)

### 성능 문제

1. PageSpeed Insights에서 측정
2. Network 탭에서 병목 찾기
3. 이미지/번들 최적화

### 보안 문제

1. 환경 변수 재생성
2. Vercel 로그 확인
3. 필요시 상담 문의

---

**배포 날짜:** **\*\***\_\_\_\_**\*\***  
**담당자:** **\*\***\_\_\_\_**\*\***  
**노트:** ****\*\*\*\*****\*\*\*\*****\*\*\*\*****\_\_\_****\*\*\*\*****\*\*\*\*****\*\*\*\*****
