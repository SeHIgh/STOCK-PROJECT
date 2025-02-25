import axios from "axios";
import React, { useState } from "react";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 사용자 입력값 유효성 검토
        if (!email || !password) {
            setError("이메일과 비밀번호를 모두 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post("https://localhost:5173/login", {
                email,
                password,
            });

            // 로그인 성공 시 처리 로직
            console.log("로그인 성공:", response.data);

            // 로그인 성공 후 리디렉션
            window.location.href = '/main';
        } catch (error: any) {
            setError(error.response?.data?.message || "서버 연결이 불안정 합니다.");
        }
    };

    return (
        <div className="flex flex-col w-dvw h-dvh py-4 justify-between">
            <div className="h-20 flex justify-center items-center">
                <a href="/" className="-m-1.5 p-1.5">
                    <img alt="" src="/AnTrading_Logo_v2.svg" className="h-16 w-auto" />
                </a>
            </div>
            <div className="w-100 mx-auto bg-white/20 backdrop-blur-xs p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">로그인</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            이메일
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="stock@stock.com"
                            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-neutral-400 focus:border-neutral-400 text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            비밀번호
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="문자, 숫자, 특수문자 포함 8자 이상"
                            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-neutral-400 focus:border-neutral-400 text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {/* 로그인 에러 메세지 */}
                    {error ? <p className="text-red-500 text-sm">{error}</p> : <p className="text-transparent text-sm">good</p>}
                    <button
                        type="submit"
                        className="w-full mt-2 bg-neutral-400 py-2 px-4 rounded-lg text-white hover:bg-neutral-300"
                    >
                        로그인
                    </button>
                    <div className="mt-2 flex flex-row justify-between">
                        <a
                            href="/find-account"
                            className="text-sm hover:text-gray-400"
                        >
                            아이디∙비밀번호 찾기
                        </a>
                        <a
                            href="/sign-up"
                            className="text-sm hover:text-gray-400"
                        >
                            회원가입
                        </a>
                    </div>
                </form>
            </div>
            <div className="h-20"></div>
        </div>
    );
};

export default Login;
