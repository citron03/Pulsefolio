# Pulsefolio 디자인 세팅 가이드

## 개요
디자인은 글로벌 CSS 변수(Design Token)로 관리하며, 화면 컴포넌트는 해당 토큰만 사용한다.

## 토큰 구조
- `--pf-bg-*`: 배경
- `--pf-surface-*`: 카드/패널
- `--pf-border-*`: 경계
- `--pf-text-*`: 본문/보조 텍스트
- `--pf-accent-*`: 인터랙션
- `--pf-profit`, `--pf-loss`: 수익/손실
- `--pf-live-*`, `--pf-closed-*`: 시장 상태 배지

## 적용 파일
- `src/app/globals.css`: 토큰 정의 + 베이스 스타일
- `src/app/page.tsx`: 토큰 기반 클래스 사용

## Headless UI
- 라이브러리: `@headlessui/react`
- 현재 적용: 대시보드 섹션 전환 탭
- 원칙: 동작/접근성은 Headless UI, 시각은 프로젝트 토큰으로 커스터마이즈

## 운영 규칙
- 신규 색상 추가 시 semantic token 우선
- 하드코딩된 hex 값은 토큰으로 승격 후 사용
- 디자인 변경 PR에는 토큰 변경 이유를 명시


## Tailwind 통합
- Tailwind v4를 PostCSS 플러그인(`@tailwindcss/postcss`)으로 통합
- 엔트리 파일: `src/app/globals.css` (`@import "tailwindcss";`)
- 전략: 유틸리티는 Tailwind로 사용하고, 의미 체계(컬러/상태)는 CSS 토큰으로 관리
