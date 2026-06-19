# 한국투자증권 Open API 통합 명세

## 목적
Pulsefolio는 한국투자증권 Open API를 기본 외부 시세/계좌 데이터 공급원으로 사용한다.

이 문서는 Pulsefolio에서 사용할 API 범위를 제한하고, 인증/환경변수/응답 매핑/stale 정책을 정리한다. 실제 주문/체결 기능은 구현하지 않는다.

## 공식 기준
- 개발자 포털: `https://apiportal.koreainvestment.com/intro`
- 공식 샘플 저장소: `https://github.com/koreainvestment/open-trading-api`
- API 검색 MCP: `https://github.com/koreainvestment/koreainvestment-mcp`

한국투자증권 Open API는 REST와 WebSocket 방식을 제공한다. REST는 App Key/App Secret으로 접근 토큰을 발급받은 뒤 API를 호출하고, WebSocket은 별도 접속키 발급 후 실시간 데이터를 구독한다.

## 적용 범위

### 1차 구현
- OAuth 접근 토큰 발급
- 국내주식 현재가 조회
- 국내주식 일/기간별 시세 조회
- 시장 지수 조회
- 관심 종목/보유 종목의 REST polling
- stale/cache/error 상태 표준화

### 2차 구현
- 계좌 잔고 조회
- 계좌 보유 종목과 수동 포트폴리오 병합
- 토큰 갱신/만료 처리 강화

### 3차 구현
- WebSocket 실시간 체결가/호가 구독
- 장중에만 실시간 구독 유지
- 장 종료/휴장 시 WebSocket 중단 후 마지막 스냅샷 유지

### 제외
- 국내주식 주문
- 정정/취소
- 자동매매
- 체결 통보 기반 매매 UI
- 주문 가능 금액/증거금 기반 매수·매도 제안

## 환경 구분

| 구분 | 용도 | 비고 |
| --- | --- | --- |
| `real` | 실전투자 | 실제 계좌/실제 시세 |
| `virtual` | 모의투자 | 모의 계좌 테스트 |
| `mock` | 로컬 개발 | 외부 API 호출 없음 |

`NEXT_PUBLIC_USE_MOCK=true`이면 KIS API를 호출하지 않고 mock provider를 사용한다.

## 환경변수

```env
NEXT_PUBLIC_USE_MOCK=true

KIS_ENV=virtual
KIS_APP_KEY=
KIS_APP_SECRET=
KIS_ACCOUNT_NO=
KIS_ACCOUNT_PRODUCT_CODE=01
KIS_HTS_ID=
```

| 변수 | 설명 | 노출 |
| --- | --- | --- |
| `KIS_ENV` | `real` 또는 `virtual` | server only |
| `KIS_APP_KEY` | 한국투자증권 App Key | server only |
| `KIS_APP_SECRET` | 한국투자증권 App Secret | server only |
| `KIS_ACCOUNT_NO` | 계좌번호 앞 8자리 | server only |
| `KIS_ACCOUNT_PRODUCT_CODE` | 계좌상품코드. 종합계좌 기본값 `01` | server only |
| `KIS_HTS_ID` | WebSocket/체결 통보 등에서 필요한 HTS ID | server only |

KIS 관련 값은 `NEXT_PUBLIC_` 접두어를 붙이지 않는다. 클라이언트에는 절대 전달하지 않는다.

## 인증 흐름

1. 서버에서 App Key/App Secret으로 접근 토큰을 발급한다.
2. 토큰과 만료 시각을 서버 메모리 또는 안전한 서버 캐시에 저장한다.
3. API 호출 전 만료 임박 여부를 확인한다.
4. 만료 또는 인증 실패 시 1회 재발급 후 재시도한다.
5. 재시도 실패 시 `error` 상태로 변환하고, 마지막 정상 데이터가 있으면 `stale`로 표시한다.

## REST 공통 헤더

```http
authorization: Bearer <access_token>
appkey: <KIS_APP_KEY>
appsecret: <KIS_APP_SECRET>
tr_id: <TR_ID>
custtype: P
```

조회 API는 보통 `GET`이며, 주문 등 일부 `POST` 요청은 hashkey가 필요하다. Pulsefolio 1차 범위에는 주문 API가 없으므로 hashkey 구현은 보류한다.

## Pulsefolio API 매핑

### 현재가 조회

| 항목 | 값 |
| --- | --- |
| KIS 기능 | 국내주식 > 주식현재가 시세 |
| Method | `GET` |
| Path | `/uapi/domestic-stock/v1/quotations/inquire-price` |
| 대표 TR ID | `FHKST01010100` |
| 주요 파라미터 | `FID_COND_MRKT_DIV_CODE=J`, `FID_INPUT_ISCD=005930` |
| Pulsefolio route | `GET /api/quotes?symbols=005930,000660` |

응답 매핑:

| Pulsefolio 필드 | KIS 의미 |
| --- | --- |
| `symbol` | 종목코드 |
| `price` | 현재가 |
| `change` | 전일 대비 |
| `changeRate` | 전일 대비율 |
| `volume` | 누적 거래량 |
| `updatedAt` | 서버 수신 시각 |
| `stale` | 캐시/시장 상태 기준 |

### 일/기간별 시세

| 항목 | 값 |
| --- | --- |
| KIS 기능 | 국내주식 기간별 시세/일봉 |
| Method | `GET` |
| 대표 Path | `/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice` |
| 대표 TR ID | `FHKST03010100` |
| Pulsefolio route | `GET /api/chart?symbol=005930&range=1m` |

차트 응답은 Pulsefolio 내부에서 `date`, `open`, `high`, `low`, `close`, `volume`으로 정규화한다.

### 시장 지수

| 항목 | 값 |
| --- | --- |
| KIS 기능 | 국내지수/업종/시장 지수 조회 |
| Pulsefolio route | `GET /api/market/indexes` |
| 대상 | KOSPI, KOSDAQ, 필요 시 KOSPI200 |

시장 지수 API의 세부 TR ID는 구현 직전 공식 포털 또는 공식 샘플 저장소에서 다시 확정한다.

### 계좌 잔고

| 항목 | 값 |
| --- | --- |
| KIS 기능 | 주식잔고조회 |
| Pulsefolio route | `GET /api/portfolio/sync` |
| 구현 단계 | 2차 |

계좌 잔고는 사용자가 명시적으로 연동을 켠 경우에만 조회한다. 자동 동기화는 수동 포트폴리오 입력값을 덮어쓰지 않고, 별도 `source=kis` 데이터로 병합한다.

## Polling과 stale 정책

| 데이터 | 장중 | 장 시작 전/장 종료/휴장 |
| --- | --- | --- |
| 현재가 | 10~30초 polling | polling 중단 |
| 포트폴리오 평가 | 30초 재계산 | 마지막 종가/스냅샷 유지 |
| 시장 지수 | 30초 polling | polling 중단 |
| 차트 | 요청 시 fetch | 요청 시 fetch 또는 캐시 |
| 계좌 잔고 | 사용자 액션 또는 저빈도 polling | 사용자 액션만 |

stale 판단:
- 마지막 정상 응답 이후 polling 주기의 2배 이상 지나면 `stale=true`
- API rate limit 또는 네트워크 실패가 발생하면 마지막 정상 데이터를 유지하고 `stale` 경고를 표시
- 장 종료/휴장 상태에서는 “실시간” 표현을 쓰지 않고 마지막 갱신 시각을 표시

## 에러 매핑

| 원인 | 사용자 상태 | 처리 |
| --- | --- | --- |
| 인증 실패 | `error` | 토큰 1회 재발급 후 실패 시 안내 |
| 호출 제한 | `stale` | backoff 적용, 마지막 정상 데이터 유지 |
| 종목 없음 | `empty` | 잘못된 종목 코드 안내 |
| 네트워크 실패 | `stale` 또는 `error` | 캐시가 있으면 stale, 없으면 error |
| 시장 종료 | `stale` 아님 | 정상 상태로 마지막 갱신 시각 표시 |

## 보안 원칙
- KIS App Secret과 계좌번호는 서버에서만 사용한다.
- 클라이언트 컴포넌트에서 KIS API를 직접 호출하지 않는다.
- API route는 외부 API 응답을 그대로 노출하지 않고 Pulsefolio DTO로 변환한다.
- 로그에는 토큰, appsecret, 계좌번호 전체를 남기지 않는다.
- 사용자가 계좌 연동 해제를 요청하면 저장된 계좌 연결 정보를 삭제하기 전 확인 절차를 둔다.

## 구현 순서
1. `KisAuthClient`: 토큰 발급/캐시/재발급
2. `KisRestClient`: 공통 헤더, base URL, 에러 변환
3. `KisQuoteAdapter`: 현재가 조회와 DTO 변환
4. Next.js route handler 연결: `/api/quotes`
5. `KisChartAdapter`: 일/기간별 시세 조회와 candle DTO 변환
6. Next.js route handler 연결: `/api/chart`
7. Next.js route handler 연결: `/api/market/indexes`
8. React Query polling/stale 정책 연결
9. 계좌 잔고 동기화는 별도 feature flag 뒤에서 구현

## 현재 구현 상태
- `src/lib/kis.ts`: KIS 환경변수 파싱, 접근 토큰 발급, 현재가 조회, Pulsefolio quote DTO 변환
- `src/app/api/quotes/route.ts`: `GET /api/quotes?symbols=005930,000660`
- `src/app/api/chart/route.ts`: `GET /api/chart?symbol=005930&range=1m`
- `src/lib/kis.test.ts`: KIS client/adapter 단위 테스트
- `src/app/api/quotes/route.test.ts`: 로컬 mock route 테스트
- `src/app/api/chart/route.test.ts`: 로컬 mock chart route 테스트

로컬 기본값은 `NEXT_PUBLIC_USE_MOCK=true`이므로 KIS 키 없이도 아래 URL을 확인할 수 있다.

```bash
curl "http://localhost:3000/api/quotes?symbols=005930,000660"
curl "http://localhost:3000/api/chart?symbol=005930&range=1m"
```

실제 KIS API를 호출하려면 `.env.local`에 아래 값을 설정하고 `NEXT_PUBLIC_USE_MOCK=false`로 바꾼다.

```env
NEXT_PUBLIC_USE_MOCK=false
KIS_ENV=virtual
KIS_APP_KEY=...
KIS_APP_SECRET=...
```

## 구현 전 확인 항목
- 공식 포털에서 현재 TR ID와 호출 제한 공지 확인
- 실전/모의투자 base URL 확인
- `KIS_ENV=virtual`에서 삼성전자 현재가 조회 PoC 성공
- rate limit 발생 시 응답 코드/메시지 샘플 확보
- 장 종료/휴장 상태에서 polling 중단 확인
