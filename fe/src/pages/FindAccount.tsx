const FindAccount = () => {
    return (
        <div className="flex flex-col w-dvw h-dvh py-4 justify-between">
            <div className="h-10 flex justify-center items-center">
                <a href="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">Your Company</span>
                    <img alt="" src="/monitoring.svg" className="h-8 w-auto" />
                </a>
            </div>
            <div className="w-80 mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">로그인</h2>
                <form>
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-400 focus:border-indigo-400"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            비밀번호
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-400 focus:border-indigo-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-400 py-2 px-4 rounded-lg text-white hover:bg-indigo-300"
                    >
                        로그인
                    </button>
                    <div className="mt-2 flex flex-row justify-between">
                        <a href="/find-account" className="text-sm hover:text-gray-400">아이디∙비밀번호 찾기</a>
                        <a href="/sign-up" className="text-sm hover:text-gray-400">회원가입</a>
                    </div>
                </form>
            </div>
            <div className="h-20"></div>
        </div>
    );
};

export default FindAccount;
