import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

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
    price: StockPrice;
    date?: string;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const StockChart: React.FC<{ stockName: string }> = ({ stockName }) => {
    return (
        <>
            <div className="relative w-full h-full flex flex-col justify-between">
                <h2 className="text-base font-semibold">차트</h2>
                <TabGroup className="flex flex-col items-center w-full h-full">
                    <TabList className="text-sm absolute -top-3 w-fit flex space-x-1 p-1 justify-between">
                        {["분", "일", "주", "월", "년"].map((category) => (
                            <Tab
                                key={category}
                                className={({ selected }) =>
                                    classNames(
                                        "w-9 py-2 text-sm font-medium leading-5 text-gray-600 rounded-xl",
                                        selected
                                            ? "bg-gray-500/20 text-gray-600"
                                            : "hover:bg-gray-400/20"
                                    )
                                }
                            >
                                {category}
                            </Tab>
                        ))}
                    </TabList>
                    <TabPanels className="mt-3 w-full h-full">
                        <TabPanel className="w-full h-full bg-linear-to-t from-blue-400/20 to-red-400/20 card-main">
                            <div className="w-full h-full flex items-center justify-center">
                                <h1 className="text-4xl">분 단위 차트</h1>
                            </div>
                        </TabPanel>
                        <TabPanel className="w-full h-full bg-linear-to-t from-blue-400/20 to-red-400/20 card-main">
                            <div className="w-full h-full flex items-center justify-center">
                                <h1 className="text-4xl">일 단위 차트</h1>
                            </div>
                        </TabPanel>
                        <TabPanel className="w-full h-full bg-linear-to-t from-blue-400/20 to-red-400/20 card-main">
                            <div className="w-full h-full flex items-center justify-center">
                                <h1 className="text-4xl">주 단위 차트</h1>
                            </div>
                        </TabPanel>
                        <TabPanel className="w-full h-full bg-linear-to-t from-blue-400/20 to-red-400/20 card-main">
                            <div className="w-full h-full flex items-center justify-center">
                                <h1 className="text-4xl">월 단위 차트</h1>
                            </div>
                        </TabPanel>
                        <TabPanel className="w-full h-full bg-linear-to-t from-blue-400/20 to-red-400/20 card-main">
                            <div className="w-full h-full flex items-center justify-center">
                                <h1 className="text-4xl">년 단위 차트</h1>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
        </>
    );
};

export default StockChart;
