import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ErrorPage from "./pages/Error";
import SignUp from "./pages/SignUp";
import FindAccount from "./pages/FindAccount";
import GradientBackground from "./components/GradientBG";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/Layouts/Footer";
import MainPage from "./pages/MainPage";
import DetailPage from "./pages/DetailPage";

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
                <Route path="/stocks/:productCode" element={<DetailPage />} />

                {/* Layout test */}
                <Route path="/footer" element={<Footer />} />
            </Routes>
        // </GradientBackground>
    );
}

export default App;
