import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/sign-up" element={<SignUp />}/>
            <Route path="/find-account" element={<SignUp />}/> */}
        </Routes>
    );
}

export default App;
