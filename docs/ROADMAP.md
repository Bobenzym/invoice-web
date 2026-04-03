# 🗺️ 견적서 웹 뷰어 - 개발 로드맵

> **프로젝트**: 견적서 웹 뷰어 MVP
> **기반 문서**: `@/docs/PRD.md`
> **시작일**: 2026-04-04
> **기술 스택**: Next.js 15.5.3 · React 19 · TypeScript · TailwindCSS v4 · shadcn/ui · Notion API · Puppeteer

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

폴더 구조·의존성·환경변수가 확정되지 않으면 이후 모든 작업이 제각각 방향으로 흘러간다.
나중에 구조를 바꾸면 import 경로, 환경변수 참조, 빌드 설정을 한꺼번에 수정해야 하므로
**가장 먼저 뼈대를 세우고 흔들리지 않게** 만든다.

### 작업 목록

#### 프로젝트 구조 설정

- [ ] 페이지 라우트 골격 생성
  - `src/app/invoice/[id]/` — 견적서 상세 페이지
  - `src/app/invoice/[id]/pdf/` — PDF 다운로드 API
  - `src/app/share/[token]/` — 공유 링크 (비로그인)
  - `src/app/api/invoice/[id]/` — 견적서 조회 API
  - `src/app/api/invoice/[id]/pdf/` — PDF 생성 API
  - `src/app/api/share/[token]/` — 공유 토큰 검증 API
  - `src/app/api/notion/sync/` — Notion 웹훅 동기화
- [ ] 컴포넌트 폴더 골격 생성
  - `src/components/invoice/` — 견적서 뷰어 컴포넌트
  - `src/components/pdf/` — PDF 템플릿 컴포넌트
  - `src/components/shared/` — 공통 UI 컴포넌트
- [ ] 라이브러리 폴더 골격 생성
  - `src/lib/notion/` — Notion 클라이언트 및 유틸
  - `src/lib/types/` — 공유 TypeScript 타입
  - `src/lib/schemas/` — Zod 유효성 스키마

#### 환경 설정

- [ ] 의존성 설치
  ```bash
  npm install @notionhq/client puppeteer jose
  ```
- [ ] `.env.local.example` 파일 생성
  ```
  NOTION_API_KEY=
  NOTION_DATABASE_ID=
  SHARE_TOKEN_SECRET=
  NEXT_PUBLIC_APP_URL=
  ```
- [ ] `src/lib/env.ts` — Zod 환경변수 스키마에 Notion 관련 변수 추가
  - `NOTION_API_KEY`, `NOTION_DATABASE_ID`, `SHARE_TOKEN_SECRET`
  - 서버 전용 변수 — `NEXT_PUBLIC_` 접두어 사용 금지

#### 기본 레이아웃 구조 생성

- [ ] `src/app/invoice/layout.tsx` — 견적서 페이지 공통 레이아웃 (인쇄 최적화 CSS 포함)
- [ ] `src/app/share/layout.tsx` — 공유 링크 전용 레이아웃 (헤더 없는 미니멀)

### ✅ 완료 기준

- `npm run check-all` 통과 (TS 오류 없음, 린트 통과)
- `npm run build` 성공 (빈 페이지라도 컴파일 오류 없음)
- `.env.local.example` 파일 리포지터리에 커밋됨
- 모든 폴더/파일이 `kebab-case` 네이밍 컨벤션 준수

---

## Phase 2: 공통 모듈 개발 (2~3일)

### 왜 이 순서인가?

Notion 클라이언트·공유 토큰·유틸 함수는 API Route와 페이지 전체에서 공유된다.
공통 UI 컴포넌트(스켈레톤, 에러 폴백)도 모든 페이지에서 import된다.
이 기반 없이 핵심 기능을 개발하면 **동일한 코드가 여러 곳에 중복**되고,
나중에 수정할 때 한 곳만 고쳐서 버그가 생긴다.
타입 정의도 이 단계에서 확정한다 — 모든 레이어의 계약이기 때문에 핵심 기능 개발 전에 고정해야 한다.

### 작업 목록

#### 공통 타입 정의

- [ ] `src/lib/types/invoice.ts` — `Invoice`, `InvoiceItem`, `InvoiceStatus` 인터페이스

  ```typescript
  interface Invoice {
    id: string // Notion Page ID
    title: string
    client: { name: string; email: string }
    amount: number
    currency: 'KRW' | 'USD' | 'EUR'
    dueDate: Date
    items: InvoiceItem[]
    status: 'draft' | 'sent' | 'viewed' | 'paid'
    notes?: string
    createdAt: Date
    updatedAt: Date
  }

  interface InvoiceItem {
    id: string
    name: string
    quantity: number
    unitPrice: number
    taxRate: number // 0~100
    subtotal: number // quantity * unitPrice
    tax: number // subtotal * (taxRate / 100)
    total: number // subtotal + tax
  }
  ```

- [ ] `src/lib/types/share.ts` — `ShareToken`, `ShareTokenPayload` 타입
- [ ] `src/lib/types/api.ts` — `ApiResponse<T>`, `ApiError` 공통 응답 래퍼 타입
- [ ] `src/lib/schemas/invoice.ts` — Invoice Zod 유효성 스키마 (API 응답 파싱용)
- [ ] `src/lib/schemas/share.ts` — 공유 토큰 Zod 스키마

#### Notion API 공통 함수

- [ ] `src/lib/notion/client.ts` — `@notionhq/client` 싱글톤 인스턴스 생성
- [ ] `src/lib/notion/invoice-mapper.ts` — Notion Page 응답 → `Invoice` 타입 변환
  - `mapNotionPageToInvoice(page: PageObjectResponse): Invoice`
  - `mapNotionPageToInvoiceItem(block: BlockObjectResponse): InvoiceItem`
  - Notion Property 타입별 파싱 처리 (텍스트, 숫자, 날짜, 선택)
- [ ] `src/lib/notion/database.ts` — 데이터베이스 조회 함수
  - `getInvoiceById(id: string): Promise<Invoice>`
  - `listInvoices(): Promise<Invoice[]>`
- [ ] Notion API 실제 연결 수동 테스트 (콘솔에서 데이터 조회 확인)

#### 공유 토큰 공통 함수

- [ ] `src/lib/share-token.ts`
  - `generateShareToken(invoiceId: string, expiresInHours?: number): string`
  - `verifyShareToken(token: string): ShareTokenPayload | null`
  - HMAC 서명, 만료 시간 검증 포함

#### 공통 유틸리티 함수

- [ ] `src/lib/utils.ts` — 기존 `cn()` 유지, 아래 함수 추가
  - `formatCurrency(amount: number, currency: string, locale?: string): string`
  - `formatDate(date: Date, locale?: string): string`
  - `calculateInvoiceTotals(items: InvoiceItem[]): { subtotal, tax, total }`

#### 공통 컴포넌트 (Header, 공유 UI)

- [ ] `src/components/shared/loading-skeleton.tsx` — 견적서 뷰어 전용 스켈레톤
  - shadcn/ui `Skeleton` 컴포넌트 활용
- [ ] `src/components/shared/error-fallback.tsx` — 에러 메시지 표시
  - `error: Error`, `reset: () => void` props
  - "다시 시도" 버튼 포함
- [ ] `src/components/shared/status-badge.tsx` — 견적서 상태 배지
  - draft / sent / viewed / paid 상태별 색상 적용
  - shadcn/ui `Badge` 컴포넌트 래핑

### ✅ 완료 기준

- `getInvoiceById(id)` 호출 시 실제 Notion 데이터를 `Invoice` 타입으로 반환
- `generateShareToken` / `verifyShareToken` 동작 확인 (단위 테스트 또는 콘솔 확인)
- `LoadingSkeleton`, `ErrorFallback`, `StatusBadge` 컴포넌트 렌더링 확인
- `npm run check-all` 통과

---

## Phase 3: 핵심 기능 개발 (3~4일)

### 왜 이 순서인가?

견적서 조회·PDF 다운로드·공유 링크가 이 서비스의 존재 이유다.
이것이 동작하지 않으면 나머지는 의미가 없으므로 **가장 먼저 완성**해야 한다.
개발 순서는 **API Route → 서버 컴포넌트 → 클라이언트 컴포넌트**로,
데이터 계층이 먼저 안정되어야 UI를 Mock 없이 실제 데이터로 검증할 수 있다.

### 작업 목록

#### API Routes 구현

- [ ] `src/app/api/invoice/[id]/route.ts` — `GET` 핸들러
  - `getInvoiceById()` 호출, 존재하지 않는 ID → 404
  - 응답: `ApiResponse<Invoice>` 형태
- [ ] `src/app/api/share/[token]/route.ts` — `GET` 핸들러
  - `verifyShareToken()` 호출
  - 유효하지 않은 토큰 → 401, 만료 → 403
- [ ] `src/app/api/notion/sync/route.ts` — `POST` 핸들러
  - Notion 웹훅 수신, 향후 캐시 무효화 트리거

#### PDF 생성 기능

- [ ] `src/app/api/invoice/[id]/pdf/route.ts` — `POST` 핸들러
  - Puppeteer로 `/invoice/[id]?print=true` 렌더링
  - `Content-Type: application/pdf` 스트림 반환
  - `Content-Disposition: attachment; filename="invoice-{id}.pdf"` 헤더
- [ ] `src/components/pdf/invoice-pdf-template.tsx` — PDF 전용 HTML 템플릿
  - `@media print` 스타일 적용, A4 고정 폭 레이아웃
  - 로고·워터마크 슬롯 포함

#### 견적서 뷰어 컴포넌트 (7개)

> 개발 순서: header → details → items → total → footer → actions → viewer (조립)

- [ ] `src/components/invoice/invoice-header.tsx` — 회사 로고, 견적서 번호, 발행일
- [ ] `src/components/invoice/invoice-details.tsx` — 클라이언트 정보, 상태 배지, 유효기간
- [ ] `src/components/invoice/invoice-items.tsx` — 항목 테이블 (품목명/수량/단가/세율/소계)
  - 모바일에서 카드형으로 전환 (반응형)
  - shadcn/ui `Table` 컴포넌트 활용
- [ ] `src/components/invoice/invoice-total.tsx` — 소계/세금/총합계
  - `calculateInvoiceTotals()`, `formatCurrency()` 유틸 사용
- [ ] `src/components/invoice/invoice-footer.tsx` — 비고(Notes), 약관/서명란 슬롯
- [ ] `src/components/invoice/invoice-actions.tsx` — 액션 버튼 모음
  - PDF 다운로드 (로딩 상태 포함)
  - 공유 링크 복사
  - 인쇄 (`window.print()`)
- [ ] `src/components/invoice/invoice-viewer.tsx` — 위 6개 컴포넌트 조립
  - `print=true` 쿼리 파라미터 시 액션 버튼 숨김

#### 페이지 구현

- [ ] `src/app/page.tsx` — 홈페이지 (서비스 소개, CTA)
- [ ] `src/app/invoice/[id]/page.tsx` — 견적서 상세 (Server Component)
  - `Suspense` + `LoadingSkeleton` 적용
- [ ] `src/app/invoice/[id]/loading.tsx` — 로딩 스켈레톤
- [ ] `src/app/invoice/[id]/error.tsx` — 에러 바운더리
- [ ] `src/app/invoice/[id]/not-found.tsx` — 404 커스텀 페이지
- [ ] `src/app/share/[token]/page.tsx` — 공유 링크 페이지
  - 서버사이드 토큰 검증 → 유효 시 `InvoiceViewer` 렌더링
  - 만료 시 안내 UI 표시

### ✅ 완료 기준

- 실제 Notion 견적서 ID로 `/invoice/[id]` 접근 시 데이터 정상 렌더링
- PDF 다운로드 버튼 클릭 시 A4 포맷 PDF 파일 다운로드
- `/share/[token]` 공유 링크로 비로그인 접근 시 견적서 조회 가능
- 만료 토큰 접근 시 에러 안내 페이지 표시
- 모바일(375px) / 태블릿(768px) / 데스크톱(1280px) 레이아웃 정상 동작
- `npm run check-all` 통과, `npm run build` 성공

---

## Phase 4: 추가 기능 개발 (2~3일)

### 왜 이 순서인가?

핵심 기능이 동작한 뒤에야 "무엇을 개선해야 하는지"가 명확해진다.
다크모드·인쇄·접근성은 핵심 기능의 UI가 확정된 상태에서 검증해야 빠짐없이 점검할 수 있다.
보안 강화도 실제 클라이언트에게 링크를 공유하기 **직전**에 완료해야 한다.

### 작업 목록

#### 다크모드 지원

- [ ] 견적서 뷰어 컴포넌트 전체 `dark:` 클래스 누락 점검
- [ ] PDF 생성 시 다크모드 강제 비활성화 (흰 배경 고정)
  - `invoice-pdf-template.tsx`에 `color-scheme: light` 강제 적용
- [ ] `ThemeProvider` 기반 다크모드 토글 헤더에 배치

#### 인쇄 최적화

- [ ] `src/app/invoice/layout.tsx` — `@media print` CSS 규칙 추가
  - 헤더/네비게이션·액션 버튼 숨김
  - 인쇄용 여백·폰트 크기 조정
- [ ] `invoice-items.tsx` — 인쇄 시 테이블 페이지 분리 방지 (`break-inside: avoid`)

#### SEO 최적화

- [ ] `src/app/invoice/[id]/page.tsx` — `generateMetadata()` 추가
  - 견적서명을 `<title>`로 설정
- [ ] `src/app/share/[token]/page.tsx` — 공유 페이지 메타태그 설정
- [ ] `src/app/sitemap.ts` — 사이트맵 생성
- [ ] `src/app/robots.ts` — 크롤러 접근 제어 설정

#### 보안 강화

- [ ] API Route 전체 — Rate Limiting 헤더 추가
- [ ] 공유 링크 만료 시간 설정 (기본값: 72시간)
- [ ] `Content-Security-Policy` 헤더 `next.config.ts`에 추가
- [ ] Notion API 키 서버사이드 전용 확인 (`NEXT_PUBLIC_` 접두어 없음 검증)

#### 접근성 (Accessibility)

- [ ] 견적서 컴포넌트 전체 `aria-label` 누락 점검
- [ ] `invoice-items.tsx` 테이블 `<caption>`, `scope` 속성 추가
- [ ] 키보드 네비게이션 — PDF 다운로드·공유 버튼 포커스 순서 확인
- [ ] 색상 대비 WCAG 2.1 AA 기준 충족 확인 (특히 `StatusBadge`)

#### 에러 처리 강화

- [ ] Notion API 타임아웃 처리 (5초 초과 시 fallback)
- [ ] PDF 생성 실패 시 명확한 에러 메시지 표시
- [ ] `src/app/not-found.tsx` — 전역 404 커스텀 페이지
- [ ] `src/app/error.tsx` — 전역 에러 바운더리

### ✅ 완료 기준

- 라이트/다크 모드 전환 시 모든 컴포넌트 색상 정상 표시
- `window.print()` 실행 시 액션 버튼 없는 인쇄 친화적 레이아웃 출력
- Chrome DevTools Accessibility 탭에서 주요 위반 사항 없음
- 잘못된 Notion ID / 만료 토큰 / 서버 오류 각 시나리오에서 적절한 UI 표시
- Lighthouse SEO 점수 90점 이상

---

## Phase 5: 최적화 및 배포 (1~2일)

### 왜 이 순서인가?

기능이 완성되기 전에 최적화하면 **존재하지 않는 문제를 미리 푸는 셈**이다.
실제 데이터와 사용 패턴을 보고 나서 캐싱 전략과 성능 목표를 결정해야 낭비가 없다.
배포는 모든 기능이 로컬에서 E2E 검증된 후 마지막에 진행한다.

### 작업 목록

#### 성능 최적화

- [ ] Next.js `fetch` 캐싱 전략 설정
  - `getInvoiceById()` — `revalidate: 60` 또는 `tags` 기반 On-Demand Revalidation
  - `api/notion/sync` 웹훅 수신 시 해당 태그 무효화
- [ ] `next/image` — 로고 이미지 `priority`, `sizes` 속성 최적화
- [ ] Puppeteer 서버리스 환경 대응
  - `puppeteer-core` + `@sparticuz/chromium` 전환 (Vercel 바이너리 크기 제약)
  - `next.config.ts`에 `serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium']` 추가

#### 반응형 디자인 개선

- [ ] 모바일(< 640px) 전체 페이지 최종 점검
- [ ] 태블릿(640px~1024px) 레이아웃 점검
- [ ] 데스크톱(1024px+) 고정폭 컨테이너 (`max-w-4xl`) 확인
- [ ] 번들 사이즈 점검 — 각 페이지 First Load JS 200KB 이하 목표

#### 빌드 & 코드 품질

- [ ] `npm run check-all` 전체 통과 확인
- [ ] `npm run build` 프로덕션 빌드 성공 확인
- [ ] 미사용 import, dead code 제거

#### Vercel 배포

- [ ] Vercel 프로젝트 환경변수 설정
  - `NOTION_API_KEY`, `NOTION_DATABASE_ID`, `SHARE_TOKEN_SECRET`, `NEXT_PUBLIC_APP_URL`
- [ ] 배포 후 E2E 검증
  - 견적서 조회 → 렌더링 → PDF 다운로드 전체 흐름
  - 공유 링크 생성 → 비로그인 접근 → 만료 확인
- [ ] Core Web Vitals 측정 (LCP 2.5초 이하 목표)
- [ ] 에러 모니터링 연동 (Sentry, 선택사항)

### ✅ 완료 기준

- 프로덕션 URL에서 전체 기능 동작 확인
- `npm run build` 경고 없이 통과
- Vercel Analytics LCP 2.5초 이하
- 견적서 조회·PDF 다운로드·공유 링크 세 가지 핵심 흐름 E2E 검증 완료

---

## Phase 2 이후 — 고도화 로드맵 (포스트 MVP)

> MVP 검증 이후 우선순위에 따라 순차 진행

| 기능          | 설명                                | 난이도 |
| ------------- | ----------------------------------- | ------ |
| 견적서 편집   | Notion 데이터 양방향 동기화 편집    | 높음   |
| 전자서명      | e-Signature 통합                    | 높음   |
| 결제 연동     | Toss Payments / Stripe              | 중간   |
| 템플릿        | 다양한 견적서 디자인 선택           | 중간   |
| 분석 대시보드 | 조회수·다운로드 통계                | 중간   |
| 이메일 알림   | 발송/열람 시 자동 알림              | 낮음   |
| 다국어(i18n)  | 한국어/영어 전환 (next-intl)        | 낮음   |
| 관리자 페이지 | `/admin` 전체 견적서 목록·상태 관리 | 중간   |

---

## 개발 규칙

- 모든 작업 완료 시 `npm run check-all` 통과 필수
- 커밋 전 `npm run build` 확인 필수
- 파일명: `kebab-case` / 컴포넌트명: `PascalCase`
- import 경로: 항상 `@/` 절대 경로 사용
- 환경변수: 서버 전용 값은 `NEXT_PUBLIC_` 접두어 사용 금지

---

**문서 버전**: 1.0.0
**최초 작성**: 2026-04-04
**기반 PRD**: `@/docs/PRD.md` v1.0.0
