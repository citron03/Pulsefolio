# Pulsefolio Agent 운영 문서

## Agent 역할

### 1) Planner Agent
- PRD/기술명세 기준으로 작업 범위를 자른다.
- 각 작업의 완료조건(DoD)을 명확히 작성한다.

### 2) Frontend Agent
- Next.js UI 구현 담당
- 상태 4종(`loading/empty/error/stale`) 처리 책임
- 반응형(375px+) 기준 검증

### 3) Data Agent
- 한국투자증권 API 연동
- polling, caching, stale 처리 정책 구현
- 시장 상태(장중/장종료/휴장) 계산 로직 관리

### 4) QA Agent
- 계산 로직(평가금액/손익/수익률) 테스트
- 장애 시나리오(API error, empty, stale) 테스트
- 성능/접근성 체크리스트 검증

## 공통 규칙
- 범위 외 기능은 임의 구현 금지
- 도메인 계산식 변경 시 테스트 동반
- 실패 상태를 숨기지 말고 UI에 명시
- 사용자 데이터 삭제/초기화는 확인 절차 필수

## Done 정의
- 기능 구현
- 테스트 통과
- 문서 업데이트
- 릴리즈 노트 초안 작성
