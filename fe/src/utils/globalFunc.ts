// Desc: 전역으로 사용할 수 있는 함수들을 정의

// 개발 모드 확인 - local, dev, prod
export const isLocalMode = import.meta.env.VITE_SERVER_MODE === "local"; // .env 값 가져오기

// 개발 모드에 따른 API 서버 URL
export const apiUrl = isLocalMode
    ? import.meta.env.VITE_API_MOCK_URL
    : import.meta.env.VITE_API_BASE_URL;
