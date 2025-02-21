import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ErrorPage from "./pages/Error";
import SignUp from "./pages/SignUp";
import FindAccount from "./pages/FindAccount";
import LandingPage from "./pages/LandingPage";
import MainPage from "./pages/MainPage";
import DetailPage from "./pages/DetailPage";
import StockLiveData from "./components/WebSocket/StockLiveData";

function App() {
    return (
        // <GradientBackground>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/main" element={<MainPage />} />
                {/* 404 및 기타 오류 시 나타나는 페이지 - ErrorPage */}
                <Route path="*" element={<ErrorPage />} />

                {/* 계정 관련 페이지 */}
                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/find-account" element={<FindAccount />} />

                {/* 상세 페이지 */}
                <Route path="/stocks/:stockName" element={<DetailPage />} />

                {/* Websocket 용 Test 페이지 */}
                <Route path="/websocket" element={<StockLiveData />} />
            </Routes>
        // </GradientBackground>
    );
}

export default App;
