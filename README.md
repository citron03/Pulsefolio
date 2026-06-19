# Pulsefolio

실제 거래 없이 실제 데이터로 투자 현황을 관리하는 개인 투자자용 플랫폼.

## Quick Start

macOS/Linux:

```bash
corepack enable
corepack prepare pnpm@10.22.0 --activate
pnpm install
cp .env.example .env.local
pnpm dev
```

Windows PowerShell:

```powershell
corepack enable
corepack prepare pnpm@10.22.0 --activate
pnpm install
Copy-Item .env.example .env.local
.\scripts\utf8.ps1
pnpm dev
```

개발 검증:

```bash
pnpm check
```

로컬 API 확인:

```bash
pnpm dev
curl "http://localhost:3000/api/quotes?symbols=005930,000660"
curl "http://localhost:3000/api/chart?symbol=005930&range=1m"
```

## 문서 인덱스
- 기획서(PRD): `docs/planning/pulsefolio-prd-v1.1.md`
- 기술 명세: `docs/specs/technical-spec-v1.0.md`
- 한국투자증권 Open API 통합 명세: `docs/specs/kis-openapi-integration.md`
- 기술적 챌린지: `docs/specs/technical-challenges.md`
- 개발 도구 가이드(Biome): `docs/specs/dev-tooling-biome.md`
- 라이브러리 선정 기준: `docs/specs/library-selection-criteria.md`
- 프로젝트 운영 문서: `docs/project/project-docs.md`
- 의존성 업그레이드 로그(2026-05-16): `docs/project/dependency-upgrade-2026-05-16.md`
- Codex AI 세팅: `.codex/CODEX_SETUP.md`
- Agent 운영: `AGENTS.md`
- 커스텀 스킬: `.codex/skills/pulsefolio-superpowers/SKILL.md`
- 커스텀 스킬(보안 점검): `.codex/skills/pulsefolio-security-audit/SKILL.md`

- 배포 가이드(Vercel): `docs/project/deployment-vercel.md`
- Git/릴리즈 전략: `docs/project/git-release-strategy.md`
- 작업 로그(2026-05-16): `docs/project/logs/2026-05-16.md`
- 작업 로그(2026-05-17): `docs/project/logs/2026-05-17.md`
- 작업 로그(2026-05-30): `docs/project/logs/2026-05-30.md`
- 작업 로그(2026-05-31): `docs/project/logs/2026-05-31.md`
- 작업 로그(2026-06-03): `docs/project/logs/2026-06-03.md`
- 작업 로그(2026-06-19): `docs/project/logs/2026-06-19.md`
- 커스텀 스킬(작업 로그): `.codex/skills/pulsefolio-worklog/SKILL.md`
- 디자인 철학: `docs/design/design-philosophy.md`
- 디자인 세팅: `docs/design/design-setup.md`
- 모바일 경험 계획: `docs/design/mobile-experience-plan.md`
- Windows/macOS 개발 환경: `docs/project/windows-macos-setup.md`

## 현재 상태
이 저장소는 개발 초기 세팅이 완료된 상태이며, 기능 구현은 다음 단계에서 진행한다.
