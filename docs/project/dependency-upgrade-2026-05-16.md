# Dependency Upgrade Log (2026-05-16)

## 목적
초기 세팅 직후 최신 권장 버전 반영 및 보안 취약점 해소 기록.

## 주요 업그레이드
- next: 15.5.5 -> 16.2.6
- react/react-dom: 19.1.0 -> 19.2.6
- @biomejs/biome: 2.2.4 -> 2.4.15
- vitest: 3.2.4 -> 4.1.6
- typescript: 5.9.2 -> 6.0.3
- @playwright/test: 1.55.1 -> 1.60.0
- lint-staged: 16.1.6 -> 17.0.5
- 기타 @types/*, commitlint, msw, jsdom 최신화

## 추가 조치
- TypeScript 6 대응: `ignoreDeprecations: "6.0"` 추가
- Biome schema 업데이트: `2.4.15`
- 보안 조치: `pnpm.overrides.postcss = ^8.5.10`

## 검증 결과
- `pnpm lint:fix` 통과
- `pnpm typecheck` 통과
- `pnpm test` 통과
- `pnpm audit --prod` 결과: No known vulnerabilities found
