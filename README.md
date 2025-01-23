# STOCK-PROJECT (이름 미정)

#### 실시간 주식 데이터를 활용하여 증권 거래를 체험해볼 수 있는 플랫폼 서비스

#### 2025년 동계 웹 개발 프로젝트
## 플랫폼 기능

1. 메인 페이지
- 급상승, 급하락 종목 확인가능
- 주가지수 (나스닥, S&P 500, 다우존스(DJI)) 확인가능
- 주요 뉴스 확인 가능
- 실시간 환율 확인 가능
- 종목 검색창 

2. 주식 상세 페이지
- 차트
- 주문 (매수, 매도)
- 실시간 시세
- 호가 (채결 강도)

(추후 기능 추가 예정)


## 소프트웨어 아키텍처

- 프론트 : React
- 백엔드 : Spring Boot
- DB : MySQL
- API :
  [한국투자 Open 
API](https://apiportal.koreainvestment.com/apiservice/oauth2#L_5c87ba63-740a-4166-93ac-803510bb9c02),  [Naver Open API - 뉴스검색](https://developers.naver.com/docs/serviceapi/search/news/news.md)



## 팀원 소개

|Web FE|Web BE|Web BE|
|-|-|-|
|[장세현](https://github.com/SeHIgh)|[장세현](https://github.com/SeHIgh)|[강주호](https://github.com/juhoimda)|


## Git Flow

```
main   # 배포용 브랜치. 최종 안정화된 코드만 포함.
└── develop     # 개발용 브랜치. 모든 작업 브랜치가 이곳으로 통합됨.
    ├── FE/#기능/이름     # 프론트 개발 개별 작업 브랜치 (예: FE/#Login/sehyeon, FE/#Auth/sehyeon)
    │
    └── BE/#기능/이름     # 백엔드 개발 개별 작업 브랜치 (예: BE/#Login/juho)
```
