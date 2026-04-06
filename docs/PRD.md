# 📋 Notion CMS Blog - 제품 요구사항서 (PRD)

> **프로젝트**: Notion을 데이터 소스로 하는 완전 관리형 블로그 플랫폼  
> **목표**: Notion DB에서 블로그 포스트를 동적으로 렌더링하고 최적화된 웹 페이지로 제공

---

## 🎯 핵심 요구사항

### 1. **Notion 데이터베이스 연동**

- [ ] Notion API를 통해 블로그 데이터베이스 연동
- [ ] 포스트, 태그, 카테고리 구조화된 데이터 관리
- [ ] 실시간 데이터 동기화 (웹훅 기반 무효화)
- [ ] 공개/비공개 상태 관리

### 2. **블로그 뷰어 및 렌더링**

- [ ] Notion 블록 → HTML 변환 (Unified, remark 플러그인)
- [ ] 모바일 반응형 디자인
- [ ] 다크모드 지원
- [ ] 문법 하이라이팅 (코드 블록)
- [ ] 목차 생성 (Table of Contents)

### 3. **블로그 기능**

- [ ] 포스트 목록 페이지 (페이지네이션/무한 스크롤)
- [ ] 포스트 상세 페이지
- [ ] 태그별/카테고리별 필터링
- [ ] 검색 기능 (전체 텍스트 검색)
- [ ] 관련 포스트 추천

### 4. **SEO 및 배포**

- [ ] 메타 태그 (OG, Twitter Card)
- [ ] 동적 사이트맵 생성
- [ ] RSS/Atom 피드
- [ ] robots.txt 설정
- [ ] 정적 생성 (ISR) / 동적 렌더링 최적화

### 5. **성능 최적화**

- [ ] Next.js 이미지 최적화
- [ ] 캐싱 전략 (revalidate, tags)
- [ ] 코드 분할
- [ ] Core Web Vitals 최적화

---

## 📦 기술 스택

```
Frontend:
- Next.js 15.5.3 (App Router, Turbopack)
- React 19 + TypeScript 5
- TailwindCSS v4 + shadcn/ui
- React Hook Form + Zod

Backend:
- Server Actions (Next.js)
- Notion API SDK (@notionhq/client)
- Unified (AST 기반 렌더링)
- Remark/Rehype (Markdown 처리)

External:
- Notion Workspace (데이터 소스)
- Vercel (배포)
```

---

## 🏗️ 페이지 구조

```
/                              # 블로그 홈 (최신 포스트 목록)
├── /blog/[slug]                # 포스트 상세 페이지
├── /blog/tag/[tag]             # 태그별 포스트 목록
├── /blog/category/[category]   # 카테고리별 포스트 목록
├── /about                       # 소개 페이지
├── /api/
│   ├── /api/posts              # 포스트 목록 API
│   ├── /api/posts/[slug]       # 포스트 상세 API
│   ├── /api/search             # 검색 API
│   ├── /api/feed.xml           # RSS/Atom 피드
│   └── /api/notion/sync        # Notion 웹훅 (무효화)
└── /sitemap.xml                # 사이트맵
```

---

## 💾 데이터 모델

### BlogPost

```typescript
interface BlogPost {
  id: string // Notion Page ID
  slug: string // URL slug (index)
  title: string // 포스트 제목
  excerpt: string // 요약 (최대 160자)
  content: NotionBlock[] // Notion 블록 배열 (렌더링용)
  tags: string[] // 태그 배열
  category: string // 카테고리 (1개)
  author: string // 작성자명
  coverImage?: string // 커버 이미지 URL
  publishedAt: Date // 발행 일시
  updatedAt: Date // 수정 일시
  status: 'draft' | 'published' // 상태
  readingTime: number // 예상 읽기 시간 (분)
}
```

### Notion Database Schema

| Property       | Type     | 설명              |
| -------------- | -------- | ----------------- |
| Title          | 텍스트   | 포스트 제목       |
| Slug           | 텍스트   | URL slug (고유값) |
| Status         | 선택     | Draft / Published |
| Tags           | 멀티선택 | 태그 목록         |
| Category       | 선택     | 카테고리 (단일)   |
| Author         | 텍스트   | 작성자명          |
| Published Date | 날짜     | 발행 일시         |
| Excerpt        | 텍스트   | 요약 (최대 160자) |
| Cover Image    | URL      | 커버 이미지 링크  |

---

## 🎨 UI 컴포넌트

```
components/
├── blog/
│   ├── blog-post-card.tsx          # 포스트 카드 (목록용)
│   ├── blog-post-list.tsx          # 포스트 목록 컨테이너
│   ├── blog-post-detail.tsx        # 포스트 상세 뷰
│   ├── blog-post-header.tsx        # 포스트 헤더 (제목, 메타)
│   ├── blog-post-content.tsx       # 포스트 본문 (Notion 렌더러)
│   ├── blog-post-toc.tsx           # 목차 (TOC)
│   ├── blog-post-footer.tsx        # 하단 (관련 포스트)
│   └── blog-search.tsx             # 검색 폼
├── shared/
│   ├── tag-badge.tsx              # 태그 배지
│   ├── category-badge.tsx         # 카테고리 배지
│   ├── reading-time.tsx           # 읽기 시간 표시
│   └── pagination.tsx             # 페이지네이션
└── notion/
    └── notion-block-renderer.tsx  # Notion 블록 렌더러
```

---

## 🔌 API Routes

### `GET /api/posts`

포스트 목록 조회 (페이지네이션)

```typescript
Query:
  - page: number (기본값: 1)
  - limit: number (기본값: 10)
  - tag?: string
  - category?: string
  - search?: string

Response:
{
  success: boolean
  data: BlogPost[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
```

### `GET /api/posts/[slug]`

포스트 상세 조회

```typescript
Response:
{
  success: boolean
  data: BlogPost
  relatedPosts?: BlogPost[] (최대 3개)
}
```

### `GET /api/feed.xml`

RSS 2.0 / Atom 1.0 피드 생성

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog Title</title>
    <link>https://example.com</link>
    <item>...</item>
  </channel>
</rss>
```

### `POST /api/notion/sync`

Notion 웹훅 (포스트 변경 감지 → 캐시 무효화)

```typescript
Body: {
  type: 'page.created' | 'page.updated' | 'page.deleted'
  page_id: string
}
```

---

## 📱 반응형 디자인

| 기기    | 너비           | 전략                   |
| ------- | -------------- | ---------------------- |
| Mobile  | < 640px        | 단일 컬럼, 터치 친화적 |
| Tablet  | 640px ~ 1024px | 2단 레이아웃           |
| Desktop | > 1024px       | 고정폭 (max-w-4xl)     |

---

## 🔐 보안 고려사항

- [ ] Notion API 키 환경변수 관리 (서버 전용)
- [ ] Rate limiting (API 엔드포인트)
- [ ] 공개 상태 포스트만 노출
- [ ] CORS 설정
- [ ] Content Security Policy (CSP) 헤더

---

## ✅ MVP 체크리스트

### Phase 1: 프로젝트 골격

- [ ] Notion API 환경 설정
- [ ] 라우트 구조 생성
- [ ] TypeScript 타입 정의

### Phase 2: 공통 모듈

- [ ] Notion 클라이언트 싱글톤
- [ ] 포스트 매퍼 (Notion → BlogPost)
- [ ] 유틸리티 함수 (서식, 시간 등)

### Phase 3: 핵심 기능

- [ ] 포스트 목록 페이지
- [ ] 포스트 상세 페이지
- [ ] Notion 블록 렌더러
- [ ] 태그/카테고리 필터링
- [ ] 검색 API

### Phase 4: 추가 기능

- [ ] RSS 피드
- [ ] 사이트맵
- [ ] 목차 생성
- [ ] 다크모드
- [ ] SEO 최적화

### Phase 5: 최적화 및 배포

- [ ] 성능 최적화 (Core Web Vitals)
- [ ] 캐싱 전략
- [ ] Vercel 배포
- [ ] E2E 검증

---

## 📈 고도화 로드맵 (포스트 MVP)

| 기능          | 설명                         | 난이도 |
| ------------- | ---------------------------- | ------ |
| 포스트 검색   | 전체 텍스트 검색 (Algolia)   | 중간   |
| 댓글 시스템   | Disqus / Utterances 통합     | 낮음   |
| 분석          | Vercel Analytics / Plausible | 낮음   |
| 뉴스레터      | 이메일 구독 (Brevo)          | 중간   |
| 다국어        | i18n (next-intl)             | 중간   |
| 에디터        | Notion → 마크다운 동기화     | 높음   |
| 정적 내보내기 | 전체 사이트 정적 생성        | 높음   |

---

## 📝 개발 규칙

- 모든 작업 완료 시 `npm run check-all` 통과 필수
- 커밋 전 `npm run build` 확인 필수
- 파일명: `kebab-case` / 컴포넌트명: `PascalCase`
- import 경로: 항상 `@/` 절대 경로 사용
- 환경변수: 서버 전용 값은 `NEXT_PUBLIC_` 접두어 사용 금지

---

**문서 버전**: 1.0.0  
**작성일**: 2026-04-06  
**상태**: MVP 개발 대기
