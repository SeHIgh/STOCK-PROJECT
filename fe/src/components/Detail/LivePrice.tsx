import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useCallback } from "react";
import useFetchData from "../../hooks/useFetchData";
import { fetchStockDailyPrice, fetchStockLivePrice } from "../../api/api";
import { DailyPriceProps, LivePriceProps } from "../../types";
import { formatCurrency, formatTradeAmount } from "../../utils/format";

const LivePrice: React.FC<{ stockName: string }> = ({ stockName }) => {
    const fetchStockLivePriceCallback = useCallback(
        () => fetchStockLivePrice(stockName || ""),
        [stockName]
    );

    const fetchStockDailyPriceCallback = useCallback(
        () => fetchStockDailyPrice(stockName || ""),
        [stockName]
    );

    const {
        data: stockLive,
        loading: stockLiveLoading,
        error: stockLiveError,
    } = useFetchData(fetchStockLivePriceCallback);

    const {
        data: stockDaily,
        loading: stockDailyLoading,
        error: stockDailyError,
    } = useFetchData(fetchStockDailyPriceCallback);

    if (stockLiveLoading || stockLiveError) return <div>로딩 중...</div>;

    if (stockDailyLoading || stockDailyError) return <div>로딩 중...</div>;

    return (
        <div className="w-full h-full px-2 sm:px-0 mx-auto overflow-hidden flex flex-col">
            <h1 className="text-base font-semibold">실시간 · 일별 시세</h1>
            <TabGroup className="h-full overflow-hidden flex flex-col">
                <TabList className="text-sm flex space-x-1 p-0">
                    {["실시간", "일별"].map((category) => (
                        <Tab
                            key={category}
                            className={({ selected }) =>
                                `w-full py-0.5 text-sm font-medium border-b-2 border-neutral-300 text-neutral-400 ${
                                    selected
                                        ? "border-neutral-400 text-neutral-500"
                                        : "hover:text-neutral-400 hover:border-neutral-400/70"
                                }`
                            }
                        >
                            {category}
                        </Tab>
                    ))}
                </TabList>
                <TabPanels className="h-full mt-0 overflow-hidden">
                    <TabPanel className="h-full overflow-hidden">
                        <LivePriceTable stocks={stockLive} />
                    </TabPanel>
                    <TabPanel className="h-full overflow-hidden">
                        <DailyPriceTable stocks={stockDaily} />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
};

const LivePriceTable = ({ stocks }: { stocks: LivePriceProps[] | null }) => {
    return (
        <div className="h-full overflow-hidden rounded-lg flex flex-col">
            <table className="min-w-full h-full divide-y divide-gray-300 table-fixed w-full stockdetail-price-table flex flex-col">
                <thead>
                    <tr>
                        <th className="liveprice-th">체결가</th>
                        <th className="liveprice-th">체결량(주)</th>
                        <th className="liveprice-th">등락률</th>
                        <th className="liveprice-th">거래량</th>
                        <th className="liveprice-th">시간</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-transparent h-full overflow-y-scroll">
                    {stocks?.map((stock: LivePriceProps, index) => (
                        <tr key={index}>
                            {/* 체결가 */}
                            <td className="px-1 py-0.5 whitespace-nowrap text-xs text-gray-700 text-right">
                                {formatCurrency(stock.stck_prpr)}원
                            </td>
                            {/* 체결량(주) */}
                            <td
                                className={`px-1 py-0.5 whitespace-nowrap text-xs text-right rounded-r-lg ${
                                    parseFloat(stock.prdy_ctrt) > 0
                                        ? "text-red-400"
                                        : parseFloat(stock.prdy_ctrt) < 0
                                        ? "text-blue-400"
                                        : "text-gray-500"
                                }`}
                            >
                                {formatCurrency(stock.stck_qnty)}
                            </td>
                            {/* 등락률 */}
                            <td
                                className={`px-1 py-0.5 whitespace-nowrap text-xs text-right ${
                                    parseFloat(stock.prdy_ctrt) > 0
                                        ? "text-red-400"
                                        : parseFloat(stock.prdy_ctrt) < 0
                                        ? "text-blue-400"
                                        : "text-gray-500"
                                }`}
                            >
                                {parseFloat(stock.prdy_ctrt) > 0 ? "+" : ""}
                                {stock.prdy_ctrt}%
                            </td>
                            {/* 거래량(주) */}
                            <td className="px-1 py-0.5 whitespace-nowrap text-xs text-gray-700 text-right rounded-r-lg">
                                {formatCurrency(stock.acml_vol)}
                            </td>
                            {/* 시간 */}
                            <td className="px-1 py-0.5 whitespace-nowrap text-xs text-gray-700 text-right rounded-r-lg">
                                {(() => {
                                    // 현재 날짜 가져오기 (YYYY-MM-DD)
                                    const today = new Date()
                                        .toISOString()
                                        .split("T")[0];

                                    // string 형태의 일자를 가져오므로 Date 객체로 변환 필요
                                    // stock.tr_time을 현재 날짜와 합쳐서 Date 객체 생성
                                    const dateTimeString = `${today} ${stock.tr_time}`;
                                    const formattedTime = new Date(
                                        dateTimeString
                                    ).toLocaleTimeString("ko-KR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: false, // 24시간 형식 사용
                                    });

                                    return formattedTime;
                                })()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const DailyPriceTable = ({ stocks }: { stocks: DailyPriceProps[] | null }) => {
    return (
        <div className="h-full overflow-hidden rounded-lg flex flex-col">
            <table className="min-w-full h-full divide-y divide-gray-300 table-fixed w-full stockdetail-price-table flex flex-col">
                <thead>
                    <tr>
                        <th className="dailyprice-th">일자</th>
                        <th className="dailyprice-th">종가</th>
                        <th className="dailyprice-th">등락률</th>
                        <th className="dailyprice-th">거래량(주)</th>
                        <th className="dailyprice-th">거래대금</th>
                        <th className="dailyprice-th">시가</th>
                        <th className="dailyprice-th">고가</th>
                        <th className="dailyprice-th">저가</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-transparent h-full overflow-y-scroll">
                    {stocks?.map((stock: DailyPriceProps, index) => (
                        <tr key={index}>
                            {/* 일자 */}
                            <td className="px-1 py-0.5 whitespace-nowrap text-xs text-gray-700 text-left">
                                {(() => {
                                    const rawDate = stock.stck_bsop_date; // "20250217"
                                    const formattedDate = `${rawDate.slice(
                                        4,
                                        6
                                    )}.${rawDate.slice(6, 8)}`; // "02.17"
                                    return formattedDate;
                                })()}
                            </td>
                            {/* 종가 */}
                            <td className="px-1 py-0.5 whitespace-nowrap text-xs text-gray-700 text-right">
                                {formatTradeAmount(stock.stck_clpr)}
                            </td>
                            {/* 등락률 */}
                            <td
                                className={`px-1 py-0.5 whitespace-nowrap text-xs text-right ${
                                    parseFloat(stock.prdy_ctrt) > 0
                                        ? "text-red-400"
                                        : parseFloat(stock.prdy_ctrt) < 0
                                        ? "text-blue-400"
                                        : "text-gray-500"
                                }`}
                            >
                                {parseFloat(stock.prdy_ctrt) > 0 ? "+" : ""}
                                {stock.prdy_ctrt}%
                            </td>
                            {/* 거래량 */}
                            <td className="px-1 py-0.5 whitespace-nowrap text-xs text-gray-700 text-right">
                                {formatCurrency(stock.acml_vol)}
                            </td>
                            {/* 거래대금 */}
                            <td className="px-1 py-0.5 whitespace-nowrap text-xs text-gray-700 text-right">
                                {formatTradeAmount(stock.acml_tr_pbmn)}
                            </td>
                            {/* 시가 */}
                            <td className="px-1 py-0.5 whitespace-nowrap text-xs text-gray-700 text-right">
                                {formatTradeAmount(stock.stck_oprc)}
                            </td>
                            {/* 고가 */}
                            <td className="px-1 py-0.5 whitespace-nowrap text-xs text-gray-700 text-right">
                                {formatTradeAmount(stock.stck_hgpr)}
                            </td>
                            {/* 저가 */}
                            <td className="px-1 py-0.5 whitespace-nowrap text-xs text-gray-700 text-right">
                                {formatTradeAmount(stock.stck_lwpr)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LivePrice;
