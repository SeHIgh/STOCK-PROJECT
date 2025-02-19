import SubLayout from "../components/SubLayout";

const LandingPage = () => {
    return (
        <SubLayout>
            <div className="sm:mb-8 sm:flex sm:justify-center flex flex-col gap-1 group">
                <img
                    alt=""
                    src="/AnTrading_Logo_mini_color_neautral.svg"
                    className="w-10 transition duration-900 ease-out rotate-y-180 hover:scale-115 group-hover:opacity-70 group-hover:translate-x-70"
                />
                <div className="relative rounded-full px-3 py-1 text-sm/6 text-neutral-600 ring-1 ring-neutral-900/10 hover:ring-neutral-900/20 group">
                    개미상회에 대해서 더 알고 싶다면?{" "}
                    <a href="/docs" className="font-semibold text-neutral-500">
                        <span aria-hidden="true" className="absolute inset-0" />
                        더 알아보기
                        <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </div>
            <div className="text-center">
                <h1 className="text-5xl font-semibold tracking-tight text-balance text-neutral-600 sm:text-6xl gugi-font">
                    개미상회
                </h1>
                <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                    실시간 주식 데이터를 활용하여 증권 거래를 체험해볼 수 있는
                    플랫폼 서비스
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a
                        href="/main"
                        className="rounded-md bg-neutral-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500"
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
        </SubLayout>
    );
};

export default LandingPage;
