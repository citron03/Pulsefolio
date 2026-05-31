# Vercel 배포 가이드

## 목적
Pulsefolio 프로젝트의 Vercel 배포 절차와 운영 정책을 기록한다.

## 현재 배포 정보 (2026-05-17)
- 프로젝트: `citron03s-projects/pulsefolio`
- 프로덕션 URL: `https://pulsefolio-gilt.vercel.app`
- 최근 배포 URL: `https://pulsefolio-88w3gmpel-citron03s-projects.vercel.app`
- 인스펙트: `https://vercel.com/citron03s-projects/pulsefolio/FMiaHhLRNPKvhFDXBKA93MTaxaaz`

## 배포 정책

### 1) 기본 원칙
- 최종 목표는 **브랜치 기반 자동 배포**다.
- `main`은 프로덕션 반영 브랜치로 사용한다.
- 기능 개발 중에는 Preview 배포로 검증하고, `main` 반영 후 Production 배포한다.
- PC/모바일은 같은 Vercel 프로젝트와 같은 URL로 배포한다.
- 모바일 앱 형태가 필요해도 1차는 PWA로 대응하고, 네이티브 래퍼는 별도 의사결정 후 분리한다.

### 2) 자동 배포 정책 (권장)
- Production Branch: `main`
- PR 브랜치: Preview Deployment 생성
- `main` push/merge: Production Deployment 자동 실행

### 3) 수동 배포 정책 (예외)
아래 경우에만 수동 배포를 허용한다.
- 긴급 핫픽스
- Vercel Git 연동 오류
- 릴리즈 검증을 위한 임시 운영 테스트

수동 배포 명령:
```bash
pnpm dlx vercel --prod --yes
```

## 사전 체크
- `pnpm lint:fix`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build` (로컬 환경 제약 시 `pnpm exec next build --webpack` 대체 확인)

## 운영 체크리스트
- Vercel 프로젝트 Git 연결 상태 확인
- Production Branch가 `main`인지 확인
- Auto-deploy on push 활성화 확인
- 실패 시 `vercel inspect <url>`로 원인 확인
- Preview 배포에서 desktop, 375px, 430px, 768px viewport 확인
- 모바일 배포 영향이 있으면 릴리즈 노트에 `Mobile` 항목 추가

## 모바일 배포 정책
- Phase 1: 반응형 웹을 Vercel 단일 배포로 운영
- Phase 2: PWA manifest/service worker를 추가해 같은 URL에서 설치형 경험 제공
- Phase 3: 앱스토어 배포가 필요할 때 Capacitor 등 네이티브 래퍼를 별도 패키지로 검토
- 모바일과 PC는 API, 인증, 계산 로직을 공유한다.
- 모바일 전용 차이는 layout/component 계층에서만 분기한다.

## 이슈/해결 이력
1. 토큰 인증 오류
- 오류: `The specified token is not valid`
- 해결: `vercel login` 재인증

2. 프로젝트명 규칙 오류
- 오류: 프로젝트명에 대문자 포함
- 해결: 소문자 프로젝트명(`pulsefolio`)으로 연결

## 운영 메모
- 로컬 `.vercel` 디렉터리는 커밋 제외(`.gitignore`)
- 배포 실패 로그는 `docs/project/logs/YYYY-MM-DD.md`에 요약 기록
