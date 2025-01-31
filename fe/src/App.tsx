import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ErrorPage from "./pages/Error";
import SignUp from "./pages/SignUP";
import FindAccount from "./pages/FindAccount";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            {/* 404 및 기타 오류 시 나타나는 페이지 - ErrorPage */}
            <Route path="*" element={<ErrorPage />} />            
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />}/>
            <Route path="/find-account" element={<FindAccount />}/>
        </Routes>
    );
}

export default App;
