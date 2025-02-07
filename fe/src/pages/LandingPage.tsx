import MainLayout from "../components/MainLayout";

const LandingPage = () => {
    return (
        <MainLayout>
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                    저희 플랫폼에 대해서 더 알고 싶다면?{" "}
                    <a href="/docs" className="font-semibold text-indigo-600">
                        <span aria-hidden="true" className="absolute inset-0" />
                        더 알아보기
                        <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </div>
            <div className="text-center">
                <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
                    Stock Project
                </h1>
                <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                    실시간 주식 데이터를 활용하여 증권 거래를 체험해볼 수 있는
                    플랫폼 서비스
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a
                        href="/main"
                        className="rounded-md bg-indigo-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                        시작하기
                    </a>
                    <a
                        href="/login"
                        className="text-sm/6 font-semibold text-gray-900 hover:text-gray-500"
                    >
                        처음이 아니에요 <span aria-hidden="true">→</span>
                    </a>
                </div>
            </div>
        </MainLayout>
    );
};

export default LandingPage;
