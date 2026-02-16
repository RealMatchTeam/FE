# Real Match

## 기술 스택

- **패키지 매니저**: pnpm - 효율적인 캐싱과 디스크 용량 절약을 위해 선택
- **프레임워크**: Vite 7 + React 19 - 최신 성능 최적화와 Concurrent 기능 활용을 위해 선택
- **라우팅**: TanStack Router (File-based Routing) - 완벽한 타입 안전성과 데이터 로딩 통합 관리를 위해 선택
- **언어**: TypeScript 5 - 강력한 타입 추론과 개발 안정성 확보를 위해 선택
- **스타일링**: Tailwind CSS v4 - 런타임 오버헤드 없는 제로 런타임 스타일링을 위해 선택
- **폰트**: Pretendard Variable - 가독성 높은 한국어 웹폰트 최적화를 위해 선택
- **상태관리**: Zustand - 보일러플레이트 없는 간결한 전역 상태 관리를 위해 선택
- **데이터 페칭**: TanStack Query (React Query) v5 - 서버 상태 동기화 및 강력한 캐싱 기능을 위해 선택
- **PWA**: vite-plugin-pwa - 모바일 네이티브 앱과 유사한 사용자 경험 제공을 위해 선택

## 프로젝트 구조

TanStack Router의 파일 기반 라우팅 규칙을 따르며, `src/routes` 디렉토리가 라우트 트리를 구성합니다.

```text
src/
├── main.tsx                # 엔트리 포인트
├── App.tsx                 # RouterProvider 및 Provider 설정
├── globals.css             # Tailwind v4 설정 및 디자인 시스템
├── utils/                  # 유틸리티 함수
├── stores/                 # Zustand 전역 상태 관리
├── data/                   # Mock 데이터 및 상수
├── routes/                 # TanStack Router 파일 기반 라우팅
│   ├── __root.tsx          # 최상위 루트 레이아웃 (MobileContainer)
│   ├── auth/               # 인증 라우트 (/auth/*)
│   │   └── login/          # /auth/login
│   │       ├── route.tsx
│   │       └── login-content.tsx
│   ├── _main.tsx           # 메인 레이아웃 (BottomTab 포함)
│   │   ├── layout-context.tsx   # BottomTab 표시 제어
│   │   ├── components/     # _main 전용 컴포넌트
│   │   │   └── BottomTab.tsx
│   │   ├── _home/          # / (홈)
│   │   │   ├── index.tsx
│   │   │   ├── home-content.tsx
│   │   │   └── components/
│   │   └── _chat/          # /_main/_chat (채팅 목록)
│   │       ├── route.tsx
│   │       ├── chat-content.tsx
│   │       ├── chatting-room.tsx  # /_main/_chat/chatting-room
│   │       ├── components/
│   │       └── types/
│   ├── matching-test/      # 매칭 테스트 라우트 (/matching-test/*)
│   │   ├── matching-test/  # /matching-test/matching-test/*
│   │   │   ├── step1/
│   │   │   │   ├── route.tsx
│   │   │   │   └── step1-content.tsx
│   │   │   ├── step2/
│   │   │   └── step3/
│   │   ├── matching-result/  # /matching-test/matching-result
│   │   │   ├── route.tsx
│   │   │   └── matching-result-content.tsx
│   │   └── components/
│   └── _business/          # 비즈니스 라우트
│       └── calendar/       # /_business/calendar
└── components/
    └── layout/             # 레이아웃 컴포넌트
        ├── MobileContainer.tsx  # 데스크톱 중앙 정렬 래퍼
        └── Header.tsx           # 공통 상단바
```

## 디자인 시스템

### Tailwind CSS v4 사용법

Tailwind CSS v4에서는 `@theme` 블록에서 CSS 변수로 커스텀 색상을 정의합니다.

#### 컬러 시스템

```css
/* globals.css에 정의된 색상 변수 */
@theme {
  --color-core-1: #6666e5;
  --color-core-2: #e6e6f3;
  --color-core-3: #b7b7f3;

  --color-text-black: #171718;
  --color-text-gray1: #494a50;
  --color-text-gray2: #5b5d6b;
  --color-text-gray3: #9b9ba1;
  --color-text-gray4: #d4d4d9;
  --color-text-gray5: #f3f3f3;

  --color-bluegray-1: #f3f4f8;
  --color-bluegray-2: #ebeefb;
}
```

```tsx
// 사용 예시
<div className="bg-core-1 text-white">메인 컬러</div>
<p className="text-text-gray2">회색 텍스트</p>
<div className="bg-bluegray-1">배경</div>
```

#### 타이포그래피

커스텀 타이포그래피 클래스가 `globals.css`에 정의되어 있습니다:

```tsx
// 타이틀
.text-title      // 20px, 600
.text-title1     // 16px, 600
.text-title2     // 16px, 500
.text-headline1  // 28px, 800

// 본문
.text-body1      // 14px, 500
.text-caption    // 14px, 600

// Callout
.text-callout1   // 18px, 600
.text-callout2   // 12px, 500
.text-callout3   // 10px, 600
.text-callout4   // 24px, 600
```

#### 그라디언트

```tsx
// 커스텀 그라디언트 클래스
.bg-grad-calendar-1  // linear-gradient(135deg, #B7B7F3 0%, #6666E5 100%)
.bg-grad-calendar-2  // linear-gradient(135deg, #A7B8FC 0%, #6666E5 100%)
.bg-grad-creator     // linear-gradient(135deg, #6666E5 0%, #3B3B98 100%)
```

## 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm run dev
```

브라우저에서 [http://localhost:5173](http://localhost:5173)을 열어 확인하세요.

### 페이지 구조

- `/` - 홈 (하단 탭바 포함)
- `/login` - 로그인 페이지
- `/matching` - 매칭 리스트
- `/chat` - 채팅
- `/mypage` - 마이페이지

## PWA 최적화

### 레이아웃 구조

- **데스크톱**: 중앙에 max-width 430px 컨테이너 배치, 배경 `#F3F4F8`
- **모바일**: 전체 화면 사용, 네이티브 앱과 동일한 UX

### Safe Area 대응

```tsx
className="safe-area-bottom"  // iOS 노치 영역 대응
className="safe-area-top"
```

### Manifest 설정

PWA 설정은 `vite.config.ts`에 정의되어 있습니다:

- `display: standalone` - 독립 앱처럼 실행
- `theme_color: #6666E5` - 주소창 브랜드 컬러
- `viewport-fit: cover` - 노치 영역까지 색상 적용

## 빌드

```bash
pnpm run build
pnpm run preview
```

## 개발 컨벤션

### 코드 컨벤션

#### TypeScript/JavaScript

```tsx
// 좋은 예
export default function UserProfile() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // ...
  };

  return <div>...</div>;
}

// 나쁜 예
export default function userprofile() {
  const [loading, setloading] = useState(false);
  return <div>...</div>;
}
```

**규칙:**

- 들여쓰기: 2 스페이스
- 세미콜론: 사용 (ESLint 기본 설정)
- 따옴표: 큰따옴표(`"`) 사용
- 함수 선언: 화살표 함수보다 `function` 키워드 우선 (컴포넌트 제외)
- 상수: `UPPER_SNAKE_CASE`
- Boolean 변수: `is`, `has`, `should` 접두사 사용

#### React 컴포넌트

```tsx
// Props 타입 정의
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export default function Button({
  label,
  onClick,
  variant = "primary",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn ${variant === "primary" ? "bg-core-1" : "bg-core-2"}`}
    >
      {label}
    </button>
  );
}
```

**규칙:**

- 컴포넌트는 PascalCase
- Props는 인터페이스로 명시적 타입 정의
- 기본값은 구조 분해 할당에서 지정
- 조건부 렌더링은 삼항 연산자 또는 `&&` 사용

#### CSS/Tailwind

```tsx
// 좋은 예 - 순서: 레이아웃 → 크기 → 색상 → 타이포그래피 → 기타
<div className="flex items-center justify-between w-full h-16 px-4 bg-white border-b border-text-gray5">

// 나쁜 예 - 순서가 뒤죽박죽
<div className="bg-white h-16 flex border-b w-full px-4 items-center border-text-gray5 justify-between">
```

**Tailwind 클래스 순서:**

1. 레이아웃 (flex, grid, block 등)
2. 위치 (relative, absolute 등)
3. 크기 (w-, h-, max-w- 등)
4. 간격 (p-, m-, gap- 등)
5. 배경/테두리 (bg-, border- 등)
6. 텍스트 (text-, font- 등)
7. 효과 (shadow-, opacity- 등)
8. 상태 (hover:, focus: 등)

### 네이밍 컨벤션

#### 파일/폴더명

| 타입            | 규칙             | 예시                               |
| --------------- | ---------------- | ---------------------------------- |
| 컴포넌트        | PascalCase       | `Button.tsx`, `UserProfile.tsx`    |
| 페이지 (라우트) | kebab-case       | `login.tsx`, `mypage.tsx`          |
| 유틸/훅         | camelCase        | `useAuth.ts`, `formatDate.ts`      |
| 타입/인터페이스 | PascalCase       | `types.ts`, `api.types.ts`         |
| 상수            | UPPER_SNAKE_CASE | `constants.ts`, `API_ENDPOINTS.ts` |

#### 변수/함수명

```tsx
// 변수
const userName = "John"; // camelCase
const MAX_RETRY_COUNT = 3; // 상수는 UPPER_SNAKE_CASE
const isLoggedIn = false; // Boolean은 is/has/should 접두사

// 함수
function getUserData() {} // 동사 + 명사
function handleClick() {} // 이벤트 핸들러는 handle 접두사
async function fetchUserProfile() {} // 비동기는 fetch/load/submit 등

// 컴포넌트
function LoginForm() {} // PascalCase
function UserListItem() {} // 명사 조합
```

#### React Hooks

```tsx
// Custom Hooks
function useAuth() {} // use 접두사 필수
function useLocalStorage() {}
function useFetchData() {}

// 사용 예시
const { user, login, logout } = useAuth();
const [value, setValue] = useLocalStorage("key");
```

### 커밋 컨벤션

#### Conventional Commits 규칙

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type

| Type       | 설명                     | 예시                                |
| ---------- | ------------------------ | ----------------------------------- |
| `feat`     | 새로운 기능 추가         | `feat: 로그인 페이지 구현`          |
| `fix`      | 버그 수정                | `fix: 로그인 버튼 클릭 오류 수정`   |
| `design`   | UI/UX 디자인 변경        | `design: 헤더 레이아웃 개선`        |
| `style`    | 코드 포맷팅, 세미콜론 등 | `style: ESLint 규칙 적용`           |
| `refactor` | 코드 리팩토링            | `refactor: 인증 로직 분리`          |
| `chore`    | 빌드, 패키지 등          | `chore: Tailwind CSS 설정`          |
| `docs`     | 문서 수정                | `docs: README 업데이트`             |
| `test`     | 테스트 코드              | `test: 로그인 API 테스트 추가`      |
| `rename`   | 파일/폴더명 변경         | `rename: components 폴더 구조 변경` |
| `remove`   | 파일 삭제                | `remove: 미사용 컴포넌트 제거`      |

#### Subject

- 50자 이내로 작성
- 마침표 사용 안 함
- 명령문 사용 (ex. "추가")
- 한글 또는 영문 사용

#### 예시

```bash
# 기능 추가
feat: 사용자 프로필 페이지 구현
feat(matching): 매칭 리스트 필터링 기능 추가

# 버그 수정
fix: 로그인 시 토큰 저장 오류 해결
fix(chat): 채팅방 목록 로딩 무한루프 수정

# 디자인 변경
design: 로그인 페이지 그라데이션 배경 적용
design(header): 상단바 그림자 효과 추가

# 리팩토링
refactor: API 호출 로직 커스텀 훅으로 분리
refactor(auth): 인증 상태 관리 Context API로 변경

# 기타
chore: Pretendard 폰트 추가
docs: 디자인 시스템 가이드 작성
style: Prettier 적용
```

#### 커밋 메시지 본문 (선택사항)

상세한 설명이 필요한 경우:

```bash
git commit -m "feat: 매칭 알고리즘 구현

- 사용자 선호도 기반 매칭 점수 계산
- 거리 기반 필터링 추가
- 매칭 결과 정렬 기능 구현
```

main              # 프로덕션 배포 브랜치
├── feat/login-page          # 기능 개발
├── fix/chat-loading-error   # 버그 수정
└── design/home-layout       # 디자인 작업

- `feat/기능명` - 새 기능
- `fix/버그명` - 버그 수정
- `design/작업명` - UI/UX 작업
- `refactor/작업명` - 리팩토링
- `hotfix/긴급수정명` - 긴급 수정


