# RallyOn Frontend

RallyOn 프론트엔드 애플리케이션입니다.

앱 아키텍처와 유비쿼터스 언어의 canonical 기준은 [`../backend/ARCHITECTURE.md`](../backend/ARCHITECTURE.md)를 따릅니다.
이 문서는 프론트 작업자가 실제 개발/실행/검증 흐름을 빠르게 이해할 수 있도록 정리한 로컬 가이드입니다.

## 기술 기준

- Next.js App Router
- React 19
- Next.js 16
- React Compiler 활성화
- `next.config.ts`의 `allowedDevOrigins`
  - `rallyon.test`
  - `auth.rallyon.test`

## 디렉터리 개요

주요 작업 위치:

- `src/app`: 라우트와 페이지 진입점
- `src/components`: 공용 UI와 기능 컴포넌트
- `src/lib`: 유틸리티와 클라이언트 공통 로직
- `src/hooks`: React hooks

현재 주요 화면 경로 예시:

- `src/app/login`
- `src/app/signup`
- `src/app/profile`
- `src/app/court-manager`

## 개발 모드

프론트는 목적에 따라 두 가지 방식으로 개발할 수 있습니다.

### 1) 단독 UI 개발

UI만 빠르게 확인할 때는 Next 개발 서버를 직접 실행합니다.

```bash
npm install
npm run dev
```

접속:

- `http://localhost:3000`

이 모드는 레이아웃, 컴포넌트, 단순 상호작용 확인에 적합합니다.
다만 실제 auth/api host, Secure cookie, 로컬 프록시 경계는 이 모드에서 완전히 재현되지 않습니다.

### 2) 실제 로컬 연동 개발

실제 RallyOn 로컬 흐름을 확인할 때는 `infra`의 프록시를 통해 실행합니다.

```bash
cd ../infra
make up-live fe
```

로컬 canonical host:

- 프론트: `https://rallyon.test`
- 인증 호스트: `https://auth.rallyon.test`
- API 호스트: `https://api.rallyon.test`

이 모드에서는 다음을 함께 확인할 수 있습니다.

- auth host와 api host 분리
- 로컬 HTTPS
- 쿠키 도메인/경로 동작
- 프록시 경유 라우팅

실제 프록시/인증서/환경 변수 설정은 [`../infra/README.md`](../infra/README.md)를 기준으로 확인합니다.

## 실행 관련 메모

- `make up-live fe` 환경에서는 로컬 HTTPS 프록시가 `rallyon.test` 기준으로 동작합니다.
- `next.config.ts`는 이 흐름을 위해 `allowedDevOrigins`를 설정하고 있습니다.
- 브라우저에서 auth/api 연동 문제를 볼 때는 `localhost`가 아니라 `.test` 호스트 기준으로 재현하는 편이 맞습니다.

## 검증 명령

기본 검증:

```bash
npm run lint
npm run build
```

권장 흐름:

1. UI 수정 중에는 `npm run dev` 또는 `make up-live fe`로 빠르게 확인합니다.
2. 변경 정리 후 `npm run lint`를 실행합니다.
3. PR 전 `npm run build`까지 통과시킵니다.

## 협업 규칙

기본 Git 흐름과 브랜치/커밋 규칙은 [`CONTRIBUTING.md`](./CONTRIBUTING.md)를 따릅니다.

요약:

1. Issue 생성
2. `type/{issue-number}-{slug}` 브랜치 생성
3. `type: 한글 제목` 형식으로 커밋
4. PR 생성
5. Squash merge
