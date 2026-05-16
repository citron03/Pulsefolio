---
name: pulsefolio-security-audit
description: Pulsefolio 프로젝트 보안 점검(의존성, 비밀정보, 설정, API 경계) 실행 규칙
---

# Pulsefolio Security Audit Skill

## 목적
Pulsefolio 저장소에서 배포 전/PR 전 보안 리스크를 빠르게 탐지하고 수정 우선순위를 정한다.

## 실행 시점
- 신규 의존성 추가 직후
- 릴리즈 전
- 인증/환경변수/API 라우트 변경 직후
- 민감 데이터 처리 로직 변경 직후

## 점검 체크리스트

### 1) 의존성 취약점
- `pnpm audit --prod` 실행
- 결과가 0이 아닐 경우 `critical/high`부터 우선 해결
- 필요 시 `pnpm.overrides`로 전이 의존성 패치

### 2) 비밀정보 노출
- `.env*`, 키/토큰 파일 git 추적 여부 점검
- `rg -n "(SECRET|TOKEN|API_KEY|PASSWORD|PRIVATE_KEY)" .` 스캔
- 샘플 값은 `.env.example`에만 유지

### 3) Next.js 서버 경계
- `src/app/api/**`에서 입력 검증 여부 확인
- 외부 API 에러를 내부 스택트레이스 없이 표준 메시지로 변환
- 인증 필요 라우트는 세션/권한 체크 필수

### 4) 클라이언트 노출 점검
- `NEXT_PUBLIC_` 접두어 변수에 민감값이 없는지 확인
- LocalStorage에 계정 토큰/비밀값 저장 금지

### 5) 보안 헤더/운영 설정
- `next.config.ts` 또는 미들웨어에 기본 보안 헤더 적용 여부 확인
- CORS, 캐시 정책, 리다이렉트 규칙 점검

## 판정 기준
- `PASS`: critical/high 취약점 0, 비밀정보 노출 0, 인증 누락 0
- `WARN`: 즉시 위험은 없으나 개선 필요 항목 존재
- `FAIL`: critical/high 취약점 또는 비밀정보 노출 존재

## 결과 보고 템플릿
```md
Security Audit Result: PASS | WARN | FAIL

- Dependency audit:
- Secret scan:
- API boundary checks:
- Public exposure checks:
- Required actions:
```

## 금지사항
- 감사 로그에 실제 시크릿 값 출력 금지
- 취약점 무시 주석으로 임시 봉합 후 종료 금지
- 보안 이슈를 문서 없이 구두로만 처리 금지
