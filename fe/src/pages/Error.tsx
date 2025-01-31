const ErrorPage = () => {
    return (
        <>
            {/*             
                    This example requires updating your template:
            
                    ```
                    <html class="h-full">
                    <body class="h-full">
                    ```
            */}
            <main className="flex flex-col w-dvw h-dvh grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-xl font-semibold text-indigo-400">
                        404
                    </p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
                        페이지를 찾을 수 없습니다
                    </h1>
                    <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                        죄송해요, 이 페이지는 아직 준비 중이에요.
                    </p>
                    <p className="text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                        여러분의 <span className="font-semibold text-indigo-400">성공적인 투자</span>를 위해 곧 멋진 내용으로 채워질 예정이니 기대해 주세요!
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href="/"
                            className="rounded-md bg-indigo-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        >
                            메인 화면으로
                        </a>
                        <a
                            href="*"
                            className="text-sm font-semibold text-gray-900 hover:text-gray-500"
                        >
                            도움이 필요하신가요?{" "}
                            <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </div>
            </main>
        </>
    );
}

export default ErrorPage;