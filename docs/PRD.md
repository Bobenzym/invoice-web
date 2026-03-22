# 📋 견적서 웹 뷰어 MVP - PRD 메타 프롬프트

> 이 문서는 **노션에서 관리하는 견적서를 웹에서 확인하고 PDF로 다운로드**할 수 있는
> MVP 서비스의 PRD를 작성하는 메타 프롬프트입니다.

---

## 🎯 핵심 요구사항

### 1. **데이터 소스 (Notion Integration)**

- [ ] Notion API를 통해 견적서 데이터베이스 연동
- [ ] 구조화된 견적서 항목 (클라이언트, 가격, 유효기간 등)
- [ ] 실시간 데이터 동기화
- [ ] 권한 및 공유 설정 지원

### 2. **웹 인터페이스 (Invoice Viewer)**

- [ ] 모바일 반응형 디자인
- [ ] 다크모드 지원
- [ ] 인쇄 최적화 레이아웃
- [ ] 견적서 미리보기 (WYSIWYG)

### 3. **PDF 다운로드**

- [ ] 서버사이드 PDF 생성
- [ ] 동적 콘텐츠 렌더링
- [ ] 로고, 워터마크 지원
- [ ] 다국어 지원 (한/영)

### 4. **인증 & 권한**

- [ ] 클라이언트 공유 링크 (비로그인 접근)
- [ ] 소유자/편집자 권한 관리
- [ ] 토큰 기반 임시 공유

---

## 📦 기술 스택

```
Frontend:
- Next.js 15.5.3 (App Router)
- React 19 + TypeScript
- TailwindCSS v4 + shadcn/ui
- React Hook Form + Zod

Backend:
- Server Actions (Next.js)
- Notion API SDK
- PDF 생성: html2pdf 또는 Puppeteer

External:
- Notion Workspace (데이터 소스)
```

---

## 🏗️ MVP 스코프

### Phase 1: MVP (Minimum Viable Product)

✅ **목표**: 기본적인 견적서 조회 및 PDF 다운로드

**포함 기능:**

- Notion 데이터베이스 읽기
- 견적서 정보 웹 표시
- PDF 파일 다운로드
- 반응형 레이아웃
- 공유 링크 기반 접근

**제외 기능:**

- 견적서 편집 (읽기 전용)
- 결제 연동
- 전자서명
- 분석 대시보드

---

## 📐 페이지 구조

```
/                          # 홈페이지 (미리보기)
├── /invoice/[id]          # 견적서 상세 페이지
├── /invoice/[id]/pdf      # PDF 다운로드 API
├── /share/[token]         # 공유 링크 (비로그인)
└── /admin                  # 관리자 대시보드 (Phase 2)
```

---

## 🔌 Notion Integration

### Notion Database Schema

```
Properties:
- Title (텍스트): 견적서명
- Client (텍스트): 클라이언트명
- Email (이메일): 클라이언트 이메일
- Amount (숫자): 총액
- Currency (선택): KRW, USD, EUR
- Due Date (날짜): 유효기간
- Items (테이블): 항목 상세정보
  - Item Name (텍스트)
  - Quantity (숫자)
  - Unit Price (숫자)
  - Tax Rate (숫자, %)
- Status (선택): Draft, Sent, Viewed, Paid
- Notes (텍스트): 비고
- Created (날짜): 생성일
- Updated (날짜): 수정일
```

---

## 💾 데이터 모델

### Invoice (견적서)

```typescript
interface Invoice {
  id: string // Notion Page ID
  title: string // 견적서명
  client: {
    name: string
    email: string
  }
  amount: number // 총액
  currency: 'KRW' | 'USD' | 'EUR'
  dueDate: Date // 유효기간
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
  taxRate: number // 0-100
  subtotal: number // quantity * unitPrice
  tax: number // subtotal * (taxRate / 100)
  total: number // subtotal + tax
}
```

---

## 🎨 UI 컴포넌트

### 필수 컴포넌트

```
components/
├── invoice/
│   ├── invoice-viewer.tsx          # 메인 견적서 뷰어
│   ├── invoice-header.tsx           # 헤더 (회사정보, 로고)
│   ├── invoice-details.tsx          # 견적서 상세정보
│   ├── invoice-items.tsx            # 항목 테이블
│   ├── invoice-total.tsx            # 합계 섹션
│   ├── invoice-footer.tsx           # 하단 (서명, 약관)
│   └── invoice-actions.tsx          # 다운로드 버튼
├── pdf/
│   └── invoice-pdf-template.tsx     # PDF 렌더링 템플릿
└── shared/
    ├── loading-skeleton.tsx
    └── error-fallback.tsx
```

---

## 🔄 API Routes (Server Actions)

### Endpoints

```typescript
// GET /api/invoice/[id]
// - Notion에서 견적서 데이터 조회
// - 공개/비공개 권한 확인

// POST /api/invoice/[id]/pdf
// - HTML을 PDF로 변환
// - 다운로드 스트림 반환

// GET /api/share/[token]
// - 공유 토큰 검증
// - 해당 견적서 정보 반환

// POST /api/notion/sync
// - Notion 데이터 동기화 (Webhook)
```

---

## 📱 반응형 디자인 기준

### Breakpoints (TailwindCSS)

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: 1024px+ (xl)

### 레이아웃 전략

- 모바일: 단일 컬럼, 스택 레이아웃
- 태블릿: 2단 레이아웃
- 데스크톱: 고정폭 컨테이너 (max-w-4xl)

---

## 📄 PDF 생성 전략

### Option 1: html2pdf (가벼움)

```typescript
import html2pdf from 'html2pdf.js'

const element = document.getElementById('invoice')
html2pdf({
  margin: 10,
  filename: `invoice-${id}.pdf`,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2 },
  jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
}).save()
```

### Option 2: Puppeteer (고품질, 서버사이드)

```typescript
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
await page.pdf({ path: `invoice-${id}.pdf`, format: 'A4' })
```

**권장**: Option 2 (서버사이드, 안정적)

---

## 🔐 보안 고려사항

### 1. Notion API 인증

- [ ] 환경변수로 API 토큰 관리
- [ ] 데이터베이스 ID 암호화

### 2. 공유 링크 보안

- [ ] 시간제한이 있는 토큰 생성
- [ ] 토큰 서명 (HMAC)
- [ ] Rate limiting

### 3. 데이터 개인정보보호

- [ ] 클라이언트 이메일 마스킹 옵션
- [ ] 감시 로깅
- [ ] GDPR 준수

---

## ✅ MVP 체크리스트

### 개발 단계

- [ ] Notion API 통합 테스트
- [ ] 견적서 조회 API 구현
- [ ] 웹 뷰어 컴포넌트 완성
- [ ] PDF 생성 기능 구현
- [ ] 공유 링크 기능 구현
- [ ] 반응형 디자인 테스트
- [ ] 다크모드 구현

### 검수 단계

- [ ] `npm run check-all` 통과
- [ ] 유닛 테스트 작성 (핵심 함수)
- [ ] E2E 테스트 (Notion → PDF)
- [ ] 성능 테스트
- [ ] 접근성 검사 (WCAG 2.1 AA)
- [ ] SEO 최적화
- [ ] 크로스브라우저 테스트

### 배포 전

- [ ] 보안 감사
- [ ] 성능 최적화 (Core Web Vitals)
- [ ] 에러 모니터링 설정
- [ ] 배포 체크리스트

---

## 📈 Phase 2 고려사항

> 이 항목들은 MVP 이후에 진행합니다.

- [ ] **견적서 편집**: Notion 동기화 편집
- [ ] **전자서명**: e-Signature 통합
- [ ] **결제**: 결제 게이트웨이 연동
- [ ] **템플릿**: 다양한 디자인 템플릿
- [ ] **분석**: 조회수, 다운로드 통계
- [ ] **알림**: 이메일 알림
- [ ] **다국어**: i18n 지원

---

## 📚 참고 문서

- **프로젝트 구조**: `@/docs/guides/project-structure.md`
- **스타일링 가이드**: `@/docs/guides/styling-guide.md`
- **컴포넌트 패턴**: `@/docs/guides/component-patterns.md`
- **폼 처리**: `@/docs/guides/forms-react-hook-form.md`
- **Next.js 15**: `@/docs/guides/nextjs-15.md`

---

## 🚀 시작하기

### 1. 프롬프트 실행

```bash
# Claude Code에서 이 프롬프트 기반 개발 요청
# "PRD_PROMPT.md 기반으로 MVP 구현해줘"
```

### 2. 개발 흐름

```bash
npm run dev              # 개발 서버 시작
npm run check-all        # 린팅 & 타입 검사
npm run build            # 프로덕션 빌드
```

### 3. 배포

```bash
# Vercel, Netlify, 또는 자체 서버에 배포
```

---

**작성일**: 2026-03-22
**버전**: 1.0.0 (MVP)
**상태**: 개발 전 검토 대기
