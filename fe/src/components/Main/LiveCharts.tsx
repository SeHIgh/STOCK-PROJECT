import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { indexOf } from "lodash";
import { Link } from "react-router-dom";
import {
    fetchLiveChartTopDecr10,
    fetchLiveChartTopIncr10,
    fetchLiveChartTopVol10,
} from "../../api/api";
import useFetchData from "../../hooks/useFetchData";
import { LiveChartProps } from "../../types";
import { formatCurrency, formatTradeAmount } from "../../utils/format";

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
                        <StockTable stocks={liveChartVol} />
                    </TabPanel>
                    <TabPanel>
                        <StockTable stocks={liveChartIncr} />
                    </TabPanel>
                    <TabPanel>
                        <StockTable stocks={liveChartDecr} />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
};

const StockTable = ({ stocks }: { stocks: LiveChartProps[] | null }) => {
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
                    {stocks?.map((stock: LiveChartProps) => (
                        <tr key={stock.data_rank}>
                            {/* 등수 */}
                            <td className="whitespace-nowrap text-base font-medium text-indigo-300 text-center rounded-es-lg">
                                {indexOf(stocks, stock) + 1}
                            </td>
                            {/* 종목 명 */}
                            <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                                {/* 종목 명으로 파라미터 전달 및 세부 페이지 이동*/}
                                {/* 종목 명 및 종목 코드 사용을 위해 state로 데이터 전달 */}
                                <Link
                                    to={`/stocks/${stock.hts_kor_isnm}`}
                                    state={{
                                        productCode: stock.stck_shrn_iscd,
                                    }}
                                    className="w-full h-full flex flex-row items-center justify-start"
                                >
                                    {/* 종목 코드를 이용한 토스증권 회사 이미지 이용 */}
                                    <img
                                        src={`https://static.toss.im/png-icons/securities/icn-sec-fill-${stock.stck_shrn_iscd}.png`}
                                        alt={stock.hts_kor_isnm}
                                        className="w-6 h-6 mr-2 rounded-full"
                                    ></img>
                                    <span>{stock.hts_kor_isnm}</span>
                                </Link>
                            </td>
                            {/* 현재가 */}
                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 text-right">
                                {formatCurrency(stock.stck_prpr)}원
                            </td>
                            {/* 등락률 */}
                            <td
                                className={`px-6 py-4 whitespace-nowrap text-base text-right ${
                                    stock.prdy_vrss_sign === "+"
                                        ? "text-red-400"
                                        : "text-blue-400"
                                }`}
                            >
                                {stock.prdy_vrss_sign === "+" ? "+" : "-"}
                                {formatCurrency(stock.prdy_vrss)}
                                원({stock.prdy_ctrt}%)
                            </td>
                            {/* 거래대금 */}
                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 text-right">
                                {formatTradeAmount(stock.acml_tr_pbmn)}
                            </td>
                            {/* 거래량 */}
                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 text-right rounded-se-lg">
                                {formatCurrency(stock.acml_vol)}주
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LiveCharts;
