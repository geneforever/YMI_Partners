# YMI Partners 홈페이지

별도 설치나 빌드 과정 없이 사용할 수 있는 정적 홈페이지입니다.

## GitHub에 올리는 방법

1. GitHub에서 새 저장소를 만듭니다.
2. 이 폴더 안의 파일과 `assets` 폴더를 저장소의 가장 바깥쪽에 올립니다.
3. 기본 브랜치 이름을 `main`으로 맞춥니다.
4. GitHub 저장소의 `Settings → Pages`로 이동합니다.
5. 배포 방식에서 `GitHub Actions`를 선택합니다.
6. `main` 브랜치에 파일이 올라가면 `.github/workflows/deploy-pages.yml`이 자동으로 홈페이지를 배포합니다.

배포가 끝나면 `Settings → Pages` 화면에서 홈페이지 주소를 확인할 수 있습니다.

## 내용과 이미지 바꾸기

- 글자와 이미지 경로: `content.js`
- 실제 이미지 파일: `assets` 폴더
- 화면 배치와 반응형 스타일: `styles.css`
- 메뉴와 화면 동작: `script.js`

문의 폼은 FormSubmit을 사용하며, 현재 테스트 수신 주소는 `geneforever001@gmail.com`입니다. 최종 운영 전에 `content.js`의 `contact.email`을 운영 이메일로 바꾸고 FormSubmit 인증을 다시 진행해 주세요.

## 도메인 연결

`www.ymipartners.co.kr`을 연결하려면 GitHub Pages의 사용자 지정 도메인 설정과 도메인 관리 화면의 DNS 설정이 추가로 필요합니다. 도메인 연결 전까지는 GitHub가 제공하는 Pages 주소로 먼저 확인할 수 있습니다.
