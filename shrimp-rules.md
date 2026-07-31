# 개발 규칙 (AI Agent 전용)

> 이 문서는 **AI 코딩 에이전트 전용 운영 규칙**이다. 일반 개발 지식은 담지 않는다.
> 사람이 읽는 설명 문서는 `CLAUDE.md`와 `docs/guides/*`를 참조한다.

---

## 1. 프로젝트 개요

- 디렉터리명은 `invoice-web`이지만 **실제 프로젝트는 `notion-cms-blog`** (`package.json`의 `name`)이다.
- ❌ 폴더명만 보고 인보이스·청구서·결제 관련 기능을 추가하지 말 것.
- ✅ 이 프로젝트는 **Notion Database를 CMS로 사용하는 블로그**다. 모든 콘텐츠는 Notion API에서 온다.
- 스택: Next.js 15.5.3 (App Router + Turbopack) · React 19.1.0 · TypeScript 5 · TailwindCSS v4 · shadcn/ui (new-york) · `@notionhq/client` v5 · Zod v4
- 개발 단계는 `docs/ROADMAP.md`에서 Phase 1~5 모두 완료 상태다. 신규 작업은 기존 구조를 **확장**하는 방향으로만 진행한다.

---

## 2. 아키텍처 및 디렉터리 규칙

| 경로                         | 규칙                                                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `src/lib/notion/`            | Notion API 호출은 **이 폴더 안에서만** 한다. 페이지·컴포넌트·API Route에서 `@notionhq/client`를 직접 import 금지    |
| `src/lib/types/`             | 앱 전역 TypeScript 타입(`BlogPost`, `BlogPostSummary`, `ApiResponse`). **타입 import는 항상 여기서**                |
| `src/lib/schemas/`           | Zod 런타임 검증 전용. API 응답 `.parse()`에만 사용. 동일 이름 타입을 export하지만 **타입 import 용도로 쓰지 말 것** |
| `src/components/ui/`         | shadcn 자동 생성물. **수동 편집 금지**. 추가는 `npx shadcn@latest add <name>`로만                                   |
| `src/components/blog/`       | 블로그 도메인 컴포넌트                                                                                              |
| `src/components/shared/`     | 도메인 무관 재사용 컴포넌트(배지, 스켈레톤, 페이지네이션)                                                           |
| `src/components/layout/`     | `header`, `footer`, `container`                                                                                     |
| `src/components/navigation/` | `main-nav`, `mobile-nav`                                                                                            |
| `src/components/notion/`     | Notion 블록 렌더러                                                                                                  |
| `src/components/sections/`   | 랜딩 페이지 섹션(`hero`, `features`, `cta`)                                                                         |
| `src/components/providers/`  | Context Provider                                                                                                    |
| `docs/guides/`               | 상세 패턴 문서. 규칙 문서는 내용을 복제하지 말고 **참조만** 한다                                                    |

**신규 컴포넌트 배치**: 위 폴더 중 하나를 선택한다. ❌ 새 최상위 폴더를 임의로 만들지 말 것. `src/hooks/`는 아직 없으며, 커스텀 훅이 처음 필요할 때만 생성한다(`components.json`에 `@/hooks` 별칭이 이미 정의됨).

**파일명**: 모두 kebab-case (`blog-post-card.tsx`). 컴포넌트 함수명만 PascalCase (`BlogPostCard`). 이름 있는 export 사용 — ❌ `export default`로 컴포넌트를 내보내지 말 것(App Router의 `page.tsx`/`layout.tsx`/`route.ts`는 예외).

---

## 3. 코드 스타일 (강제)

`.prettierrc` 설정과 **정확히** 일치시킬 것. LLM 기본 출력과 다르므로 주의한다.

- ❌ 세미콜론 금지 (`semi: false`)
- ✅ 작은따옴표 (`singleQuote: true`)
- ✅ 화살표 함수 단일 인자에 괄호 없음 (`arrowParens: avoid`) → `post => post.id` (❌ `(post) => post.id`)
- ✅ 들여쓰기 2칸, `printWidth: 80`, `trailingComma: es5`, `endOfLine: lf`
- ✅ Tailwind 클래스 순서는 `prettier-plugin-tailwindcss`가 결정한다. 수동 정렬 금지

**import 경로**

- ✅ `@/` 별칭 사용: `import { cn } from '@/lib/utils'`
- ❌ `../../lib/utils` 형태의 상위 상대 경로 금지
- ✅ 예외: `src/lib/notion/` 내부 형제 모듈은 기존 관례대로 `./client`, `./blog-post-mapper` 사용

**주석 · JSDoc**

- 코드 주석은 **한국어**로 작성
- 유틸/데이터 함수에는 한국어 JSDoc(`@param`, `@returns`)을 붙인다. `src/lib/utils.ts`, `src/lib/notion/database.ts` 패턴을 그대로 따를 것

---

## 4. Notion 데이터 계층 규칙

**Notion Database 속성명은 아래와 정확히 일치해야 한다** (`src/lib/notion/blog-post-mapper.ts`에 하드코딩):

`Title`(title) · `Slug`(rich_text) · `Excerpt`(rich_text) · `Author`(rich_text) · `Category`(select) · `Tags`(multi_select) · `Published Date`(date) · `Cover Image`(url) · `Status`(select: `published` | `draft`)

- ✅ 새 조회 함수는 `src/lib/notion/database.ts`에만 추가한다.
- ✅ 모든 공개 조회는 `Status = published` 필터를 **반드시** 포함한다.
- ✅ 에러 처리는 기존 관례를 따른다: `try/catch` → `console.error` → 빈 배열 또는 `null` 반환. ❌ 데이터 계층에서 throw 금지 (페이지가 500으로 죽는다).
- ✅ Notion 페이지 → 앱 타입 변환은 `mapNotionPageToBlogPost()`만 사용한다. 컴포넌트에서 raw Notion 응답을 직접 다루지 말 것.
- ⚠️ `(notion.databases as any)` + `eslint-disable-next-line @typescript-eslint/no-explicit-any`는 `@notionhq/client` v5 타입 한계로 인한 **기존 부채**다. 기존 코드는 유지하되, **신규 코드에서 `any` 사용을 확대하지 말 것**.

---

## 5. 라우트 및 렌더링 규칙

- ✅ `params`와 `searchParams`는 **Promise**다. 반드시 `const { slug } = await params`로 언랩한다 (`src/app/blog/[slug]/page.tsx` 참조).
- ✅ 페이지는 기본 서버 컴포넌트로 작성한다. `'use client'`는 상태·이벤트 핸들러·브라우저 API가 필요한 최말단 컴포넌트에만 붙인다.
- ✅ 데이터 페칭 구간은 `<Suspense>`로 감싸고 fallback은 `@/components/shared/loading-skeleton`의 스켈레톤을 사용한다.
- ✅ 상세 페이지에는 `generateMetadata`를 구현한다. 제목·설명·`openGraph`를 포스트 데이터로 채운다.
- ✅ 오류 UI는 라우트 세그먼트별 `error.tsx` / `not-found.tsx` / `loading.tsx` 규약을 따른다.

**API Route 규칙** (`src/app/api/**/route.ts`)

- ✅ `Response.json()` 사용 (❌ `NextResponse` 혼용 금지 — 기존 코드 전부 `Response.json`)
- ✅ 사용자 노출 에러 메시지는 **한국어**: `{ error: '유효하지 않은 페이지 번호입니다.' }`
- ✅ 성공 응답은 `ApiPaginatedResponseSchema` 또는 `ApiResponseSchema`로 `.parse()`한 뒤 반환
- ✅ `Cache-Control` 헤더를 명시한다 (목록 `s-maxage=3600`, 검색 `s-maxage=600` 기준)
- ✅ `limit`은 `Math.min(..., 100)`으로 상한을 건다

---

## 6. 다중 파일 연동 규칙 ⚠️ (누락 시 런타임 실패)

| 변경 내용                 | 반드시 함께 수정할 파일                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| 환경변수 추가             | `src/lib/env.ts`(Zod 스키마) + `.env.local.example` + Vercel 환경변수 + `DEPLOYMENT.md`              |
| 외부 이미지 도메인 사용   | `next.config.ts`의 `images.remotePatterns`                                                           |
| 새 공개 라우트 추가       | `src/app/sitemap.ts` (비공개 경로면 `src/app/robots.ts`의 `disallow`)                                |
| `BlogPost` 필드 추가/변경 | `src/lib/types/blog-post.ts` + `src/lib/schemas/blog-post.ts` + `src/lib/notion/blog-post-mapper.ts` |
| 캐시 무효화 태그 변경     | `src/lib/notion/database.ts`의 `CACHE_TAGS` + `src/app/api/notion/sync/route.ts`의 `revalidateTag`   |
| 새 Notion 블록 타입 지원  | `src/components/notion/notion-block-renderer.tsx`의 `renderBlock` switch + 하위 Block 컴포넌트       |
| 개발 단계 완료            | `docs/ROADMAP.md` 체크박스 갱신                                                                      |
| 새 npm script 추가        | `package.json` + 필요 시 `CLAUDE.md`의 명령어 섹션                                                   |

---

## 7. 폼 처리 규칙

- ✅ **신규 폼은 React Hook Form + Zod + `@/components/ui/form`** 조합으로 작성한다. 상세 패턴은 `docs/guides/forms-react-hook-form.md` 참조.
- ✅ 검증 스키마는 Zod로 정의하고 `@hookform/resolvers/zod`로 연결한다.
- ❌ `src/components/login-form.tsx`와 `src/components/signup-form.tsx`를 템플릿으로 복사하지 말 것. 두 파일은 `useState` 수동 검증 + `console.log` 제출로 남아 있는 **미완성 레거시**이며 인증 백엔드가 연결되어 있지 않다.

---

## 8. 스타일링 규칙

- ⚠️ TailwindCSS v4다. **`tailwind.config.ts` 파일이 존재하지 않는다.** 테마 토큰은 `src/app/globals.css`의 `@theme inline` 블록과 CSS 변수로 관리한다. 설정 변경이 필요하면 `globals.css`를 수정한다.
- ✅ 시맨틱 토큰만 사용: `bg-background`, `bg-card`, `text-muted-foreground`, `border-border`, `text-primary`
- ❌ 하드코딩 색상 금지: `bg-[#ffffff]`, `text-gray-500`, `bg-slate-900`
- ✅ 다크 모드는 `next-themes`의 class 전략이다. 색상을 다루는 모든 마크업은 시맨틱 토큰으로 자동 대응되게 하고, 불가피할 때만 `dark:` 변형을 추가한다.
- ✅ 조건부 클래스 병합은 `cn()` (`@/lib/utils`)만 사용한다.
- ✅ 토스트는 `sonner`를 사용한다 (`<Toaster />`가 `src/app/layout.tsx`에 이미 마운트됨). ❌ 별도 알림 라이브러리 추가 금지.
- ✅ 아이콘은 `lucide-react`만 사용한다.

---

## 9. 금지 사항 ❌

- `src/components/ui/*` 파일 수동 편집, 또는 shadcn이 제공하는 프리미티브를 직접 구현
- 클라이언트 컴포넌트(`'use client'`)에서 `@/lib/env` import — `env.ts`는 import 시점에 `NOTION_API_KEY`를 Zod로 검증하므로 즉시 예외가 발생하고 서버 키가 번들에 노출될 위험이 있다. 클라이언트에는 `process.env.NEXT_PUBLIC_*`를 직접 쓴다.
- `.env`, `.env.local` 커밋 (`.gitignore`에 `.env*` 등록됨). 예시 값 변경은 `.env.local.example`에만 반영한다.
- 디버깅용 `console.log`를 남긴 채 커밋 (데이터 계층의 `console.error`는 로깅 계층 도입 전까지 허용된 기존 코드)
- 테스트 코드 임의 추가 — 이 프로젝트에는 **테스트 프레임워크가 설치되어 있지 않다**. 테스트 도입은 사용자 지시가 있을 때만 한다.
- 새 상태 관리 라이브러리·HTTP 클라이언트·UI 라이브러리 추가 (기존: React 내장 상태 + `fetch` + shadcn/ui)
- Windows 셸에서 대괄호 라우트 디렉터리를 생성할 때 이스케이프 누락 — `src/app/blog/{[slug]}` 빈 디렉터리가 실제로 이렇게 만들어졌다. 라우트 폴더는 도구(Write)로 파일 경로를 지정해 생성할 것.
- 작업 완료 보고 전 `npm run check-all` 및 `npm run build` 미실행

---

## 10. 워크플로 규칙

작업 종료 전 아래 순서로 반드시 검증한다.

```bash
npm run check-all   # typecheck + lint + format:check
npm run build       # 프로덕션 빌드 성공 확인
```

- `check-all` 실패 시 `npm run lint:fix`와 `npm run format`으로 자동 수정 후 재검증한다.
- 커밋 시 husky `pre-commit`이 lint-staged를, `post-commit`이 Slack 알림을 실행한다. ❌ `--no-verify`로 훅을 건너뛰지 말 것.
- 커밋 메시지는 **한국어**로 작성한다.

---

## 11. AI 의사결정 우선순위

규칙이 충돌할 때 아래 순서로 판단한다.

1. 이 문서 (`shrimp-rules.md`)
2. `CLAUDE.md` (프로젝트) → `~/.claude/CLAUDE.md` (사용자 전역)
3. `docs/guides/*` 상세 가이드
4. 기존 코드의 실제 관례
5. 일반 모범 사례

**모호한 상황 판단 기준**

| 상황                           | 판단                                                                       |
| ------------------------------ | -------------------------------------------------------------------------- |
| 기존 코드가 이 문서와 다름     | 기존 코드를 따르고, 문서 갱신을 사용자에게 **제안**한다 (임의 리팩터링 ❌) |
| 타입을 import해야 함           | `src/lib/types/`에서 가져온다 (`src/lib/schemas/`는 검증 전용)             |
| Notion 데이터가 필요함         | `src/lib/notion/database.ts`의 기존 함수를 먼저 찾고, 없을 때만 추가한다   |
| UI 프리미티브가 필요함         | `src/components/ui/`를 먼저 확인 → 없으면 `npx shadcn@latest add`          |
| 새 의존성이 필요해 보임        | 추가 전 사용자에게 확인한다                                                |
| 요구사항이 두 가지로 해석 가능 | `docs/PRD.md`와 `docs/ROADMAP.md`를 확인하고, 그래도 모호하면 질문한다     |
