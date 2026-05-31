# Pulsefolio 프로젝트 문서

## 문서 목적
이 문서는 Pulsefolio 개발 시 팀/에이전트가 참고할 공통 운영 기준을 정의한다.

## 작업 원칙
- 기능보다 신뢰성 우선: 금융 서비스 UX 기준 유지
- 과한 범위 확장 금지: PRD 범위 밖 기능은 별도 제안 후 승인
- 모든 화면은 상태 4종(`loading/empty/error/stale`)을 기본 탑재
- Mock 우선 개발 후 API 연동
- PC/모바일은 단일 제품으로 관리하고, 도메인 로직/API 계약은 분리하지 않는다.

## 브랜치/커밋 규칙
- 브랜치 prefix: `codex/`
- 커밋 타입: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- 한 커밋은 한 의도를 원칙으로 한다.

## 개발 순서
1. UI 스켈레톤 + Mock 데이터 연결
2. 도메인 모델 정리
3. BFF(API route) 작성
4. 외부 API 어댑터 연결
5. 폴링/시장 상태 로직 적용
6. 성능/접근성 점검

## QA 체크리스트
- 장중/장종료/휴장 전환이 정상 반영되는가
- API 오류 시 재시도 동작이 제공되는가
- 100개 종목 렌더링에서 스크롤 성능 저하가 없는가
- 모바일(375px)에서 핵심 화면 사용 가능한가
- 모바일 첫 화면에서 시장 상태, 마지막 갱신 시각, 총 평가금액, 손익/수익률이 보이는가
- 모바일 보유 종목이 색상 외 기호(▲▼)와 함께 손익을 표시하는가
- Preview/Production 배포에서 PC와 모바일 viewport를 같은 릴리즈 게이트로 확인하는가

## 참고 문서
- PRD: `docs/planning/pulsefolio-prd-v1.1.md`
- 기술 명세: `docs/specs/technical-spec-v1.0.md`
- 모바일 경험 계획: `docs/design/mobile-experience-plan.md`
- Codex 설정: `.codex/CODEX_SETUP.md`
- Agent 규칙: `AGENTS.md`
