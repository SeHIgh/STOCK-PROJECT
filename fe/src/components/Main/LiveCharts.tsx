import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

// 주가 급등 (토스증권 실시간 차트 급상승)
const stockListTopIncr10 = [
    {
        id: 1,
        symbol: "어보브반도체",
        current_price: "12,930원",
        change_rate: "+2,980원 (29.9%)",
        daily_trading_value: "1,674억원",
        daily_trading_volume: "14,146,934주",
    },
    {
        id: 2,
        symbol: "CSA 코스믹",
        current_price: "1,089원",
        change_rate: "+251원 (29.9%)",
        daily_trading_value: "101억원",
        daily_trading_volume: "9,593,700주",
    },
    {
        id: 3,
        symbol: "아모센스",
        current_price: "6,690원",
        change_rate: "+1,540원 (29.9%)",
        daily_trading_value: "7.9억원",
        daily_trading_volume: "118,000주",
    },
    {
        id: 4,
        symbol: "전진건설로봇",
        current_price: "54,600원",
        change_rate: "+12,550원 (29.8%)",
        daily_trading_value: "3,193억원",
        daily_trading_volume: "6,506,086주",
    },
    {
        id: 5,
        symbol: "피아이이",
        current_price: "5,880원",
        change_rate: "+1,350원 (29.8%)",
        daily_trading_value: "1,178억원",
        daily_trading_volume: "21,755,624주",
    },
    {
        id: 6,
        symbol: "씨메스",
        current_price: "40,000원",
        change_rate: "+8,700원 (27.7%)",
        daily_trading_value: "1,396억원",
        daily_trading_volume: "3,960,966주",
    },
    {
        id: 7,
        symbol: "대동기어",
        current_price: "19,490원",
        change_rate: "+4,080원 (26.4%)",
        daily_trading_value: "2,401억원",
        daily_trading_volume: "13,347,670주",
    },
    {
        id: 8,
        symbol: "독시미티",
        current_price: "105,059원",
        change_rate: "+20,752원 (24.6%)",
        daily_trading_value: "2,443만원",
        daily_trading_volume: "232주",
    },
    {
        id: 9,
        symbol: "인스코비",
        current_price: "2,050원",
        change_rate: "+403원 (24.4%)",
        daily_trading_value: "286억원",
        daily_trading_volume: "14,534,006주",
    },
    {
        id: 10,
        symbol: "심텍",
        current_price: "14,410원",
        change_rate: "+2,790원 (24.0%)",
        daily_trading_value: "570억원",
        daily_trading_volume: "4,163,223주",
    },
];
// 주가 급락 (토스증권 실시간 차트 급하락)
const stockListTopDecr10 = [
    {
        id: 1,
        symbol: "셉터나",
        current_price: "11,591원",
        change_rate: "-8,971원 (43.6%)",
        daily_trading_value: "1,159,127원",
        daily_trading_volume: "100주",
    },
    {
        id: 2,
        symbol: "퍼스트 캐피탈",
        current_price: "28,942원",
        change_rate: "-19,521원 (40.2%)",
        daily_trading_value: "2,894,200원",
        daily_trading_volume: "100주",
    },
    {
        id: 3,
        symbol: "빌 홀딩스",
        current_price: "99,647원",
        change_rate: "-39,780원 (28.5%)",
        daily_trading_value: "5.1억원",
        daily_trading_volume: "5,173주",
    },
    {
        id: 4,
        symbol: "쿼드 그래픽스",
        current_price: "7,264원",
        change_rate: "-2,807원 (27.8%)",
        daily_trading_value: "7,235원",
        daily_trading_volume: "1주",
    },
    {
        id: 5,
        symbol: "엘프 뷰티",
        current_price: "93,699원",
        change_rate: "-34,354원 (26.8%)",
        daily_trading_value: "27억원",
        daily_trading_volume: "29,171주",
    },
    {
        id: 6,
        symbol: "상고마 테크놀로지스",
        current_price: "7,249원",
        change_rate: "-2,300원 (24.0%)",
        daily_trading_value: "7,235원",
        daily_trading_volume: "1주",
    },
    {
        id: 7,
        symbol: "사나라 메드테크",
        current_price: "39,071원",
        change_rate: "-12,155원 (23.7%)",
        daily_trading_value: "3,907,170원",
        daily_trading_volume: "100주",
    },
    {
        id: 8,
        symbol: "알파 테크놀로지 그룹",
        current_price: "18,826원",
        change_rate: "-5,708원 (23.2%)",
        daily_trading_value: "1,900,042원",
        daily_trading_volume: "101주",
    },
    {
        id: 9,
        symbol: "오니티 그룹",
        current_price: "45,019원",
        change_rate: "-11,952원 (20.9%)",
        daily_trading_value: "4,590,201원",
        daily_trading_volume: "102주",
    },
    {
        id: 10,
        symbol: "CVRX",
        current_price: "17,379원",
        change_rate: "-3,907원 (18.3%)",
        daily_trading_value: "17,365원",
        daily_trading_volume: "1주",
    },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const LiveCharts = () => {
    return (
        <div className="w-full px-2 sm:px-0 mx-auto">
            <h1 className="section-title-main">실시간 차트</h1>
            <TabGroup>
                <TabList className="flex space-x-1 p-1">
                    {["급상승", "급하락"].map((category) => (
                        <Tab
                            key={category}
                            className={({ selected }) =>
                                classNames(
                                    "w-full py-2.5 text-sm font-medium leading-5 border-b-2 border-gray-300 text-gray-500",
                                    selected
                                        ? "border-b-2 border-gray-500 text-gray-500"
                                        : "hover:text-gray-300 hover:border-gray-300"
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
                </TabPanels>
            </TabGroup>
        </div>
    );
};

const StockTable = ({ stocks }) => {
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
                    {stocks.map((stock) => (
                        <tr key={stock.id}>
                            <td className="whitespace-nowrap text-base font-medium text-gray-900 text-center rounded-l-lg">
                                {stock.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                                {stock.symbol}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 text-right">
                                {stock.current_price}
                            </td>
                            <td
                                className={`px-6 py-4 whitespace-nowrap text-base text-gray-700 text-right ${
                                    stock.change_rate.startsWith("+")
                                        ? "text-red-400"
                                        : "text-blue-400"
                                }`}
                            >
                                {stock.change_rate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 text-right">
                                {stock.daily_trading_value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 text-right rounded-r-lg">
                                {stock.daily_trading_volume}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LiveCharts;
