# Pulsefolio 디자인 철학 (v1.0)

## 목적
Pulsefolio의 UI/UX는 과시적 금융 대시보드가 아니라, 투자 의사결정에 필요한 정보를 차분하고 정확하게 전달하는 것을 목표로 한다.

## 철학의 기반

### 1) Dieter Rams의 Good Design 원칙 반영
참고: [Vitsœ - The power of good design](https://www.vitsoe.com/us/about/good-design)

Pulsefolio는 아래 원칙을 핵심 기준으로 삼는다.
- 유용성: 시각적 장식보다 투자 판단에 필요한 정보 전달 우선
- 이해가능성: 수익/손실, 시장 상태, 갱신 시각을 즉시 해석 가능하게 구성
- 정직성: 실시간이 아니면 실시간처럼 보이게 하지 않음(`stale`, `장 종료` 명시)
- 절제: 금융 화면의 과도한 노이즈를 줄이고 핵심 지표 중심 배치
- 디테일: 숫자 포맷, 상태 배지, 오류 메시지까지 일관된 규칙 유지
- 최소 디자인: Less, but better. 필요 없는 인터랙션/색상/장식 배제

### 2) Laws of UX 반영
참고: [Laws of UX](https://lawsofux.com/)

Pulsefolio는 다음 법칙을 우선 적용한다.
- Aesthetic-Usability Effect: 신뢰감 있는 시각 품질이 사용성 인식에 영향
- Hick’s Law: 선택지를 과도하게 늘리지 않고 핵심 액션 중심으로 단순화
- Fitts’s Law: 자주 사용하는 컨트롤은 충분한 크기/간격 확보
- Law of Proximity / Common Region: 관련 데이터는 동일 영역으로 묶어 인지부하 축소
- Jakob’s Law: 익숙한 금융 UI 패턴을 유지해 학습 비용 최소화
- Tesler’s Law: 불가피한 복잡도는 시스템이 흡수하고 화면은 단순하게 유지

## UI/UX 원칙
- 상태 우선: `loading`, `empty`, `error`, `stale`를 모든 데이터 블록에 구현
- 시장 맥락 우선: `LIVE`, `장 시작 전`, `장 종료`, `휴장` 상태를 명확히 표기
- 계산의 신뢰성: 손익/수익률은 수식과 표시 포맷을 통일
- 접근성: 색상만으로 의미를 전달하지 않고 기호(▲▼)와 텍스트를 병행
- 모바일 우선: 375px 화면에서 시장 상태와 핵심 손익을 먼저 읽게 하고, 차트와 보조 정보는 아래로 배치

## 컬러 원칙
- 기본 배경은 차분한 cool gray/blue 계열로 신뢰감을 형성
- 상승/하락은 한국 투자자 관습 기준으로 `상승=Red`, `하락=Blue` 기본값 사용
- 상태 색상은 의미별 semantic token(`success`, `warning`, `danger`, `info`)으로 관리
- 숫자 강조는 색 대비와 함께 텍스트/아이콘 동시 제공
- 모바일에서는 장식 색상보다 상태 색상(`live`, `warning`, `danger`, `stale`)의 우선순위를 높인다

## 컴포넌트 원칙
- 구조는 Headless UI + 프로젝트 토큰 조합으로 구성
- 로직과 스타일을 분리해 재사용성과 일관성을 확보
- 디자인 변경은 컴포넌트가 아니라 토큰을 먼저 수정
