import { useState } from "react";
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Tab,
    TabGroup,
    TabList,
    TabPanels,
    TabPanel,
} from "@headlessui/react";
import {
    ChevronDownIcon,
    MinusIcon,
    PlusIcon,
} from "@heroicons/react/24/solid";
import { formatCurrency } from "../../utils/format";

const ORDER_TYPES = [
    { id: "00", name: "일반 주문", disabled: false },
    { id: "01", name: "조건 주문", disabled: true },
];

const ORDER_DVSN = [
    { id: "00", name: "지정가", disabled: false },
    { id: "01", name: "시장가", disabled: true },
];

const DEFAULT_ACCOUNT = { cano: "50124326", acntPrdtCd: "01" };

const OrderSection: React.FC<{ stockName: string; upperLimit: string }> = ({
    stockName,
    upperLimit,
}) => {
    const [orderType, setOrderType] = useState(ORDER_TYPES[0]);
    const [orderDvsn, setOrderDvsn] = useState(ORDER_DVSN[0]);
    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [balance] = useState(1000000);
    const [activeTab, setActiveTab] = useState("buy");
    const unitStep = 100; // 수량 증감 단위 (100원)

    const totalPrice =
        orderDvsn.id === "00"
            ? Number(price) * Number(quantity)
            : Number(upperLimit) * Number(quantity);
    const isBuy = activeTab === "buy";

    // 가격 입력 핸들러
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
        setPrice(rawValue ? parseInt(rawValue, 10) : 0);
    };

    // 수량 입력 핸들러 (최소 1 이상 유지)
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
        setQuantity(Math.max(1, rawValue ? parseInt(rawValue, 10) : 1));
    };

    // 수량 증가/감소 핸들러
    const changeValue = (
        delta: number,
        setState: React.Dispatch<React.SetStateAction<number>>
    ) => {
        setState((prev) => Math.max(1, prev + delta));
    };

    console.log(totalPrice);

    // 주문하기 버튼 핸들러
    const handleSubmit = async () => {
        if (!quantity || (orderDvsn.id === "00" && !price)) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        const endpoint = isBuy ? "/trading/buy" : "/trading/sell";
        const payload = {
            ...DEFAULT_ACCOUNT,
            pdno: "032350",
            ordDvsn: orderDvsn.id,
            ordQty: quantity,
            ordUnpr: orderDvsn.id === "00" ? totalPrice.toString : "0",
        };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            alert(`주문 완료: ${JSON.stringify(data)}`);
        } catch (error) {
            alert("주문 실패");
        }
    };

    return (
        <div className="w-full h-fit flex-2 max-w-md px-2 sm:px-0 mx-auto overflow-hidden flex flex-col gap-2">
            <h2 className="text-base font-semibold">주문하기</h2>
            <TabGroup className="h-fit scrollbar overflow-y-auto">
                <TabList className="text-sm flex space-x-1 rounded-lg bg-neutral-300/40 p-0.5 overflow-hidden">
                    {[
                        { label: "구매", value: "buy" },
                        { label: "판매", value: "sell" },
                    ].map(({ label, value }) => (
                        <Tab
                            key={value}
                            className={({ selected }) =>
                                `w-full py-1 text-sm font-semibold rounded-lg transition duration-400 ease-in-out ${
                                    selected
                                        ? value === "buy"
                                            ? "bg-neutral-50/70 text-red-500 hover:text-red-500 shadow-round shadow-red-400/70"
                                            : "bg-neutral-50/70  text-blue-500 hover:text-blue-500 shadow-round shadow-blue-400/70"
                                        : "text-neutral-400 hover:text-neutral-600"
                                }`
                            }
                            onClick={() => setActiveTab(value)}
                        >
                            {label}
                        </Tab>
                    ))}
                </TabList>
                <TabPanels className="mt-4">
                    <TabPanel className="overflow-hidden">
                        <div className="space-y-3 border-b-2 border-neutral-300 pb-4 overflow-y-scroll">
                            <div className="div-order">
                                <label className="text-sm text-nowrap font-medium">
                                    주문 유형
                                </label>
                                <Listbox
                                    value={orderType}
                                    onChange={setOrderType}
                                >
                                    <ListboxButton className="button-option">
                                        {orderType.name}
                                        <ChevronDownIcon className="w-5 h-5 fill-neutral-400" />
                                    </ListboxButton>
                                    <ListboxOptions className="box-options">
                                        {ORDER_TYPES.map((type) => (
                                            <ListboxOption
                                                key={type.id}
                                                value={type}
                                                disabled={type.disabled}
                                                className={({ selected }) =>
                                                    `box-option ${
                                                        selected
                                                            ? "text-red-500"
                                                            : ""
                                                    } ${
                                                        type.disabled
                                                            ? "type-disabled"
                                                            : ""
                                                    }`
                                                }
                                            >
                                                {type.name}
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </Listbox>
                            </div>

                            <div className="div-order">
                                <label className="text-sm text-nowrap font-medium">
                                    {isBuy ? "구매 가격" : "판매 가격"}
                                </label>
                                <div className="min-w-4/5">
                                    <TabGroup className="w-full">
                                        <TabList className="text-sm flex space-x-1 rounded-lg bg-neutral-300/40 p-0.5 overflow-hidden">
                                            {ORDER_DVSN.map((dvsn, index) => (
                                                <Tab
                                                    key={dvsn.id}
                                                    className={({ selected }) =>
                                                        `w-full py-1 text-sm font-semibold rounded-lg transition duration-400 ease-in-out ${
                                                            selected
                                                                ? "bg-neutral-50/70 text-neutral-600 hover:text-neutral-600 shadow-round shadow-neutral-400/70"
                                                                : "text-neutral-400 hover:text-neutral-600"
                                                        }`
                                                    }
                                                    onClick={() =>
                                                        setOrderDvsn(
                                                            ORDER_DVSN[index]
                                                        )
                                                    }
                                                >
                                                    {dvsn.name}
                                                </Tab>
                                            ))}
                                        </TabList>
                                        <TabPanels className="mt-4">
                                            {/* 지정가 탭 */}
                                            <TabPanel>
                                                <div className="input-order">
                                                    <div className="flex flex-row">
                                                        <input
                                                            type=""
                                                            value={formatCurrency(
                                                                price
                                                            )}
                                                            onChange={
                                                                handlePriceChange
                                                            }
                                                            disabled={
                                                                orderDvsn.disabled
                                                            }
                                                            className=""
                                                            style={{
                                                                width: `${Math.max(
                                                                    formatCurrency(
                                                                        price
                                                                    ).length,
                                                                    1
                                                                )}ch`, // 입력 길이에 따라 가변 너비
                                                            }}
                                                        />
                                                        <span> 원</span>
                                                    </div>
                                                    <div className="flex flex-row gap-2">
                                                        <button
                                                            onClick={() =>
                                                                changeValue(
                                                                    -unitStep,
                                                                    setPrice
                                                                )
                                                            }
                                                            disabled={
                                                                orderDvsn.disabled
                                                            }
                                                            className="btn-order"
                                                        >
                                                            <MinusIcon className="w-5 h-5 fill-neutral-400" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                changeValue(
                                                                    unitStep,
                                                                    setPrice
                                                                )
                                                            }
                                                            disabled={
                                                                orderDvsn.disabled
                                                            }
                                                            className="btn-order"
                                                        >
                                                            <PlusIcon className="w-5 h-5 fill-neutral-400" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </TabPanel>
                                            {/* 시장가 탭 */}
                                            <TabPanel>
                                                <div className="input-order order-disabled">
                                                    <div className="flex flex-row">
                                                        <input
                                                            type=""
                                                            value={
                                                                "최대한 빠른가격"
                                                            }
                                                            onChange={
                                                                handlePriceChange
                                                            }
                                                            disabled={
                                                                orderDvsn.disabled
                                                            }
                                                            className=""
                                                            style={{
                                                                width: `${Math.max(
                                                                    "최대한 빠른가격"
                                                                        .length,
                                                                    10
                                                                )}ch`, // 입력 길이에 따라 가변 너비
                                                            }}
                                                        />
                                                        {/* <span> 원</span> */}
                                                    </div>
                                                    <div className="flex flex-row gap-2">
                                                        <button
                                                            onClick={() =>
                                                                changeValue(
                                                                    -unitStep,
                                                                    setPrice
                                                                )
                                                            }
                                                            disabled={
                                                                orderDvsn.disabled
                                                            }
                                                            className="btn-order"
                                                        >
                                                            <MinusIcon className="w-5 h-5 fill-neutral-400" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                changeValue(
                                                                    unitStep,
                                                                    setPrice
                                                                )
                                                            }
                                                            disabled={
                                                                orderDvsn.disabled
                                                            }
                                                            className="btn-order"
                                                        >
                                                            <PlusIcon className="w-5 h-5 fill-neutral-400" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </TabPanel>
                                        </TabPanels>
                                    </TabGroup>
                                </div>
                            </div>

                            <div className="div-order">
                                <label className="text-sm text-nowrap font-medium">
                                    수량
                                </label>
                                <div className="input-order">
                                    <div className="flex flex-row">
                                        <input
                                            type=""
                                            value={formatCurrency(quantity)}
                                            onChange={handleQuantityChange}
                                            className=""
                                            style={{
                                                width: `${Math.max(
                                                    formatCurrency(quantity)
                                                        .length,
                                                    1
                                                )}ch`, // 입력 길이에 따라 가변 너비
                                            }}
                                        />
                                        <span> 주</span>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <button
                                            onClick={() =>
                                                changeValue(-1, setQuantity)
                                            }
                                            className="btn-order"
                                        >
                                            <MinusIcon className="w-5 h-5 fill-neutral-400" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                changeValue(1, setQuantity)
                                            }
                                            className="btn-order"
                                        >
                                            <PlusIcon className="w-5 h-5 fill-neutral-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 py-4">
                            {isBuy && (
                                <div className="div-order">
                                    <label className="text-sm font-medium">
                                        구매 가능 금액
                                    </label>
                                    <p className="mt-1 text-gray-700">
                                        {balance.toLocaleString()} 원
                                    </p>
                                </div>
                            )}

                            <div className="div-order">
                                <label className="text-sm font-medium">
                                    총 주문 금액
                                </label>
                                <p className="mt-1 text-gray-700">
                                    {orderDvsn.id === "00"
                                        ? `${totalPrice.toLocaleString()} 원`
                                        : `최대 ${totalPrice.toLocaleString()} 원`}
                                </p>
                            </div>
                        </div>
                        <button
                            className={`button-submit ${
                                isBuy
                                    ? "bg-red-400/70 text-neutral-100"
                                    : "bg-blue-400/70 text-neutral-100"
                            }`}
                            onClick={handleSubmit}
                        >
                            {isBuy ? "구매하기" : "판매하기"}
                        </button>
                    </TabPanel>
                    <TabPanel className="overflow-hidden">
                        <div className="space-y-3 border-b-2 border-neutral-300 pb-4 overflow-y-scroll">
                            <div className="div-order">
                                <label className="text-sm text-nowrap font-medium">
                                    주문 유형
                                </label>
                                <Listbox
                                    value={orderType}
                                    onChange={setOrderType}
                                >
                                    <ListboxButton className="button-option">
                                        {orderType.name}
                                        <ChevronDownIcon className="w-5 h-5 fill-neutral-400" />
                                    </ListboxButton>
                                    <ListboxOptions className="box-options">
                                        {ORDER_TYPES.map((type) => (
                                            <ListboxOption
                                                key={type.id}
                                                value={type}
                                                disabled={type.disabled}
                                                className={({ selected }) =>
                                                    `box-option ${
                                                        selected
                                                            ? "text-red-500"
                                                            : ""
                                                    } ${
                                                        type.disabled
                                                            ? "type-disabled"
                                                            : ""
                                                    }`
                                                }
                                            >
                                                {type.name}
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </Listbox>
                            </div>

                            <div className="div-order">
                                <label className="text-sm text-nowrap font-medium">
                                    {isBuy ? "구매 가격" : "판매 가격"}
                                </label>
                                <div className="min-w-4/5">
                                    <TabGroup className="w-full">
                                        <TabList className="text-sm flex space-x-1 rounded-lg bg-neutral-300/40 p-0.5 overflow-hidden">
                                            {ORDER_DVSN.map((dvsn, index) => (
                                                <Tab
                                                    key={dvsn.id}
                                                    className={({ selected }) =>
                                                        `w-full py-1 text-sm font-semibold rounded-lg transition duration-400 ease-in-out ${
                                                            selected
                                                                ? "bg-neutral-50/70 text-neutral-600 hover:text-neutral-600 shadow-round shadow-neutral-400/70"
                                                                : "text-neutral-400 hover:text-neutral-600"
                                                        }`
                                                    }
                                                    onClick={() =>
                                                        setOrderDvsn(
                                                            ORDER_DVSN[index]
                                                        )
                                                    }
                                                >
                                                    {dvsn.name}
                                                </Tab>
                                            ))}
                                        </TabList>
                                        <TabPanels className="mt-4">
                                            {/* 지정가 탭 */}
                                            <TabPanel>
                                                <div className="input-order">
                                                    <div className="flex flex-row">
                                                        <input
                                                            type=""
                                                            value={formatCurrency(
                                                                price
                                                            )}
                                                            onChange={
                                                                handlePriceChange
                                                            }
                                                            disabled={
                                                                orderDvsn.disabled
                                                            }
                                                            className=""
                                                            style={{
                                                                width: `${Math.max(
                                                                    formatCurrency(
                                                                        price
                                                                    ).length,
                                                                    1
                                                                )}ch`, // 입력 길이에 따라 가변 너비
                                                            }}
                                                        />
                                                        <span> 원</span>
                                                    </div>
                                                    <div className="flex flex-row gap-2">
                                                        <button
                                                            onClick={() =>
                                                                changeValue(
                                                                    -unitStep,
                                                                    setPrice
                                                                )
                                                            }
                                                            disabled={
                                                                orderDvsn.disabled
                                                            }
                                                            className="btn-order"
                                                        >
                                                            <MinusIcon className="w-5 h-5 fill-neutral-400" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                changeValue(
                                                                    unitStep,
                                                                    setPrice
                                                                )
                                                            }
                                                            disabled={
                                                                orderDvsn.disabled
                                                            }
                                                            className="btn-order"
                                                        >
                                                            <PlusIcon className="w-5 h-5 fill-neutral-400" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </TabPanel>
                                            {/* 시장가 탭 */}
                                            <TabPanel>
                                                <div className="input-order order-disabled">
                                                    <div className="flex flex-row">
                                                        <input
                                                            type=""
                                                            value={
                                                                "최대한 빠른가격"
                                                            }
                                                            onChange={
                                                                handlePriceChange
                                                            }
                                                            disabled={
                                                                orderDvsn.disabled
                                                            }
                                                            className=""
                                                            style={{
                                                                width: `${Math.max(
                                                                    "최대한 빠른가격"
                                                                        .length,
                                                                    10
                                                                )}ch`, // 입력 길이에 따라 가변 너비
                                                            }}
                                                        />
                                                        {/* <span> 원</span> */}
                                                    </div>
                                                    <div className="flex flex-row gap-2">
                                                        <button
                                                            onClick={() =>
                                                                changeValue(
                                                                    -unitStep,
                                                                    setPrice
                                                                )
                                                            }
                                                            disabled={
                                                                orderDvsn.disabled
                                                            }
                                                            className="btn-order"
                                                        >
                                                            <MinusIcon className="w-5 h-5 fill-neutral-400" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                changeValue(
                                                                    unitStep,
                                                                    setPrice
                                                                )
                                                            }
                                                            disabled={
                                                                orderDvsn.disabled
                                                            }
                                                            className="btn-order"
                                                        >
                                                            <PlusIcon className="w-5 h-5 fill-neutral-400" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </TabPanel>
                                        </TabPanels>
                                    </TabGroup>
                                </div>
                            </div>

                            <div className="div-order">
                                <label className="text-sm text-nowrap font-medium">
                                    수량
                                </label>
                                <div className="input-order">
                                    <div className="flex flex-row">
                                        <input
                                            type=""
                                            value={formatCurrency(quantity)}
                                            onChange={handleQuantityChange}
                                            className=""
                                            style={{
                                                width: `${Math.max(
                                                    formatCurrency(quantity)
                                                        .length,
                                                    1
                                                )}ch`, // 입력 길이에 따라 가변 너비
                                            }}
                                        />
                                        <span> 주</span>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <button
                                            onClick={() =>
                                                changeValue(-1, setQuantity)
                                            }
                                            className="btn-order"
                                        >
                                            <MinusIcon className="w-5 h-5 fill-neutral-400" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                changeValue(1, setQuantity)
                                            }
                                            className="btn-order"
                                        >
                                            <PlusIcon className="w-5 h-5 fill-neutral-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 py-4">
                            {isBuy && (
                                <div className="div-order">
                                    <label className="text-sm font-medium">
                                        구매 가능 금액
                                    </label>
                                    <p className="mt-1 text-gray-700">
                                        {balance.toLocaleString()} 원
                                    </p>
                                </div>
                            )}

                            <div className="div-order">
                                <label className="text-sm font-medium">
                                    총 주문 금액
                                </label>
                                <p className="mt-1 text-gray-700">
                                    {orderDvsn.id === "00"
                                        ? `${totalPrice.toLocaleString()} 원`
                                        : `최대 ${totalPrice.toLocaleString()} 원`}
                                </p>
                            </div>
                        </div>
                        <button
                            className={`button-submit ${
                                isBuy
                                    ? "bg-red-400/70 text-neutral-100"
                                    : "bg-blue-400/70 text-neutral-100"
                            }`}
                            onClick={handleSubmit}
                        >
                            {isBuy ? "구매하기" : "판매하기"}
                        </button>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
};

export default OrderSection;
