const stockIndexList = [
    {
        id: 1,
        label: "코스피",
        index_name: "KOSPI",
        country: "South Korea",
        curPrice: 2531.99,
        changeRate: -4.76,
    },
    {
        id: 2,
        label: "코스닥",
        index_name: "KOSDAQ",
        country: "South Korea",
        curPrice: 741.17,
        changeRate: -0.85,
    },
    {
        id: 3,
        label: "나스닥",
        index_name: "NASDAQ",
        country: "USA",
        curPrice: 19791.99,
        changeRate: +99.66,
    },
    {
        id: 4,
        label: "S&P 500",
        index_name: "SPX",
        country: "USA",
        curPrice: 6083.57,
        changeRate: +22.09,
    },
];

const StockIndex = () => {
    return (
        <>
            <h1 className="section-title-main">주가지수</h1>
            <ul className="w-full flex flex-row justify-between gap-3 overflow-x-scroll pb-2 px-1">
                {stockIndexList.map((stockIndex, index) => (
                    <li
                        key={index}
                        className="flex-1 card-main bg-white/30 gray-hover"
                    >
                        <a
                            href={`/indices/${stockIndex.index_name}`}
                            className="w-full h-full p-4 flex flex-row gap-1"
                        >
                            <div
                                id="text_index"
                                className="flex-1 flex-col justify-between"
                            >
                                <div
                                    id="stockindex_label"
                                    className="flex-1 flex flex-row justify-start gap-1"
                                >
                                    <h3 className="text-lg font-semibold">
                                        {stockIndex.label}
                                    </h3>
                                    <span className="text-lg">
                                        {stockIndex.country === "USA"
                                            ? "🇺🇸"
                                            : stockIndex.country ===
                                              "South Korea"
                                            ? "🇰🇷"
                                            : "🏳️"}
                                    </span>
                                </div>
                                <h4 className="text-xl font-bold">
                                    {stockIndex.curPrice}
                                </h4>
                                {/* 등락률에 따른 색상변화 */}
                                <h4
                                    className={`text-base font-semibold ${
                                        stockIndex.changeRate >= 0
                                            ? "text-red-400"
                                            : "text-blue-400"
                                    } text-nowrap`}
                                >
                                    {/* 현재가 및 등락률 을 이용한 퍼센트 계산 - 빨 : 상승, 파 : 하락 */}
                                    {`${
                                        stockIndex.changeRate >= 0
                                            ? `+${stockIndex.changeRate}`
                                            : stockIndex.changeRate
                                    } (${Math.abs(
                                        (stockIndex.changeRate /
                                            (stockIndex.curPrice -
                                                stockIndex.changeRate)) *
                                            100
                                    ).toFixed(2)}%)`}
                                </h4>
                            </div>
                            <div
                                id="graph_index"
                                className={`min-w-24 rounded-lg ${
                                    stockIndex.changeRate >= 0
                                        ? "bg-red-400/50"
                                        : "bg-blue-400/50"
                                }`}
                            ></div>
                        </a>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default StockIndex;
