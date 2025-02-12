// 네이버 환율 검색 API
// https://m.search.naver.com/p/csearch/content/qapirender.nhn?key=calculator&pkid=141&q=%ED%99%98%EC%9C%A8&where=m&u1=keb&u6=standardUnit&u7=0&u3=USD&u4=KRW&u8=down&u2=1
// u7=0 속성이 실시간으로 추정
const exchangeRates = {
    pkid: 141,
    count: 1,
    country: [
        {
            value: "1",
            subValue: "1 달러",
            currencyUnit: "달러",
        },
        {
            value: "1,447.80",
            subValue: "1,447.80 원",
            currencyUnit: "원",
        },
    ],
    calculatorMessage: "",
};
const ExchangeRate = () => {
    return (
        <>
            <h1 className="section-title-main">
                실시간 환율 
            </h1>
            {/* <ArrowsRightLeftIcon className="w-6 h-auto rotate-90 drop-shadow-xl fill-gray-500" /> */}
            <ul className="relative w-full flex flex-col justify-between gap-2 overflow-x-scroll pb-2 px-1">
                {exchangeRates.country.map((exchRate) => (
                    <li className="flex-1 card-main bg-white/30 gray-hover flex flex-row gap-1">
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
                                        {exchRate.currencyUnit === "달러"
                                            ? "미국"
                                            : exchRate.currencyUnit === "원"
                                            ? "대한민국"
                                            : ""}
                                    </h3>
                                    <h3 className="text-sm font-semibold text-gray-500">
                                        {exchRate.currencyUnit === "달러"
                                            ? "USD"
                                            : exchRate.currencyUnit === "원"
                                            ? "KRW"
                                            : ""}
                                    </h3>
                                </div>
                                <span className="text-lg">
                                    {exchRate.currencyUnit === "달러"
                                        ? "🇺🇸"
                                        : exchRate.currencyUnit === "원"
                                        ? "🇰🇷"
                                        : "🏳️"}
                                </span>
                            </div>
                            <div
                                id="exchangerate_input"
                                className="flex-1 flex flex-col justify-between"
                            >
                                <h4 className="text-xl font-bold">
                                    {exchRate.value}
                                </h4>
                                <h4 className="text-sm font-semibold text-gray-500">
                                    {exchRate.subValue}
                                </h4>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default ExchangeRate;
