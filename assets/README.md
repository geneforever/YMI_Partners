# 이미지 교체 위치

실제 로고·메인 이미지·프로젝트 이미지를 이 폴더에 넣고 `content.js`의 이미지 경로를 다음처럼 바꿔 주세요.

```js
image: "assets/파일명.jpg"
```

현재 화면은 기존 YMI Partners 공개 사이트의 이미지를 임시로 사용합니다. 이미지 교체 시 HTML과 CSS는 수정하지 않아도 됩니다.

`member-shin.jpg`는 Members 프로필 창에 연결된 신동기 프로필 사진입니다. 사진을 교체할 때는 같은 파일명으로 바꾸거나 `content.js`의 `members.items[0].image` 경로만 수정하면 됩니다.

`partner-*.png` 파일들은 자문 유관기관 로고입니다. 로고를 교체할 때는 같은 파일명으로 바꾸거나 `content.js`의 `partners.items` 안 이미지 경로를 수정하면 됩니다.

`logo-full.jpg`와 `logo-symbol.png`는 이전에 사용하던 로고 파일입니다.

현재 헤더에는 한글형 로고 `logo-korean.png`를 사용합니다. `content.js`의 `site.logoSrc`에서 다른 로고 파일로 교체할 수 있습니다.

`ymi-partners-intro.mp4`는 첫 화면에 표시되는 소개 영상입니다. 영상을 교체할 때는 같은 파일명으로 바꾸거나 `content.js`의 `hero.video` 경로만 수정하면 됩니다.
