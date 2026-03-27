# 배포 후 인증/API 연동 확인 가이드

현재 프론트는 `rallyon.test`, 인증은 `auth.rallyon.test`, API는 `api.rallyon.test`를 사용합니다.

## 1. 로그인 플로우 확인

1. `https://rallyon.test/login?returnTo=/court-manager` 접속
2. 잠시 후 `https://auth.rallyon.test/login?returnTo=/court-manager` 로 이동되는지 확인
3. 인증 서버 로그인 화면이 `https://auth.rallyon.test/login` 에서 프론트 UI로 열리고, 내부적으로 `POST https://auth.rallyon.test/identity/sessions` 호출 후 세션이 준비되는지 확인
4. 로그인 성공 후 `https://rallyon.test/...` 로 돌아오는지 확인

### Network 탭에서 볼 것

- `POST https://auth.rallyon.test/identity/sessions`
- `GET https://auth.rallyon.test/identity/sessions/current`
- `GET https://auth.rallyon.test/oauth2/authorize`
- `POST https://auth.rallyon.test/oauth2/token`
- 이후 보호 API 호출은 `https://api.rallyon.test/users/me`

## 2. 쿠키 확인

브라우저 개발자 도구의 Application/Storage 탭에서 아래를 확인합니다.

- `access_token`
  - Domain: `.rallyon.test`
  - Path: `/`
- `refresh_token`
  - Host-only: `auth.rallyon.test`
  - Path: `/identity`

둘 다 `HttpOnly`, `Secure` 이어야 합니다.

## 3. 자동 refresh 확인

1. 보호 API 호출이 401을 받으면
2. 프론트가 `POST https://auth.rallyon.test/identity/tokens/refresh` 를 호출하는지 확인
3. refresh 성공 후 원래 API 요청이 다시 성공하는지 확인

## 4. 환경 변수 확인

프론트 환경 변수:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_AUTH_URL`
- `NEXT_PUBLIC_API_URL`

백엔드 환경 변수:

- `APP_AUTH_ISSUER`
- `APP_AUTH_FRONTEND_BASE_URL`
- `APP_AUTH_BROWSER_REDIRECT_URI`
- `APP_AUTH_ACCESS_TOKEN_COOKIE_DOMAIN`
- `APP_API_HOST`

## 5. 흔한 문제

### 인증 화면이 안 뜨는 경우

- `auth.rallyon.test` nginx 라우팅 확인
- `auth.rallyon.test/login` 이 프론트로, `/identity/**` 와 `/oauth2/**` 가 백엔드로 분기되는지 확인
- 로컬 인증서 SAN에 `auth.rallyon.test` 포함 여부 확인
- `/etc/hosts`에 `auth.rallyon.test` 등록 여부 확인

### refresh가 실패하는 경우

- `refresh_token` 쿠키가 `auth.rallyon.test`에만 설정돼 있는지 확인
- 프론트가 `api`가 아니라 `auth` origin으로 refresh 요청을 보내는지 확인

### 소셜 버튼이 안 보이는 경우

- `OAUTH_ALLOWED_PROVIDERS`에 해당 provider가 포함돼 있는지 확인
- Google은 `GOOGLE_OAUTH_ENABLED=true` 와 실제 클라이언트 값이 설정되어 있는지 확인
- Apple은 `APPLE_OAUTH_ENABLED=true`, `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` 가 설정되어 있는지 확인
- DUMMY는 `OAUTH_DUMMY_ENABLED=true` 와 `OAUTH_DUMMY_LOGIN_PAGE_VISIBLE=true` 둘 다 필요합니다

### CORS 에러가 나는 경우

- 브라우저 origin은 `https://rallyon.test`
- 백엔드 CORS 허용 목록에 `https://rallyon.test` 가 포함돼 있어야 함
