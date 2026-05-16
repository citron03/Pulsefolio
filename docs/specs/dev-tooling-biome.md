# Pulsefolio 개발 도구 가이드 (Biome 중심)

## 목적
이 문서는 Pulsefolio에서 코드 품질, 일관성, 검증 자동화를 위해 사용할 린트/테스트/개발 도구 기준을 정의한다.

## 기본 원칙
- 포맷/린트의 중심은 Biome으로 통일한다.
- 타입 안정성은 TypeScript strict 모드로 보완한다.
- 금융 도메인 로직(손익/수익률/상태전이)은 자동 테스트로 보호한다.
- 커밋 전 자동 검증(pre-commit)으로 품질 하한선을 유지한다.

## 권장 도구 스택

### 1) Biome (핵심)
- 역할: 포맷팅 + 린팅 + import 정리
- 적용 범위: TS/TSX/JS/JSON/Markdown
- 기대 효과: ESLint+Prettier 분리 운영 복잡도 감소

### 2) TypeScript strict
- 역할: 정적 타입 안정성 강화
- 권장 옵션:
  - `strict: true`
  - `noUncheckedIndexedAccess: true`
  - `noImplicitOverride: true`

### 3) ESLint 최소 보완 (선택)
- 역할: Next.js 특화 규칙 보강
- 원칙: Biome과 겹치는 일반 규칙은 비활성화
- 사용 시점: Next 전용 규칙이 실제로 필요할 때만 추가

### 4) Husky + lint-staged
- 역할: 커밋 전 자동 품질 게이트
- 권장 pre-commit 실행:
  - `biome check --write`
  - `tsc --noEmit`

### 5) Commitlint + Conventional Commits
- 역할: 커밋 메시지 규격화
- 권장 타입: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

### 6) Vitest + Testing Library + MSW
- 역할:
  - Vitest: 단위/통합 테스트 러너
  - Testing Library: UI 행위 중심 테스트
  - MSW: API 모킹
- 핵심 테스트 대상:
  - 손익/수익률 계산식
  - polling 상태 전이
  - `loading/empty/error/stale` UI 상태 처리

### 7) Playwright
- 역할: E2E 회귀 검증
- 우선 시나리오:
  - 로그인/게스트 진입
  - 포트폴리오 종목 추가/수정/삭제
  - 대시보드 지표 갱신 표시

### 8) React Query Devtools (개발 전용)
- 역할: 캐시/갱신 주기/stale 상태 시각화
- 원칙: 프로덕션 번들 제외

### 9) Bundle Analyzer
- 역할: 번들 크기 점검 및 LCP 개선
- 목적: 초기 로딩 성능 목표(LCP 3초) 지원

## 권장 스크립트 예시
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  }
}
```

## 도입 우선순위
1. Biome + TypeScript strict
2. Husky + lint-staged + commitlint
3. Vitest + Testing Library + MSW
4. Playwright
5. React Query Devtools + Bundle Analyzer

## 운영 체크리스트
- PR 전에 `lint`, `typecheck`, `test` 통과 여부 확인
- 계산식 변경 시 관련 테스트 동시 수정
- polling interval 누수(해제 누락) 여부 점검
- 상태 4종 처리 누락 여부 점검

## 관련 문서
- `docs/specs/technical-spec-v1.0.md`
- `docs/specs/technical-challenges.md`
- `docs/project/project-docs.md`


## UI 라이브러리 기준
- Headless UI(`@headlessui/react`)를 기본 인터랙션 컴포넌트 레이어로 사용
- 스타일은 글로벌 디자인 토큰(`src/app/globals.css`)을 통해 일관 관리

## 차트 라이브러리 기준
- 기본 차트 라이브러리: `recharts`
- 적용 범위: 자산 비중 도넛, 지수 추이 라인, 종목 스파크라인
- 실시간 트레이딩형 캔들 고도화가 필요할 때만 Lightweight Charts 대안 검토
