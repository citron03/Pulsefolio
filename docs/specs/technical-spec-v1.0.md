# Pulsefolio 기술 명세서 v1.0

## 1. 목표
투자 정보 조회와 포트폴리오 추적에 집중한 준실시간 웹 애플리케이션을 구현한다.

## 2. 아키텍처
- Frontend: Next.js 16 (App Router) + TypeScript + Tailwind v4 + Headless UI
- API Layer: Next.js Route Handlers(BFF)
- State: React Query(서버 상태), Zustand(클라이언트 UI 상태)
- Persistence: Supabase(PostgreSQL) 기본, 게스트 모드 LocalStorage
- Auth: NextAuth.js(OAuth), Guest fallback
- Chart: Recharts (Mock/대시보드 시각화)
- Mobile: 단일 Next.js 앱의 반응형 웹을 기본으로 하고, 설치형 앱 요구가 생기면 PWA를 우선 적용한다.
- Native Shell: 앱스토어 배포 또는 네이티브 기능이 필요할 때만 Capacitor 등 래퍼를 별도 검토한다.

## 3. 도메인 모델

### User
- id
- email
- provider
- createdAt

### PortfolioHolding
- id
- userId
- symbol
- market
- avgBuyPrice
- quantity
- note
- createdAt
- updatedAt

### WatchlistItem
- id
- userId
- symbol
- groupName
- createdAt

### StockMemo
- id
- holdingId
- thesis
- targetPrice
- riskNote
- writtenAt

### MarketSnapshot
- symbol
- price
- changeRate
- volume
- updatedAt
- stale

## 4. API 계약(초안)

### GET /api/market/indexes
- 응답: KOSPI, KOSDAQ, NASDAQ, SP500, USDKRW

### GET /api/quotes?symbols=...
- 응답: 종목별 현재가/등락률/거래량/거래대금

### GET /api/chart?symbol=...&range=1w|1m|3m|1y
- 응답: candle 배열

### GET /api/portfolio
### POST /api/portfolio
### PATCH /api/portfolio/:id
### DELETE /api/portfolio/:id

### GET /api/watchlist
### POST /api/watchlist
### DELETE /api/watchlist/:id

## 5. 데이터 갱신 정책
- 지수: 30초
- 관심 종목: 10~30초
- 포트폴리오 평가: 30초 재계산
- 환율: 60초
- 차트: 요청 시
- 시장 캘린더: 일 1회

장 종료 또는 휴장 시 polling을 중단하고 마지막 종가 스냅샷을 유지한다.

## 6. 상태 처리 표준
모든 데이터 컴포넌트는 아래 상태를 구현한다.
- loading: skeleton/spinner
- empty: 안내 문구 + 유도 액션
- error: 오류 메시지 + 재시도
- stale: 마지막 갱신 시각 표시

## 7. 성능/품질 기준
- LCP 3초 이내
- 리스트 100개 이상 virtualization
- polling interval 정리(언마운트 시 clear)
- 접근성: 색상+아이콘 이중 신호, 키보드 접근 가능
- 모바일 품질: 375px/430px/768px viewport에서 핵심 지표와 상태 표시 검증
- 버전 관리: PC/모바일은 같은 API와 도메인 계산 로직을 공유하고 레이아웃만 분기

## 8. 환경변수
- NEXT_PUBLIC_USE_MOCK=true|false
- KIS_APP_KEY
- KIS_APP_SECRET
- KIS_ACCOUNT_NO (선택)
- NEXTAUTH_URL
- NEXTAUTH_SECRET
- DATABASE_URL

## 9. Mock 전략
`/mock` 디렉토리 구조:
- portfolio.json
- watchlist.json
- market-index.json
- chart-data.json
- sector.json

NEXT_PUBLIC_USE_MOCK=true면 API 대신 mock provider를 사용한다.

## 10. 에러/운영 정책
- API 실패 시 사용자 메시지 표준화
- rate limit 감지 시 exponential backoff + stale 표시
- 시장 상태 판단: KST 09:00~15:30 + 휴장일 JSON

## 참고
- 라이브러리 선정 기준: `docs/specs/library-selection-criteria.md`
- 모바일 제품/배포 계획: `docs/design/mobile-experience-plan.md`
