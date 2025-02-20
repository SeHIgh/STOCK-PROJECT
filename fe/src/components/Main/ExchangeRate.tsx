import useFetchData from "../../hooks/useFetchData";
import { fetchExchangeRate } from "../../api/api";

const ExchangeRate = () => {
    // 환율 데이터 api 호출
    const {
        data: exchangeRates,
        loading,
        error,
    } = useFetchData(fetchExchangeRate);

    // 로딩 및 에러 화면
    if (loading || error)
        return (
            <>
                <h1 className="section-title-main">실시간 환율</h1>
                <ul className="relative w-full h-full flex flex-col justify-between gap-2 mt-3">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <li
                            key={index}
                            className="flex-1 card-main gray-hover flex flex-row gap-1"
                        >
                            <div
                                id="text_index"
                                className="flex-1 flex flex-row justify-between px-4 py-1 skeleton gap-1"
                            >
                                <div
                                    id="stockindex_label"
                                    className="flex-1 flex flex-row justify-start gap-1"
                                >
                                    <div className="flex flex-col justify-between skeleton-box">
                                        <h3 className="w-[50px] h-full text-lg font-semibold"></h3>
                                        <h3 className="w-[50px] h-full text-sm font-semibold text-gray-500"></h3>
                                    </div>
                                    <span className="w-full h-[50%] text-lg pt-2 skeleton-box"></span>
                                </div>
                                <div
                                    id="exchangerate_input"
                                    className="w-full h-full flex-1 flex flex-col justify-between skeleton-box"
                                >
                                    <h4 className="text-xl font-bold"></h4>
                                    <h4 className="text-sm font-semibold text-gray-500"></h4>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </>
        );

    return (
        <>
            <h1 className="section-title-main">실시간 환율</h1>
            <ul className="relative w-full h-full flex flex-col justify-between gap-2 mt-3">
                <li className="h-full flex-1 card-main gray-hover flex flex-row gap-1">
                    <div
                        id="text_index"
                        className="flex-1 flex flex-row justify-between px-4 py-1"
                    >
                        <div
                            id="stockindex_label"
                            className="flex-1 flex flex-row justify-start gap-1"
                        >
                            <div className="flex flex-col justify-between">
                                <h3 className="text-lg font-semibold">미국</h3>
                                <h3 className="text-sm font-semibold text-gray-500">
                                    USD
                                </h3>
                            </div>
                            <span className="text-lg pt-2">
                                <img
                                    alt="US"
                                    src="https://thumb.tossinvest.com/image/resized/16x0/https%3A%2F%2Fstatic.toss.im%2Ficons%2Fpng%2F4x%2Ficon-flag-us.png"
                                />
                            </span>
                        </div>
                        <div
                            id="exchangerate_input"
                            className="flex-1 flex flex-col justify-between"
                        >
                            <h4 className="text-xl font-bold">1</h4>
                            <h4 className="text-sm font-semibold text-gray-500">
                                1 달러
                            </h4>
                        </div>
                    </div>
                </li>
                <li className="flex-1 card-main gray-hover flex flex-row gap-1">
                    <div
                        id="text_index"
                        className="flex-1 flex flex-row justify-between px-4 py-1"
                    >
                        <div
                            id="stockindex_label"
                            className="flex-1 flex flex-row justify-start gap-1"
                        >
                            <div className="flex flex-col justify-between">
                                <h3 className="text-lg font-semibold">
                                    대한민국
                                </h3>
                                <h3 className="text-sm font-semibold text-gray-500">
                                    KRW
                                </h3>
                            </div>
                            <span className="text-lg pt-2">
                                <img
                                    alt="KR"
                                    src="https://thumb.tossinvest.com/image/resized/16x0/https%3A%2F%2Fstatic.toss.im%2Ficons%2Fpng%2F4x%2Ficon-flag-kr.png"
                                />
                            </span>
                        </div>
                        <div
                            id="exchangerate_input"
                            className="flex-1 flex flex-col justify-between"
                        >
                            <h4 className="text-xl font-bold">
                                {exchangeRates?.value}
                            </h4>
                            <h4 className="text-sm font-semibold text-gray-500">
                                {exchangeRates?.value} 원
                            </h4>
                        </div>
                    </div>
                </li>
            </ul>
        </>
    );
};

export default ExchangeRate;
