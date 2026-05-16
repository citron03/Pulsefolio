# Pulsefolio Codex AI 세팅 가이드

## 1. 목표
Codex가 Pulsefolio 문맥을 빠르게 이해하고 일관된 방식으로 작업하도록 표준 환경을 정의한다.

## 2. 기본 워크플로우
1. PRD/기술명세 확인
2. 작업 범위 확정
3. Mock 기반 구현
4. API 연동
5. 테스트 및 검증
6. 문서 업데이트

## 3. 권장 실행 명령 (프로젝트 생성 후)
```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
```

## 4. 코드 작성 원칙
- 타입 우선(TypeScript strict)
- 화면별 상태 4종 처리 필수
- 외부 API는 adapter 계층으로 캡슐화
- UI와 도메인 계산(손익/수익률) 분리

## 5. AI 작업 규칙
- 스펙 없는 기능 추가 금지
- PRD 범위 외 제안은 `docs/planning`에 RFC 초안 작성 후 진행
- 데이터/금액 계산 로직 변경 시 테스트 추가 필수

## 6. 디렉토리 권장 구조
- `src/app` : 라우트 및 페이지
- `src/features` : 도메인별 기능
- `src/entities` : 공통 타입/모델
- `src/shared` : 유틸/디자인시스템
- `mock` : mock 데이터
- `docs` : 기획/명세/운영 문서
