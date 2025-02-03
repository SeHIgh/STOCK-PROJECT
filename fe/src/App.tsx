import { Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import ErrorPage from "./pages/Error";
import SignUp from "./pages/SignUp";
import FindAccount from "./pages/FindAccount";
import GradientBackground from "./components/GradientBG";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/Layouts/Footer";

function App() {
    return (
        <GradientBackground>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/main" element={<Main />} />
                {/* 404 및 기타 오류 시 나타나는 페이지 - ErrorPage */}
                <Route path="*" element={<ErrorPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/find-account" element={<FindAccount />} />

                {/* Layout test */}
                <Route path="/footer" element={<Footer />} />

            </Routes>
        </GradientBackground>
    );
}

export default App;
