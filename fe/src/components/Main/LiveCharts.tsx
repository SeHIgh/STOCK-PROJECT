import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { indexOf } from "lodash";
import { Link } from "react-router-dom";
import {
    fetchLiveChartTopDecr10,
    fetchLiveChartTopIncr10,
    fetchLiveChartTopVol10,
} from "../../api/api";
import useFetchData from "../../hooks/useFetchData";
import { StockProps } from "../../types";

// // 250213 최신화 (토스증권 실시간 차트 json 반영)
// interface StockPrice {
//     priceType: "MARKET" | string;
//     base: number;
//     close: number;
//     baseKrw?: number | null;
//     closeKrw?: number | null;
//     marketVolume: number;
//     marketAmount: number;
// }

// interface StockProps {
//     productCode: string;
//     name: string;
//     logoImageUrl: string;
//     price: StockPrice;
// }

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const LiveCharts = () => {
    // 실시간 차트 데이터 api 호출
    const {
        data: liveChartVol,
        loading: loading1,
        error: error1,
    } = useFetchData(fetchLiveChartTopVol10);
    const {
        data: liveChartIncr,
        loading: loading2,
        error: error2,
    } = useFetchData(fetchLiveChartTopIncr10);
    const {
        data: liveChartDecr,
        loading: loading3,
        error: error3,
    } = useFetchData(fetchLiveChartTopDecr10);

    if (loading1 || error1 || loading2 || error2 || loading3 || error3)
        return (
            <div className="w-full px-2 sm:px-0 mx-auto">
                <h1 className="section-title-main">실시간 차트</h1>
                <TabGroup>
                    <TabList className="flex space-x-1 p-1">
                        {["거래량", "급상승", "급하락"].map((category) => (
                            <Tab
                                key={category}
                                className={({ selected }) =>
                                    classNames(
                                        "w-full py-2.5 text-sm font-medium leading-5 border-b-2 border-neutral-300 text-neutral-400",
                                        selected
                                            ? "border-b-2 border-neutral-400 text-neutral-500"
                                            : "hover:text-neutral-400 hover:border-neutral-400/70"
                                    )
                                }
                            >
                                {category}
                            </Tab>
                        ))}
                    </TabList>
                    <TabPanels className="mt-2">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <TabPanel key={index}>
                                <div className="overflow-hidden rounded-lg">
                                    <table className="min-w-full divide-y divide-transparent table-fixed w-full">
                                        <thead>
                                            <tr>
                                                <th className="w-4 pl-6 pr-3 py-3 text-center text-base font-medium text-gray-500 uppercase tracking-wider"></th>
                                                <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                                                    종목
                                                </th>
                                                <th className="w-1/5 px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider">
                                                    현재가
                                                </th>
                                                <th className="w-1/5 px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider">
                                                    등락률
                                                </th>
                                                <th className="w-1/5 px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider">
                                                    거래대금
                                                </th>
                                                <th className="w-1/5 px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider">
                                                    거래량
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-transparent">
                                            {Array.from({ length: 10 }).map(
                                                (_, index) => (
                                                    <tr
                                                        key={index}
                                                        className=""
                                                    >
                                                        {/* 등수 */}
                                                        <td className="whitespace-nowrap text-base font-medium text-indigo-300 text-center rounded-es-lg">
                                                            {index + 1}
                                                        </td>
                                                        {/* 종목 명 */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                                                            <span className="skeleton-text skeleton">
                                                                HD현대인프라코어
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 text-right">
                                                            <span className="skeleton-text skeleton">
                                                                61,000원
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-base text-right">
                                                            <span className="skeleton-text skeleton">
                                                                +1,800원(30%)
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 text-right">
                                                            <span className="skeleton-text skeleton">
                                                                9,737만원
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 text-right rounded-se-lg">
                                                            <span className="skeleton-text skeleton">
                                                                10,000주
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </TabPanel>
                        ))}
                    </TabPanels>
                </TabGroup>
            </div>
        );

    return (
        <div className="w-full px-2 sm:px-0 mx-auto">
            <h1 className="section-title-main">실시간 차트</h1>
            <TabGroup>
                <TabList className="flex space-x-1 p-1">
                    {["거래량", "급상승", "급하락"].map((category) => (
                        <Tab
                            key={category}
                            className={({ selected }) =>
                                classNames(
                                    "w-full py-2.5 text-sm font-medium leading-5 border-b-2 border-neutral-300 text-neutral-400",
                                    selected
                                        ? "border-b-2 border-neutral-400 text-neutral-500"
                                        : "hover:text-neutral-400 hover:border-neutral-400/70"
                                )
                            }
                        >
                            {category}
                        </Tab>
                    ))}
                </TabList>
                <TabPanels className="mt-2">
                    <TabPanel>
                        <StockTable stocks={stockListTopIncr10} />
                    </TabPanel>
                    <TabPanel>
                        <StockTable stocks={stockListTopDecr10} />
                    </TabPanel>
                    <TabPanel>
                        <StockTable stocks={stockListTopDecr10} />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
};

const StockTable = ({ stocks }: { stocks: StockProps[] }) => {
    return (
        <div className="overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-transparent table-fixed w-full">
                <thead>
                    <tr>
                        <th className="w-4 pl-6 pr-3 py-3 text-center text-base font-medium text-gray-500 uppercase tracking-wider"></th>
                        <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                            종목
                        </th>
                        <th className="w-1/5 px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider">
                            현재가
                        </th>
                        <th className="w-1/5 px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider">
                            등락률
                        </th>
                        <th className="w-1/5 px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider">
                            거래대금
                        </th>
                        <th className="w-1/5 px-6 py-3 text-right text-base font-medium text-gray-500 uppercase tracking-wider">
                            거래량
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-transparent">
                    {stocks.map((stock: StockProps) => (
                        <tr key={stock.productCode}>
                            {/* 등수 */}
                            <td className="whitespace-nowrap text-base font-medium text-indigo-300 text-center rounded-es-lg">
                                {indexOf(stocks, stock) + 1}
                            </td>
                            {/* 종목 명 */}
                            <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                                <Link
                                    to={`/stocks/${stock.productCode}`}
                                    className="w-full h-full flex flex-row items-center justify-start"
                                >
                                    <img
                                        src={stock.logoImageUrl}
                                        alt={stock.name}
                                        className="w-6 h-6 mr-2 rounded-full"
                                    ></img>
                                    <span>{stock.name}</span>
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 text-right">
                                {stock.price.base.toLocaleString()}원
                            </td>
                            <td
                                className={`px-6 py-4 whitespace-nowrap text-base text-right ${
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
                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 text-right">
                                {(stock.price.marketAmount / 100000000)
                                    .toFixed(1)
                                    .toLocaleString()}
                                억원
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 text-right rounded-se-lg">
                                {stock.price.marketVolume.toLocaleString()}주
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LiveCharts;
