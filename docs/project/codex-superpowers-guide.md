# Codex Superpowers 운영 가이드

## 목적
Pulsefolio 문맥에서 Superpowers 스킬을 일관되게 적용하기 위한 기준 문서.

## 기본 적용 순서
1. `superpowers:using-superpowers`
2. 기획/설계 단계: `superpowers:brainstorming`
3. 구현 계획 단계: `superpowers:writing-plans`
4. 구현 단계: `superpowers:executing-plans` 또는 `superpowers:subagent-driven-development`
5. 완료 전 검증: `superpowers:verification-before-completion`

## Pulsefolio 특화 체크포인트
- 장 상태(장전/장중/장후/휴장) 처리 확인
- polling 해제 누락 여부 확인
- 수익률 계산식 테스트 포함 여부 확인
- 상태 4종 처리 누락 여부 확인

## 문서 동기화 규칙
스펙/명세 변경 시 다음 문서를 함께 갱신한다.
- `docs/planning/pulsefolio-prd-v1.1.md`
- `docs/specs/technical-spec-v1.0.md`
- `docs/project/project-docs.md`
