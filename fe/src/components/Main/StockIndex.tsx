import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface StockIndexProps {
    id: string;
    label: string;
    index_name: string;
    index: string;
    change_rate: string;
    change_sign: string;
}

const StockIndex = () => {
    const [stockIndex, setStockIndex] = useState<StockIndexProps[]>([]);

    const getData = useCallback(async () => {
        try {
            const response = await axios.get<StockIndexProps[]>(
                "http://localhost:3000/stockindex"
            );
            setStockIndex(response.data);
        } catch (error) {
            console.error("데이터 요청 실패:", error);
        }
    }, []);

    const calculateChange = (
        index: string,
        change_rate: string,
        change_sign: string
    ) => {
        const indexValue = parseFloat(index.replace(/,/g, "")); // 지수에서 콤마 제거 후 숫자로 변환
        const changeRateValue = parseFloat(change_rate); // 변화율을 숫자로 변환
        let changeAmount = indexValue * (changeRateValue / 100); // 변동값 계산

        // 등락 방향 반영
        if (change_sign === "-") {
            changeAmount *= -1; // 감소이면 음수로 변환
        }

        return changeAmount.toFixed(2); // 소수 둘째 자리까지 반환
    };

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <>
            <h1 className="section-title-main">주가지수</h1>
            <ul className="w-full flex flex-row justify-between gap-3 overflow-x-scroll pb-2 px-1">
                {stockIndex.map((stockIndex) => (
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
                                className="flex-1 flex-col justify-between"
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
                                <h4 className="text-xl font-bold">
                                    {stockIndex.index}
                                </h4>
                                {/* 등락률에 따른 색상변화 */}
                                <h4
                                    className={`text-base font-semibold ${
                                        stockIndex.change_sign === "+"
                                            ? "text-red-400"
                                            : "text-blue-400"
                                    } text-nowrap`}
                                >
                                    {/* 빨 : 상승, 파 : 하락 */}
                                    {stockIndex.change_sign === "+" ? "+" : ""}
                                    {`${calculateChange(
                                        stockIndex.index,
                                        stockIndex.change_rate,
                                        stockIndex.change_sign
                                    )} (${stockIndex.change_rate}%)`}
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
