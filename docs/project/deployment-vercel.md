# Vercel 배포 가이드

## 목적
Pulsefolio 프로젝트의 Vercel 배포 절차와 운영 시 주의사항을 기록한다.

## 현재 배포 정보 (2026-05-16)
- 프로젝트: `citron03s-projects/pulsefolio`
- 프로덕션 URL: `https://pulsefolio-gilt.vercel.app`
- 배포 URL: `https://pulsefolio-88w3gmpel-citron03s-projects.vercel.app`
- 인스펙트: `https://vercel.com/citron03s-projects/pulsefolio/FMiaHhLRNPKvhFDXBKA93MTaxaaz`

## 배포 명령
```bash
pnpm dlx vercel --prod --yes
```

## 사전 체크
- `pnpm lint:fix`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## 이슈/해결 이력
1. 토큰 인증 오류
- 오류: `The specified token is not valid`
- 해결: `vercel login` 재인증

2. 프로젝트명 규칙 오류
- 오류: 프로젝트명에 대문자 포함
- 해결: 소문자 프로젝트명(`pulsefolio`)으로 연결

## 운영 메모
- 로컬 `.vercel` 디렉터리는 커밋 제외(`.gitignore`)
- 배포 실패 시 `vercel inspect <url>`로 빌드 로그 우선 확인
