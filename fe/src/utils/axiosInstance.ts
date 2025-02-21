import axios from "axios";
import { apiUrl } from "./\bglobalFunc";

// 서버 모드에 따라 API 서버의 URL을 다르게 설정 (.env.development 파일 참조)
// const serverMode = import.meta.env.VITE_SERVER_MODE;
// 서버 모드 : local -> 프론트 json-server, "" -> 백엔드 서버 ("/api"로 시작하는 URL)
// const apiUrl =
//     serverMode === "local"
//         ? import.meta.env.VITE_API_BASE_URL
//         : import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: apiUrl, // 백엔드 API 서버의 URL
    timeout: 5000, // 요청 시간 초과 시간 (밀리초 단위 : 5초)
    // 공통 헤더 설정
    headers: {
        "Content-Type": "application/json",
        // 필요에 따라 다른 공통 헤더를 추가할 수 있습니다.
    },
});

export default axiosInstance;
