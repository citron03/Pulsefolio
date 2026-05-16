# Git 브랜치/릴리즈 전략

## 목적
브랜치 기반 배포와 안정적인 릴리즈 관리를 위한 Git 운영 기준을 정의한다.

## 브랜치 전략

### 핵심 브랜치
- `main`: Production 기준 브랜치
- `develop` (선택): 기능 통합 및 사전 검증 브랜치

현재 팀 규모/속도를 고려한 기본 전략은 `main` 중심 경량 전략이다.

### 작업 브랜치 규칙
- 기능: `feature/<topic>` 또는 `codex/<topic>`
- 버그: `fix/<topic>`
- 문서: `docs/<topic>`
- 핫픽스: `hotfix/<topic>`

예시:
- `feature/dashboard-tabs`
- `fix/market-status-badge`
- `docs/deploy-policy`

## 배포 흐름

### 권장 플로우
1. 작업 브랜치 생성
2. PR 생성
3. Preview 배포 확인
4. 코드리뷰/체크 통과
5. `main` merge
6. Production 자동 배포

### 핫픽스 플로우
1. `hotfix/*` 브랜치 생성
2. 최소 수정 + 검증
3. `main` merge
4. Production 반영
5. 필요 시 태그 즉시 생성

## 태그 전략

### 목적
- 배포 시점을 코드 스냅샷으로 고정
- 롤백 기준점 확보
- 릴리즈 노트 기준점 제공

### 규칙
- SemVer 사용: `vMAJOR.MINOR.PATCH`
- 예시: `v0.1.0`, `v0.1.1`, `v0.2.0`
- 프로덕션 반영 커밋에는 **annotated tag** 생성 권장

태그 생성 예시:
```bash
git tag -a v0.1.0 -m "Release v0.1.0: mock dashboard + initial deploy"
git push origin v0.1.0
```

### 버전 정책
- MAJOR: 호환성 깨지는 변경
- MINOR: 기능 추가(호환 유지)
- PATCH: 버그 수정/작은 개선

## 커밋/머지 기준
- Commit message: Conventional Commits
- 머지 방식: Squash merge 권장
- PR 필수 체크:
  - lint/typecheck/test 통과
  - Preview URL 확인
  - 배포 영향도 점검

## 문서/로그 연계
- 릴리즈 후 업데이트 대상:
  - `docs/project/logs/YYYY-MM-DD.md`
  - `docs/project/deployment-vercel.md`
- 중요한 릴리즈는 태그와 함께 changelog 요약을 남긴다.
