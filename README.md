# 급여계산기 (Korean Payroll Calculator)

한국 직장인을 위한 종합 급여 계산 웹 애플리케이션입니다. 실급여, 퇴직금, 연차수당을 정확하게 계산할 수 있습니다.

## 주요 기능

### 💰 실급여 계산기
- 연봉 기반 세후 실급여 계산
- 부양가족 수에 따른 소득공제 적용
- 비과세 항목 (식대, 교통비) 반영
- 국민연금, 건강보험, 고용보험 등 4대보험료 자동 계산
- 소득세 및 지방소득세 계산

### 🤝 퇴직금 계산기
- 근속년수 기반 퇴직금 계산
- 평균임금 기준 정확한 산정
- 퇴직금 일시지급 및 퇴직연금 선택 옵션
- 근로기준법 준수한 계산 공식 적용

### 🏖️ 연차수당 계산기
- 미사용 연차일수 기반 수당 계산
- 일급여 자동 산정
- 퇴사 시점 연차수당 정확한 계산

## 기술 스택

### Frontend
- **React 18** with TypeScript
- **Vite** - 빠른 개발 환경
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **shadcn/ui** - 모던 UI 컴포넌트 라이브러리
- **React Hook Form** - 폼 상태 관리
- **TanStack Query** - 서버 상태 관리
- **Wouter** - 경량 라우팅

### Backend  
- **Express.js** with TypeScript
- **Zod** - 스키마 검증
- **Drizzle ORM** - 타입 안전 데이터베이스 ORM
- **PostgreSQL** - 데이터베이스 (Neon)

### 개발 도구
- **ESBuild** - 고성능 번들러
- **TSX** - TypeScript 실행 환경
- **Drizzle Kit** - 데이터베이스 마이그레이션

## 설치 및 실행

### 사전 요구사항
- Node.js 20.x 이상
- npm 또는 yarn

### 로컬 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버가 실행되면 `http://localhost:5000`에서 애플리케이션에 접근할 수 있습니다.

## 프로젝트 구조

```
├── client/                 # 프론트엔드 소스
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   │   ├── ui/        # shadcn/ui 컴포넌트
│   │   │   ├── SalaryCalculator.tsx
│   │   │   ├── SeveranceCalculator.tsx
│   │   │   └── LeaveCalculator.tsx
│   │   ├── hooks/         # 커스텀 훅
│   │   ├── lib/           # 유틸리티 함수
│   │   ├── pages/         # 페이지 컴포넌트
│   │   └── App.tsx
│   └── index.html
├── server/                # 백엔드 소스
│   ├── index.ts          # 서버 진입점
│   ├── routes.ts         # API 라우트
│   └── storage.ts        # 저장소 인터페이스
├── shared/               # 공유 스키마
│   └── schema.ts        # Zod 스키마 정의
└── package.json
```

## API 엔드포인트

### POST `/api/calculate-salary`
실급여 계산 API
```json
{
  "annualSalary": 50000000,
  "dependents": 2,
  "mealAllowance": 100000,
  "transportAllowance": 100000
}
```

### POST `/api/calculate-severance`
퇴직금 계산 API
```json
{
  "workYears": 3,
  "workMonths": 6,
  "averageWage": 4500000,
  "severanceType": "lump-sum"
}
```

### POST `/api/calculate-leave`
연차수당 계산 API
```json
{
  "dailyWage": 150000,
  "totalLeave": 15,
  "usedLeave": 8,
  "resignationDate": "2024-12-31"
}
```

## 특징

- **정확한 계산**: 2024년 한국 세법 및 노동법 기준 적용
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **사용자 친화적**: 직관적인 인터페이스와 명확한 결과 표시
- **타입 안전성**: TypeScript로 전체 애플리케이션 개발
- **실시간 계산**: 입력 즉시 결과 확인 가능

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 주의사항

본 계산 결과는 참고용이며, 실제 지급되는 금액과 차이가 있을 수 있습니다. 정확한 금액은 소속 회사의 급여 담당자나 세무 전문가에게 문의하시기 바랍니다.

---

© 2024 급여계산기. 모든 권리 보유.