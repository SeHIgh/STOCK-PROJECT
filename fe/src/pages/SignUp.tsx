import React, { useState } from 'react';
import axios from 'axios';

const SignUp: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [birth, setBirth] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 입력값 검증
        if (!name || !email || !password || !confirmPassword || !birth) {
            setError('모든 필드를 채워주세요.');
            return;
        }

        if (password !== confirmPassword) {
            setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('https://your-api-endpoint.com/signup', {
                name,
                nickname: nickname || name, // 별명이 비어있으면 이름을 별명으로 설정
                email,
                password,
                birth,
            });

            // 회원가입 성공 시 처리 로직
            console.log('회원가입 성공:', response.data);
            // 예: 회원가입 성공 후 리디렉션
            // window.location.href = '/login';
        } catch (error: any) {
            setError(error.response?.data?.message || '서버 연결이 불안정 합니다.');
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
                <h2 className="text-2xl font-bold mb-4">회원 가입</h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-row gap-4 mb-4">
                        <div className="">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                이름 <span className="text-sm text-neutral-400">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="김투자"
                                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-neutral-400 focus:border-neutral-400 text-sm"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="">
                            <label
                                htmlFor="nickname"
                                className="block text-sm font-medium text-gray-700"
                            >
                                별명 <span className="text-[11px] text-gray-400">(미입력 시 이름으로 설정)</span>
                            </label>
                            <input
                                type="text"
                                id="nickname"
                                placeholder="투자왕"
                                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-neutral-400 focus:border-neutral-400 text-sm"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            이메일 <span className="text-sm text-neutral-400">*</span>
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
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            비밀번호 <span className="text-sm text-neutral-400">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="(문자, 숫자, 특수문자 포함 8자 이상)"
                            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-neutral-400 focus:border-neutral-400 text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            비밀번호 확인 <span className="text-sm text-neutral-400">*</span>
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="비밀번호 재입력"
                            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-neutral-400 focus:border-neutral-400 text-sm"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="birth"
                            className="block text-sm font-medium text-gray-700"
                        >
                            생년월일 <span className="text-sm text-neutral-400">*</span>
                        </label>
                        <input
                            type="date"
                            id="birth"
                            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-neutral-400 focus:border-neutral-400 text-sm"
                            value={birth}
                            onChange={(e) => setBirth(e.target.value)}
                        />
                    </div>
                    {/* 회원가입 에러 메세지 */}
                    {error ? <p className="text-red-500 text-sm">{error}</p> : <p className="text-transparent text-sm">good</p>}
                    <button
                        type="submit"
                        className="w-full mt-2 bg-neutral-400 py-2 px-4 rounded-lg text-white hover:bg-neutral-400/70"
                    >
                        가입 하기
                    </button>
                </form>
            </div>
            <div className="h-20"></div>
        </div>
    );
};

export default SignUp;