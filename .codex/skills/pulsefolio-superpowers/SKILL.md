---
name: pulsefolio-superpowers
description: Pulsefolio 도메인(투자 모니터링, 포트폴리오, 시장상태) 전용 실행 규칙
---

# Pulsefolio Superpowers Skill

## 목적
Pulsefolio 개발에서 도메인 규칙을 일관되게 적용하기 위한 프로젝트 전용 스킬.

## 핵심 규칙
1. 거래 기능은 구현하지 않는다.
2. 모든 수익/손실 표시는 색상 + 기호(▲▼)를 함께 사용한다.
3. 모든 데이터 블록은 `loading/empty/error/stale` 상태를 구현한다.
4. 장 종료/휴장 시 polling을 중단한다.
5. API 미제공 값(PER/EPS)은 `N/A`로 처리한다.

## 계산 표준
- 평가금액 = 현재가 * 보유수량
- 투자원금 = 평균단가 * 보유수량
- 손익 = 평가금액 - 투자원금
- 수익률(%) = (손익 / 투자원금) * 100

## 구현 순서
1. Mock 데이터로 UI 완성
2. 도메인 계산 유닛 테스트 작성
3. API adapter 연결
4. polling + 시장상태 로직 연결
5. 성능/접근성 점검

## 금지사항
- 실시간 주문/체결 기능 암시 UI
- 인증 없는 민감정보 저장
- 시장 상태 무시한 polling
