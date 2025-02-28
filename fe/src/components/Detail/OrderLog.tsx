import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react";

const OrderLog: React.FC<{ stockName: string }> = ({ stockName }) => {
    return (
        <div className="w-full max-w-md h-full flex-1 px-2 sm:px-0 mx-auto overflow-hidden flex flex-col gap-2 scrollbar">
            <h2 className="text-base font-semibold">주문내역</h2>
            <TabGroup className="h-full flex flex-col gap-1">
                <TabList className="text-sm flex space-x-1 rounded-lg bg-neutral-300/40 p-0.5 overflow-hidden">
                    {[
                        { label: "구매", value: "buy" },
                        { label: "판매", value: "sell" },
                    ].map(({ label, value }) => (
                        <Tab
                            key={value}
                            className={({ selected }) =>
                                `w-full h-fit py-1 text-sm font-semibold rounded-lg transition duration-400 ease-in-out ${
                                    selected
                                        ? value === "buy"
                                            ? "bg-neutral-50/70 text-red-500 hover:text-red-500 shadow-round shadow-red-400/70"
                                            : "bg-neutral-50/70  text-blue-500 hover:text-blue-500 shadow-round shadow-blue-400/70"
                                        : "text-neutral-400 hover:text-neutral-600"
                                }`
                            }
                            // onClick={() => setActiveTab(value)}
                        >
                            <span>{label}</span>
                        </Tab>
                    ))}
                </TabList>
                <TabPanels className="h-full flex-1">
                    <TabPanel className="h-full">
                        <div className="h-full flex flex-col items-center justify-center">
                            <h1>구매한 내역이 없어요</h1>
                        </div>
                    </TabPanel>
                    <TabPanel className="h-full">
                        <div className="h-full flex flex-col items-center justify-center">
                            <h1>판매한 내역이 없어요</h1>
                        </div>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
};

export default OrderLog;
