import { fetchIndexList } from "../../api/api";
import useFetchData from "../../hooks/useFetchData";

const StockIndex = () => {
    // 주가지수 데이터 api 호출
    const { data: stockIndex, loading, error } = useFetchData(fetchIndexList);

    // 로딩 및 에러 화면
    if (loading || error)
        return (
            <>
                <h1 className="section-title-main">주가지수</h1>
                <ul className="w-full h-full flex flex-row justify-between gap-3 overflow-x-scroll pb-2 px-1 mt-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <li
                            key={index}
                            className="w-full h-full flex-1 card-main bg-white/30 gray-hover"
                        >
                            <div className="w-full h-full p-4 flex flex-row gap-1 skeleton">
                                <div
                                    id="text_index"
                                    className="w-[115.79px] h-full flex-1 flex flex-col justify-between gap-2"
                                >
                                    <div
                                        id="stockindex_label"
                                        className="flex-1 flex flex-row justify-start gap-1 skeleton-text"
                                    >
                                        <h3 className="text-lg font-semibold"></h3>
                                        <span className="text-lg mt-1.5"></span>
                                    </div>
                                    <h4 className="flex-1 text-xl font-bold skeleton-text"></h4>
                                    <h4 className="flex-1 text-base font-semibold skeleton-text"></h4>
                                </div>
                                <div
                                    id="graph_index"
                                    className="w-[96px] min-w-24 rounded-lg skeleton-box"
                                ></div>
                            </div>
                        </li>
                    ))}
                </ul>
            </>
        );

    return (
        <>
            <h1 className="section-title-main">주가지수</h1>
            <ul className="w-full h-full flex flex-row justify-between gap-3 overflow-x-scroll pb-2 px-1 mt-3">
                {stockIndex && stockIndex?.map((stockIndex) => (
                    <li
                        key={stockIndex.id}
                        className="flex-1 card-main bg-white/30 gray-hover"
                    >
                        <a
                            href={`/indices/${stockIndex.index_name}`}
                            className="w-full h-full p-4 flex flex-row gap-1"
                        >
                            <div
                                id="text_index"
                                className="flex-1 flex flex-col justify-between"
                            >
                                <div
                                    id="stockindex_label"
                                    className="flex-1 flex flex-row justify-start gap-1"
                                >
                                    <h3 className="text-lg font-semibold">
                                        {stockIndex.label}
                                    </h3>
                                    <span className="text-lg mt-1.5">
                                        {stockIndex.index_name.startsWith(
                                            "KO"
                                        ) ? (
                                            <img
                                                alt="KR"
                                                src="https://thumb.tossinvest.com/image/resized/16x0/https%3A%2F%2Fstatic.toss.im%2Ficons%2Fpng%2F4x%2Ficon-flag-kr.png"
                                            />
                                        ) : (
                                            <img
                                                alt="US"
                                                src="https://thumb.tossinvest.com/image/resized/16x0/https%3A%2F%2Fstatic.toss.im%2Ficons%2Fpng%2F4x%2Ficon-flag-us.png"
                                            />
                                        )}
                                    </span>
                                </div>
                                <h4 className="flex-0.5 text-xl font-bold">
                                    {stockIndex.index}
                                </h4>
                                {/* 등락률에 따른 색상변화 */}
                                <h4
                                    className={`flex-0.5 text-base font-semibold ${
                                        stockIndex.change_sign === "+"
                                            ? "text-red-400"
                                            : "text-blue-400"
                                    } text-nowrap`}
                                >
                                    {/* 빨 : 상승, 파 : 하락 */}
                                    {stockIndex.change_sign === "+" ? "+" : ""}
                                    {`${stockIndex.change_value} (${stockIndex.change_rate}%)`}
                                </h4>
                            </div>
                            <div
                                id="graph_index"
                                className={`min-w-24 rounded-lg ${
                                    stockIndex.change_sign === "+"
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
