import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

// 실시간 시세 및 일별 시세 테이블 헤더
// const liveHeader = [
//     { title: "체결가", key: "price.base" },
//     { title: "체결량 (주)", key: "price.marketVolume" },
//     { title: "등락률", key: "price.close" },
//     { title: "거래량", key: "price.marketAmount" },
//     { title: "시간", key: "priceType" },
// ];

// const dailyHeader = [
//     { title: "일자", key: "date" },
//     { title: "종가", key: "price.close" },
//     { title: "등락률", key: "price.base" },
//     { title: "거래량 (주)", key: "price.marketVolume" },
//     { title: "거래대금", key: "price.marketAmount" },
//     { title: "시가", key: "price.open" },
//     { title: "고가", key: "price.high" },
//     { title: "저가", key: "price.low" },
// ];

interface StockPrice {
    priceType: "MARKET" | string;
    base: number;
    close: number;
    marketVolume: number;
    marketAmount: number;
    open?: number;
    high?: number;
    low?: number;
}

interface StockProps {
    productCode: string;
    name: string;
    logoImageUrl: string;
    price: StockPrice[];
    date?: string;
}

const LivePrice: React.FC<Pick<StockProps, "productCode">> = ({
    productCode,
}) => {
    const [stockLive, setStockLive] = useState<StockProps[]>([]);
    const [stockDaily, setStockDaily] = useState<StockProps[]>([]);

    const getData = useCallback(async () => {
        try {
            const liveResponse = await axios.get<StockProps[]>(
                `http://localhost:3000/livePrices?productCode=${productCode}`
            );
            setStockLive(liveResponse.data);
            const dailyResponse = await axios.get<StockProps[]>(
                `http://localhost:3000/dailyPrices?productCode=${productCode}`
            );
            setStockDaily(dailyResponse.data);
        } catch (error) {
            console.error("실시간 · 일별 시세 | 데이터 요청 실패:", error);
        }
    }, [productCode]);

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <div className="w-full px-2 sm:px-0 mx-auto">
            <h1 className="text-lg font-semibold">실시간 · 일별 시세</h1>
            <TabGroup>
                <TabList className="flex space-x-1 p-1">
                    {["실시간", "일별"].map((category) => (
                        <Tab
                            key={category}
                            className={({ selected }) =>
                                `w-full py-2.5 text-sm font-medium border-b-2 ${
                                    selected
                                        ? "border-gray-500 text-gray-700"
                                        : "border-gray-300 text-gray-500"
                                }`
                            }
                        >
                            {category}
                        </Tab>
                    ))}
                </TabList>
                <TabPanels className="mt-2">
                    <TabPanel>
                        <LivePriceTable stocks={stockLive} />
                    </TabPanel>
                    <TabPanel>
                        <DailyPriceTable stocks={stockDaily} />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
};

const LivePriceTable = ({ stocks }: { stocks: StockProps[] }) => {
    return (
        <div className="overflow-scroll rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 table-fixed w-full">
                <thead>
                    <tr>
                        <th className="w-1/5 px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            체결가
                        </th>
                        <th className="w-1/5 px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                            체결량 (주)
                        </th>
                        <th className="w-1/5 px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                            등락률
                        </th>
                        <th className="w-1/5 px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                            거래량
                        </th>
                        <th className="w-1/5 px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                            시간
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-transparent">
                    {stocks.map((stock: StockProps) => (
                        <tr key={stock.productCode}>
                            {/* 체결가 */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                {stock.price.체결가.toLocaleString()}원
                            </td>
                            {/* 체결량 (주) */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right rounded-r-lg">
                                {stock.price.체결량.toLocaleString()}
                            </td>
                            {/* 등락률 */}
                            <td
                                className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                                    stock.price.base - stock.price.close > 0
                                        ? "text-red-400"
                                        : "text-blue-400"
                                }`}
                            >
                                {stock.price.base - stock.price.close > 0
                                    ? "+"
                                    : ""}
                                {(
                                    stock.price.base - stock.price.close
                                ).toLocaleString()}
                                원(
                                {Math.abs(
                                    ((stock.price.base - stock.price.close) /
                                        stock.price.base) *
                                        100
                                ).toFixed(2)}
                                %)
                            </td>
                            {/* 거래량 */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right rounded-r-lg">
                                {stock.price.거래량.toLocaleString()}주
                            </td>
                            {/* 시간 */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right rounded-r-lg">
                                {new Date(stock.price.시간).toLocaleTimeString(
                                    "ko-KR",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: false, // 24시간 형식 사용
                                    }
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const DailyPriceTable = ({ stocks }: { stocks: StockProps[] }) => {
    return (
        <div className="overflow-scroll rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 table-fixed w-full">
                <thead>
                    <tr>
                        <th className="w-1/8 px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            일자
                        </th>
                        <th className="w-1/8 px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                            종가
                        </th>
                        <th className="w-1/8 px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                            등락률
                        </th>
                        <th className="w-1/8 px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                            거래량 (주)
                        </th>
                        <th className="w-1/8 px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                            거래대금
                        </th>
                        <th className="w-1/8 px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                            시가
                        </th>
                        <th className="w-1/8 px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                            고가
                        </th>
                        <th className="w-1/8 px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                            저가
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-transparent">
                    {stocks.map((stock: StockProps) => (
                        <tr key={stock.productCode}>
                            {/* 일자 */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-left">
                                {new Date(stock.price.시간).toLocaleDateString(
                                    "ko-KR"
                                )}
                            </td>
                            {/* 종가 */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                {stock.price.종가.toLocaleString()}원
                            </td>
                            {/* 등락률 */}
                            <td
                                className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                                    stock.price.종가 - stock.price.시가 > 0
                                        ? "text-red-400"
                                        : "text-blue-400"
                                }`}
                            >
                                {stock.price.종가 - stock.price.시가 > 0
                                    ? "+"
                                    : ""}
                                {(
                                    stock.price.종가 - stock.price.시가
                                ).toLocaleString()}
                                원 (
                                {Math.abs(
                                    ((stock.price.종가 - stock.price.시가) /
                                        stock.price.시가) *
                                        100
                                ).toFixed(2)}
                                %)
                            </td>
                            {/* 거래량 */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                {stock.price.거래량.toLocaleString()}주
                            </td>
                            {/* 거래대금 */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                {(stock.price.거래대금 / 100000000)
                                    .toFixed(1)
                                    .toLocaleString()}
                                억원
                            </td>
                            {/* 시가 */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                {stock.price.시가.toLocaleString()}원
                            </td>
                            {/* 고가 */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                {stock.price.고가.toLocaleString()}원
                            </td>
                            {/* 저가 */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                {stock.price.저가.toLocaleString()}원
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LivePrice;
