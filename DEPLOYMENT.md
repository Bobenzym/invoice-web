# 🚀 Notion CMS Blog - 배포 가이드

**프로젝트:** Notion CMS Blog  
**Framework:** Next.js 15.5.3  
**배포 플랫폼:** Vercel  
**마지막 업데이트:** 2026-04-06

---

## 📋 배포 전 체크리스트

### 로컬 검증

```bash
# 모든 검사 통과 확인
npm run check-all

# 프로덕션 빌드 확인
npm run build

# 로컬에서 프로덕션 빌드 실행 (선택)
npm run start
```

### Git 준비

```bash
# 모든 변경사항 커밋
git status
git add -A
git commit -m "배포 준비"

# main 브랜치로 푸시
git push origin main
```

---

## 🔧 Vercel 환경 변수 설정

### 1. Vercel 프로젝트 설정

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings > Environment Variables**

### 2. 환경 변수 추가

#### 필수 변수

| 변수                      | 값                       | 설명                   |
| ------------------------- | ------------------------ | ---------------------- |
| `NOTION_API_KEY`          | `ntn_...`                | Notion API 키          |
| `NOTION_BLOG_DATABASE_ID` | `uuid`                   | Notion 데이터베이스 ID |
| `NEXT_PUBLIC_SITE_URL`    | `https://yourdomain.com` | 프로덕션 도메인        |

### 3. 값 획득 방법

#### Notion API Key

```
1. https://www.notion.so/my-integrations 방문
2. "Create new integration" 클릭
3. 이름: "Blog Sync"
4. Associated workspace: 선택
5. Capabilities: Read content 선택
6. 생성 후 API Key 복사
```

#### Database ID

```
1. Notion 블로그 데이터베이스 열기
2. 공유 > Copy link
3. URL에서 database_id 추출: https://notion.so/{database_id}
```

---

## 📦 배포 프로세스

### 자동 배포

1. **GitHub Push**: `git push origin main`
2. **Vercel 감지**: 자동으로 배포 시작
3. **빌드**: Next.js 컴파일 및 최적화
4. **배포**: Edge Network에 업로드
5. **완료**: Production URL 접근 가능

### 배포 모니터링

- [Vercel Dashboard](https://vercel.com/dashboard)에서 배포 상태 확인
- Logs 탭에서 빌드 로그 확인
- 문제 발생 시 재배포 가능

---

## ✅ 배포 후 검증

### 자동 검증 (스크립트)

```bash
chmod +x scripts/verify-deployment.sh
./scripts/verify-deployment.sh https://yourdomain.com
```

### 수동 검증 체크리스트

#### 1. 기본 페이지

- [ ] 메인 페이지 로드
- [ ] `/blog` 페이지 로드
- [ ] 포스트 카드 표시
- [ ] 검색 폼 표시

#### 2. 블로그 기능

- [ ] 포스트 상세 페이지 로드
- [ ] 커버 이미지 표시
- [ ] 본문 콘텐츠 렌더링
- [ ] 목차(TOC) 동작
- [ ] 댓글/공유 버튼 동작

#### 3. 필터 및 검색

- [ ] 카테고리 필터 작동
- [ ] 태그 필터 작동
- [ ] 검색 기능 작동
- [ ] 페이지네이션 작동

#### 4. SEO

- [ ] `/sitemap.xml` 접근 가능
- [ ] `/robots.txt` 접근 가능
- [ ] `/api/feed.xml` (RSS) 접근 가능
- [ ] 메타 태그 확인 (DevTools)

#### 5. 성능

```bash
# PageSpeed Insights로 측정
https://pagespeed.web.dev/?url=https://yourdomain.com

# 목표:
# - LCP (Largest Contentful Paint): < 2.5s ✅
# - FID (First Input Delay): < 100ms ✅
# - CLS (Cumulative Layout Shift): < 0.1 ✅
```

---

## 🔐 보안 체크리스트

- [ ] Notion API Key를 Vercel에만 설정 (로컬 .env.local에는 미설정)
- [ ] Git에 .env.local 푸시 금지 (.gitignore 확인)
- [ ] HTTPS 강제 (Vercel에서 자동)
- [ ] CORS 설정 확인
- [ ] 환경 변수 암호화 확인

---

## 🌍 커스텀 도메인 설정

### Vercel에서 도메인 연결

1. Vercel Dashboard > Settings > Domains
2. "Add Domain" 클릭
3. 도메인 입력
4. DNS 레코드 설정 (안내에 따라)
5. 확인 대기 (최대 48시간)

---

## 📊 모니터링

### Vercel Analytics

- Real-time traffic monitoring
- Error tracking
- Performance metrics

### 추가 서비스 (선택)

- **Sentry**: 에러 추적
- **Google Analytics**: 트래픽 분석
- **Vercel Analytics Pro**: 상세 분석

---

## 🔄 업데이트 및 유지보수

### 컨텐츠 업데이트

1. Notion에서 포스트 작성/수정
2. 웹훅이 자동으로 캐시 무효화
3. 브라우저에서 변경사항 확인 (최대 1시간)

### 코드 업데이트

1. 로컬에서 변경
2. `npm run check-all` 통과
3. Git 커밋 및 푸시
4. Vercel이 자동 배포

### 재배포 (선택)

```bash
# 캐시 이슈 시 Vercel에서 재배포
# 또는 CLI에서:
vercel redeploy
```

---

## 🆘 문제 해결

### 포스트가 표시되지 않음

```
1. NOTION_API_KEY 확인
2. NOTION_BLOG_DATABASE_ID 확인
3. Notion 데이터베이스 Status 확인 (published여야 함)
4. Vercel 로그 확인: Deployments > Logs
```

### 이미지가 로드되지 않음

```
1. 커버 이미지 URL 형식 확인
2. Notion 이미지 URL의 만료 여부 확인
3. Next/Image 설정 확인
```

### 성능 저하

```
1. Core Web Vitals 측정 (PageSpeed Insights)
2. Vercel Analytics 확인
3. 이미지 최적화 확인
4. 불필요한 리렌더링 확인
```

### 캐시 문제

```
1. Vercel에서 캐시 초기화
2. 브라우저 캐시 초기화 (Ctrl+Shift+Delete)
3. 웹훅 설정 확인
```

---

## 📞 지원 및 문서

### 공식 문서

- [Vercel 문서](https://vercel.com/docs)
- [Next.js 문서](https://nextjs.org/docs)
- [Notion API](https://developers.notion.com)

### 프로젝트 문서

- [README.md](./README.md) - 프로젝트 개요
- [CLAUDE.md](./CLAUDE.md) - 개발 지침
- [docs/ROADMAP.md](./docs/ROADMAP.md) - 개발 로드맵
- [docs/guides/](./docs/guides/) - 상세 가이드

---

## 📈 다음 단계

배포 후 고려할 사항:

1. **모니터링** 설정 (Sentry, Vercel Analytics)
2. **SEO 최적화** (Google Search Console 등록)
3. **성능 개선** (Core Web Vitals 최적화)
4. **팀 협업** (Vercel Teams 설정)
5. **백업** (Notion 데이터 백업)

---

**배포 완료! 🎉**

더 자세한 내용은 [deployment.md](./docs/guides/deployment.md)를 참조하세요.
