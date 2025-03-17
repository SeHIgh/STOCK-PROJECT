# 개미상회

<p align="center">
  2025년 동계 웹 개발 프로젝트
</p>

<p align="center">
  <img width="500" alt="SeHi_Logo_NoTitle_Profile" src="https://github.com/user-attachments/assets/69039c82-7baa-48f1-8f4d-d9931879bc3b" />
</p>

<p align="center">
  실시간 주식 데이터를 활용하여 증권 거래를 체험해볼 수 있는 플랫폼 서비스
</p>

## 플랫폼 기능
### 국내 주식 (해외 주식은 추후 추가예정)

1. 메인 페이지
- 급상승, 급하락 종목 확인가능
- 주가지수 (코스피, 코스닥, 나스닥, S&P 500) 확인가능
- 주요 뉴스 확인 가능
- 실시간 환율 확인 가능
- 종목 검색창
- 관심 종목 [로그인 시 열람 가능]

2. 주식 상세 페이지
- 차트
- 주문 (매수, 매도) [로그인 시 열람 가능]
- 실시간 시세
- 호가 (채결 강도) [로그인 시 열람 가능]

(추후 기능 추가 예정)


## 소프트웨어 아키텍처

- 프론트 : React - Vite
- 백엔드 : Spring Boot
- DB : MySQL
- API :
  [한국투자 Open 
API](https://apiportal.koreainvestment.com/apiservice/oauth2#L_5c87ba63-740a-4166-93ac-803510bb9c02),  [Naver Open API - 뉴스검색](https://developers.naver.com/docs/serviceapi/search/news/news.md)



## 팀원 소개

|FE|BE|
|-|-|
|<img width="80" alt="SeHi_Logo_NoTitle_Profile" src="https://github.com/user-attachments/assets/4c98b3ec-4774-4c1e-8cad-f775fb6bb3f0" />|<img width="80" alt="Juhoimda_Logo_img" src="https://github.com/user-attachments/assets/272b2956-c2e4-4489-82c7-c1a80ab213b5" />|
|[장세현](https://github.com/SeHIgh)|[강주호](https://github.com/juhoimda)|


## Git Flow

```
main   # 배포용 브랜치. 최종 안정화된 코드만 포함.
└── develop     # 개발용 브랜치. 모든 작업 브랜치가 이곳으로 통합됨.
    ├── FE/main        # 프론트 개발 통합 작업 브랜치
    │   ├── FE/#기능/이름     # 프론트 개발 개별 작업 브랜치 (예: FE/#Login/sehyeon, FE/#Auth/sehyeon)
    └── BE/main        # 백엔드 개발 통합 작업 브랜치
        └── BE/#기능/이름     # 백엔드 개발 개별 작업 브랜치 (예: BE/#Login/juho)
```

## 🖥️ UI 구현 현황
## 1. 주요 페이지
### 1-1. 랜딩 페이지 `25.01.26(일) - 02.20(목)`
`(사이트 접속 시 처음 화면)`

<img width="1538" alt="image" src="https://github.com/user-attachments/assets/3f728c06-ecd0-4e4d-b11c-6dee490e0b1f" />

`(검색 창)`

<img width="1538" alt="image" src="https://github.com/user-attachments/assets/ef5f0b14-6ec5-4cf0-8069-80047aa770e4" />

### 1-2. 메인 페이지 `25.02.08(토) - 02.20(목)`
`(로그인 성공 시 화면)`

`(주가 지수 & 실시간 환율 & 주요 뉴스)`

<img width="1538" alt="image" src="https://github.com/user-attachments/assets/79e91d47-dd4f-49b8-bcac-387f63678514" />

`(실시간 차트 - 거래량 & 급상승 & 급하락)`

<img width="1538" alt="image" src="https://github.com/user-attachments/assets/1a96c49e-70ab-4a95-a794-7f338c7c861f" />

### 1-3. 종목 상세 페이지 `25.02.08(토) - 02.28(금)`
`(종목 검색 및 종목명 클릭 시 이동)`

<img width="1538" alt="image" src="https://github.com/user-attachments/assets/59c544d9-c919-4e5f-bb1e-c52dbe71312d" />
<img width="1538" alt="image" src="https://github.com/user-attachments/assets/3d52e561-101b-4d27-992a-d61195164e1b" />
<img width="1538" alt="image" src="https://github.com/user-attachments/assets/c6dd2be6-c075-44b8-ab77-36de49a16822" />

## 2. 계정
### 2-1. 로그인 페이지 `25.01.26(일) - 02.20(목)`
`(메인화면에서 "로그인" & "처음이 아니에요->" 클릭 시 이동)`

<img width="1538" alt="image" src="https://github.com/user-attachments/assets/476a59d7-1368-45a1-85b2-5bb72e2264e2" />

### 2-2. 회원가입 페이지 `25.02.01(토) - 02.20(목)`
`("메인화면/시작하기" & "로그인/회원가입" 클릭 시 이동)`

<img width="1538" alt="image" src="https://github.com/user-attachments/assets/e827dd20-105d-487e-9225-62608cb56684" />

### 2-3. 계정 찾기 페이지 `25.02.01(토) - 02.20(목)`
`("로그인/아이디∙비밀번호 찾기" 클릭 시 이동)`

#### 아이디 찾기
<img width="1538" alt="image" src="https://github.com/user-attachments/assets/0d324b30-dc82-41e2-85dc-a8f3aa78a757" />

#### 비밀번호 찾기
<img width="1538" alt="image" src="https://github.com/user-attachments/assets/ce3b5a46-3731-4acd-8a25-5a3ea87c671c" />

