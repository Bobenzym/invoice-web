# 🗺️ Notion CMS Blog - 개발 로드맵

> **프로젝트**: Notion 연동 블로그 플랫폼 MVP  
> **기반 문서**: `@/docs/PRD.md`  
> **시작일**: 2026-04-06  
> **기술 스택**: Next.js 15.5.3 · React 19 · TypeScript · TailwindCSS v4 · shadcn/ui · Notion API · Unified

---

## 진행 현황 요약

| Phase        | 이름           | 상태    | 예상 기간  |
| ------------ | -------------- | ------- | ---------- |
| Phase 1      | 프로젝트 골격  | ⬜ 대기 | 1~2일      |
| Phase 2      | 공통 모듈 개발 | ⬜ 대기 | 2~3일      |
| Phase 3      | 핵심 기능 개발 | ⬜ 대기 | 3~4일      |
| Phase 4      | 추가 기능 개발 | ⬜ 대기 | 2~3일      |
| Phase 5      | 최적화 및 배포 | ⬜ 대기 | 1~2일      |
| **MVP 합계** |                |         | **9~14일** |

---

## Phase 1: 프로젝트 골격 (1~2일)

### 왜 이 순서인가?

Notion API 설정·라우트 구조·TypeScript 타입이 결정되지 않으면 모든 이후 작업이 산발적으로 진행된다.  
**먼저 뼈대를 견고하게 세워야** 데이터 계층과 UI 계층의 계약이 명확해진다.

### 작업 목록

#### 의존성 설치

- [ ] Notion API 패키지 설치
  ```bash
  npm install @notionhq/client
  npm install unified remark-parse remark-rehype rehype-stringify
  npm install gray-matter
  ```

#### 환경 설정

- [ ] `.env.local.example` 파일 생성
  ```
  NOTION_API_KEY=
  NOTION_BLOG_DATABASE_ID=
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  ```
- [ ] `src/lib/env.ts` — Zod 환경변수 스키마 추가
  - `NOTION_API_KEY` (서버 전용)
  - `NOTION_BLOG_DATABASE_ID` (서버 전용)
  - `NEXT_PUBLIC_SITE_URL`

#### 라우트 구조 생성

- [ ] `src/app/blog/` 디렉토리 생성
- [ ] `src/app/blog/[slug]/` — 포스트 상세 페이지 라우트
- [ ] `src/app/blog/tag/[tag]/` — 태그별 포스트 목록
- [ ] `src/app/blog/category/[category]/` — 카테고리별 포스트 목록
- [ ] `src/app/api/posts/` — 포스트 목록 API
- [ ] `src/app/api/posts/[slug]/` — 포스트 상세 API
- [ ] `src/app/api/search/` — 검색 API (스텁)
- [ ] `src/app/api/feed.xml/` — RSS 피드 (스텁)
- [ ] `src/app/api/notion/sync/` — Notion 웹훅 (스텁)

#### 폴더 구조 생성

- [ ] `src/lib/notion/` — Notion API 관련 함수
- [ ] `src/lib/types/` — 공유 TypeScript 타입
- [ ] `src/lib/schemas/` — Zod 검증 스키마
- [ ] `src/components/blog/` — 블로그 컴포넌트
- [ ] `src/components/shared/` — 공통 컴포넌트

#### 기본 레이아웃 생성

- [ ] `src/app/blog/layout.tsx` — 블로그 공통 레이아웃
- [ ] 홈페이지 업데이트 (`src/app/page.tsx` → 블로그 소개로)

### ✅ 완료 기준

- `npm run check-all` 통과
- `npm run build` 성공 (빈 페이지라도 컴파일 오류 없음)
- 모든 폴더/파일이 `kebab-case` 준수
- `.env.local.example` 리포지터리 커밋됨

---

## Phase 2: 공통 모듈 개발 (2~3일)

### 왜 이 순서인가?

Notion 클라이언트·포스트 타입·렌더링 유틸은 모든 API와 페이지에서 공유된다.  
이들 없이 핵심 기능을 구현하면 **동일한 로직이 여러 곳에 흩어**지고,  
나중에 Notion 스키마가 변경되면 모든 곳을 수정해야 한다.

### 작업 목록

#### 공통 타입 정의

- [ ] `src/lib/types/blog-post.ts`

  ```typescript
  interface BlogPost {
    id: string
    slug: string
    title: string
    excerpt: string
    content: NotionBlock[]
    tags: string[]
    category: string
    author: string
    publishedAt: Date
    updatedAt: Date
    coverImage?: string
    status: 'draft' | 'published'
    readingTime: number
  }
  ```

- [ ] `src/lib/types/api.ts` — API 응답 타입

  ```typescript
  interface ApiResponse<T> {
    success: boolean
    data: T
    error?: string
  }

  interface ApiPaginatedResponse<T> {
    success: boolean
    data: T[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
  ```

#### Notion API 공통 함수

- [ ] `src/lib/notion/client.ts` — Notion 클라이언트 싱글톤

  ```typescript
  export const notionClient = new Client({ auth: process.env.NOTION_API_KEY })
  ```

- [ ] `src/lib/notion/blog-post-mapper.ts` — Notion Page → BlogPost 변환
  - `mapNotionPageToBlogPost(page: PageObjectResponse): Promise<BlogPost>`
  - Property 타입별 파싱 (텍스트, 날짜, 멀티선택 등)
  - 실제 Notion 데이터 쿼리 후 검증

- [ ] `src/lib/notion/database.ts` — 데이터베이스 조회

  ```typescript
  export async function getPublishedPosts(limit?: number): Promise<BlogPost[]>
  export async function getPostBySlug(slug: string): Promise<BlogPost | null>
  export async function listPostsByTag(tag: string): Promise<BlogPost[]>
  export async function listPostsByCategory(
    category: string
  ): Promise<BlogPost[]>
  ```

- [ ] Notion 쿼리 필터
  - `status === "published"` 만 조회
  - `publishedAt` 기준 역순 정렬

#### 공통 유틸리티

- [ ] `src/lib/utils.ts` — 기존 `cn()` 유지, 아래 함수 추가

  ```typescript
  export function formatDate(date: Date, locale?: string): string
  export function calculateReadingTime(text: string): number
  export function truncateText(text: string, length: number): string
  export function slugify(text: string): string
  ```

- [ ] `src/lib/markdown.ts` — Markdown/Notion 렌더링
  - Unified 파이프라인 설정 (remark-parse → rehype-stringify)
  - 코드 하이라이팅 플러그인 설정 (rehype-highlight)

#### 공통 컴포넌트

- [ ] `src/components/shared/tag-badge.tsx` — 태그 배지
- [ ] `src/components/shared/category-badge.tsx` — 카테고리 배지
- [ ] `src/components/shared/reading-time.tsx` — 읽기 시간 표시
- [ ] `src/components/shared/loading-skeleton.tsx` — 로딩 스켈레톤
- [ ] `src/components/shared/error-fallback.tsx` — 에러 표시

### ✅ 완료 기준

- `getPublishedPosts()` / `getPostBySlug()` 호출 시 실제 Notion 데이터 반환
- `BlogPost` 타입이 모든 포스트 데이터를 정확히 표현
- 렌더링 유틸 동작 확인 (간단한 마크다운 → HTML 변환)
- `npm run check-all` 통과

---

## Phase 3: 핵심 기능 개발 (3~4일)

### 왜 이 순서인가?

포스트 조회·상세·렌더링이 이 서비스의 존재 이유다.  
이들이 동작하지 않으면 나머지는 의미가 없다.

개발 순서: **API Route → 페이지 → 컴포넌트 조립**

### 작업 목록

#### API Routes 구현

- [ ] `src/app/api/posts/route.ts` — `GET` 핸들러

  ```typescript
  Query: page=1, limit=10, tag=, category=, search=
  Response: ApiPaginatedResponse<BlogPost>
  ```

- [ ] `src/app/api/posts/[slug]/route.ts` — `GET` 핸들러

  ```typescript
  Response: ApiResponse<BlogPost>
  404 시: { success: false, error: "Post not found" }
  ```

- [ ] `src/app/api/notion/sync/route.ts` — `POST` 웹훅 (스텁)
  ```typescript
  Body: { type: "page.updated", page_id: string }
  향후 캐시 무효화 트리거
  ```

#### 블로그 컴포넌트 구현

> 순서: 기본 → 상세 → 렌더러 → 페이지

- [ ] `src/components/blog/blog-post-card.tsx` — 목록용 포스트 카드
  - 제목, 요약, 날짜, 태그, 커버 이미지
  - shadcn/ui `Card` 활용

- [ ] `src/components/blog/blog-post-list.tsx` — 포스트 목록 컨테이너
  - 페이지네이션 또는 무한 스크롤
  - 로딩/에러 상태

- [ ] `src/components/blog/blog-post-header.tsx` — 포스트 헤더
  - 제목, 메타데이터 (작성자, 날짜, 읽기시간), 태그

- [ ] `src/components/blog/blog-post-content.tsx` — 포스트 본문
  - Notion 블록 배열 렌더링
  - 코드 블록 구문 강조

- [ ] `src/components/notion/notion-block-renderer.tsx` — Notion 블록 렌더러
  - 텍스트, 제목, 목록, 이미지, 코드, 인용, 테이블 블록 지원
  - Unified + rehype 파이프라인

- [ ] `src/components/blog/blog-post-toc.tsx` — 목차 (TOC)
  - `<h2>`, `<h3>` 자동 추출
  - 스티키 포지셔닝

- [ ] `src/components/blog/blog-post-footer.tsx` — 포스트 하단
  - 관련 포스트 추천 (같은 태그/카테고리)
  - 네비게이션 (이전/다음 포스트)

- [ ] `src/components/blog/blog-post-detail.tsx` — 위 컴포넌트 조립

#### 페이지 구현

- [ ] `src/app/blog/page.tsx` — 블로그 홈 (포스트 목록)
  - `getPublishedPosts()` 호출
  - `Suspense` + `LoadingSkeleton` 적용

- [ ] `src/app/blog/[slug]/page.tsx` — 포스트 상세 (Server Component)
  - `generateStaticParams()` (ISR 최적화)
  - `generateMetadata()` (SEO)

- [ ] `src/app/blog/[slug]/loading.tsx` — 로딩 스켈레톤

- [ ] `src/app/blog/[slug]/error.tsx` — 에러 바운더리

- [ ] `src/app/blog/[slug]/not-found.tsx` — 404 커스텀

- [ ] `src/app/blog/tag/[tag]/page.tsx` — 태그별 필터 페이지

- [ ] `src/app/blog/category/[category]/page.tsx` — 카테고리별 필터 페이지

### ✅ 완료 기준

- 실제 Notion 포스트 ID로 `/blog/[slug]` 접근 시 정상 렌더링
- 포스트 목록 페이지에서 모든 published 포스트 표시
- 태그/카테고리 필터링 동작
- 모바일(375px) / 태블릿(768px) / 데스크톱(1280px) 레이아웃 정상
- `npm run check-all` 통과, `npm run build` 성공

---

## Phase 4: 추가 기능 개발 (2~3일)

### 왜 이 순서인가?

핵심 기능이 동작한 후에야 "어떻게 개선할지"가 명확해진다.  
RSS·사이트맵·다크모드는 UI가 확정된 상태에서 추가해야 빠짐없다.

### 작업 목록

#### RSS 피드 생성

- [ ] `src/app/api/feed.xml/route.ts` — RSS 2.0 / Atom 1.0
  ```typescript
  Response: application / xml
  포함: (제목, 설명, 링크, pubDate)
  ```

#### 사이트맵 및 SEO

- [ ] `src/app/sitemap.ts` — 동적 사이트맵

  ```typescript
  반환: { url, lastModified, changeFrequency, priority }[]
  모든 /blog/[slug] 포함
  ```

- [ ] `src/app/robots.ts` — robots.txt 생성

- [ ] 각 포스트 페이지 `generateMetadata()`
  - `title`, `description` (excerpt)
  - Open Graph (og:title, og:image, og:url)
  - Twitter Card (twitter:card, twitter:image)

#### 다크모드 지원

- [ ] 블로그 컴포넌트 전체 `dark:` 클래스 추가
  - 텍스트 색상, 배경, 테두리
  - 코드 블록 다크 테마

- [ ] ThemeProvider 통합 (기존 `next-themes` 활용)

#### 검색 기능 (선택사항)

- [ ] `src/app/api/search/route.ts` — 텍스트 검색 API
  - 간단한 구현: 클라이언트 측 필터링
  - 고급: Algolia 또는 Meilisearch

- [ ] `src/components/blog/blog-search.tsx` — 검색 폼

#### 접근성 및 성능

- [ ] 블로그 컴포넌트 `aria-label`, `role` 추가
- [ ] 이미지 `alt` 텍스트 검증
- [ ] Next.js `<Image>` 컴포넌트 활용
- [ ] 코드 분할 (동적 import)

#### 에러 처리

- [ ] Notion API 타임아웃 (5초)
- [ ] 포스트 로드 실패 시 폴백 UI
- [ ] 전역 에러 바운더리 `src/app/error.tsx`

### ✅ 완료 기준

- RSS 피드 유효성 검사 (RSS validator 통과)
- 사이트맵에 모든 포스트 URL 포함
- 라이트/다크 모드 전환 정상
- 메타 태그 렌더링 확인 (DevTools)
- Lighthouse SEO 점수 90점 이상

---

## Phase 5: 최적화 및 배포 (1~2일)

### 왜 이 순서인가?

기능 완성 전 최적화는 낭비다. 실제 데이터와 사용 패턴을 본 후 성능 목표를 정한다.

### 작업 목록

#### 캐싱 전략

- [ ] `getPublishedPosts()` — `revalidate: 3600` (1시간)
- [ ] `getPostBySlug()` — `revalidate: 3600`
- [ ] API Routes — `Cache-Control` 헤더 설정
- [ ] Notion 웹훅 시 `revalidateTag()` 호출

#### 성능 최적화

- [ ] 번들 크기 분석 (`npm run build` 로그 확인)
- [ ] 각 페이지 First Load JS < 200KB
- [ ] 이미지 최적화
  - 커버 이미지: `priority`, `sizes` 속성
  - 포스트 인라인 이미지: `loading="lazy"`

#### 빌드 검증

- [ ] `npm run check-all` 통과
- [ ] `npm run build` 성공 (경고 없음)
- [ ] 미사용 import 제거

#### Vercel 배포

- [ ] Vercel 프로젝트 생성
- [ ] 환경변수 설정
  - `NOTION_API_KEY`
  - `NOTION_BLOG_DATABASE_ID`
  - `NEXT_PUBLIC_SITE_URL`

- [ ] 배포 후 E2E 검증
  - 블로그 목록 조회 → 렌더링
  - 포스트 상세 조회 → 본문 표시
  - RSS 피드 다운로드
  - 검색 동작 (있을 경우)

- [ ] Core Web Vitals 측정
  - LCP (Largest Contentful Paint): 2.5초 이하
  - FID (First Input Delay): 100ms 이하
  - CLS (Cumulative Layout Shift): 0.1 이하

### ✅ 완료 기준

- 프로덕션 URL에서 전체 기능 동작
- Vercel Analytics LCP 2.5초 이하
- 포스트 조회·렌더링·검색 E2E 검증 완료
- RSS 피드 유효

---

## Phase 2 이후 — 고도화 로드맵 (포스트 MVP)

> MVP 검증 이후 우선순위에 따라 순차 진행

| 기능          | 설명                         | 난이도 |
| ------------- | ---------------------------- | ------ |
| 댓글          | Disqus / Utterances          | 낮음   |
| 검색          | Algolia / Meilisearch        | 중간   |
| 분석          | Vercel Analytics / Plausible | 낮음   |
| 뉴스레터      | 이메일 구독 (Brevo)          | 중간   |
| 다국어        | i18n (next-intl)             | 중간   |
| 포스트 편집   | Notion ↔ 마크다운 동기화    | 높음   |
| 정적 내보내기 | 전체 사이트 정적 생성        | 높음   |

---

## 개발 규칙

- 모든 작업 완료 시 `npm run check-all` 통과 필수
- 커밋 전 `npm run build` 확인 필수
- 파일명: `kebab-case` / 컴포넌트명: `PascalCase`
- import 경로: 항상 `@/` 절대 경로 사용
- 환경변수: 서버 전용 값은 `NEXT_PUBLIC_` 접두어 사용 금지

---

**문서 버전**: 1.0.0  
**최초 작성**: 2026-04-06  
**기반 PRD**: `@/docs/PRD.md` v1.0.0
