# Windows/macOS 개발 환경 가이드

## 공통 요구사항
- Node.js 20 이상
- pnpm 10 이상

권장 설치 흐름:

```bash
corepack enable
corepack prepare pnpm@10.22.0 --activate
pnpm install
```

검증:

```bash
pnpm check
pnpm dev
```

`pnpm check`는 lint, typecheck, unit test를 순서대로 실행한다.
`pnpm dev`와 `pnpm build`는 Windows 프로세스 권한 이슈를 피하기 위해 Next.js Webpack 모드로 실행한다.

## Windows PowerShell 한글 표시

Windows PowerShell에서 한글이 깨져 보이면 저장소 루트에서 아래 명령을 먼저 실행한다.

```powershell
.\scripts\utf8.ps1
```

현재 세션의 콘솔 입출력을 UTF-8로 맞춘다. 파일은 `.editorconfig`와 `.gitattributes` 기준으로 UTF-8/LF를 유지한다.

## macOS/Linux

대부분의 터미널은 UTF-8이 기본값이다. `locale` 출력에 `UTF-8`이 포함되어 있으면 별도 설정이 필요 없다.

```bash
locale
```

## npm만 있는 환경

pnpm 설치 전에도 기존 `node_modules`가 있다면 아래 명령으로 로컬 도구를 실행할 수 있다.

```bash
npm run check
npm run dev
```

프로젝트의 표준 패키지 매니저는 pnpm이며, 새 의존성 설치와 lockfile 갱신은 pnpm으로 진행한다.
