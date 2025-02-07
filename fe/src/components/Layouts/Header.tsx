import { useState } from "react";
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Dialog,
    DialogPanel,
} from "@headlessui/react";
import {
    Bars3Icon,
    ChevronDownIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import {
    BuildingOffice2Icon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

const navigation = [
    { name: "국내", href: "/main" },
    { name: "해외", href: "*" },
];

// 백엔드로 부터 받아올 주식 데이터 (검색용 주요 주가)
// -> 임시 : 토스증권 국내 실시간 top10
const stocks = [
    { id: 1, name: "SK하이닉스" },
    { id: 2, name: "삼성전자" },
    { id: 3, name: "LG씨엔에스" },
    { id: 4, name: "한화오션" },
    { id: 5, name: "아남전자" },
    { id: 6, name: "HD현대중공업" },
    { id: 7, name: "NAVER" },
    { id: 8, name: "신성델타테크" },
    { id: 9, name: "폴라리스AI" },
    { id: 10, name: "삼양식품" },
];

const Header = () => {
    // 메뉴 크기
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // 검색 창
    const [query, setQuery] = useState("");
    const [selectedStock, setSelectedStock] = useState("");
    // 목록 필터링 - 소문자 통일
    const filterStocks =
        query === ""
            ? stocks
            : stocks.filter((stock) => {
                  return stock.name.toLowerCase().includes(query.toLowerCase());
              });

    return (
        <header className="h-21 inset-x-0 top-0 z-50 backdrop-blur-2xl">
            <nav
                aria-label="Global"
                className="flex items-center justify-between p-6 lg:px-8"
            >
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                            alt=""
                            src="/monitoring.svg"
                            className="h-8 w-auto"
                        />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12 lg:hidden">
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-sm/6 font-semibold text-gray-900 transition duration-200 ease-in-out hover:scale-115 hover:opacity-70"
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
                <form className="hidden lg:flex lg:ml-0">
                    <Combobox
                        value={selectedStock}
                        onChange={setSelectedStock}
                        onClose={() => setQuery("")}
                    >
                        <div className="relative cursor-pointer">
                            <ComboboxInput
                                placeholder="종목을 검색하세요"
                                displayValue={(stock) => stock.name}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                className="w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                            />
                            <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                                <ChevronDownIcon className="size-4" />
                            </ComboboxButton>
                        </div>
                        <ComboboxOptions
                            anchor="bottom"
                            transition
                            className="w-[var(--input-width)] rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 backdrop-blur-xs"
                        >
                            {filterStocks.map((stock) => (
                                <ComboboxOption
                                    key={stock.id}
                                    value={stock}
                                    className="group flex items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                                >
                                    <div className="w-full text-sm/6 flex flex-row justify-start gap-2 px-1 items-center cursor-pointer">
                                        <BuildingOffice2Icon className="size-4 fill-indigo-900" />
                                        {stock.name}
                                    </div>
                                </ComboboxOption>
                            ))}
                        </ComboboxOptions>
                    </Combobox>
                    <button type="submit" className="w-8 h-8 p-1 items-center">
                        <MagnifyingGlassIcon className="w-6 h-6 fill-indigo-900 hover:fill-indigo-400" />
                    </button>
                </form>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a
                        href="/login"
                        className="text-sm/6 font-semibold text-gray-900 transition duration-200 ease-in-out hover:scale-115 hover:opacity-70"
                    >
                        로그인 <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </nav>
            <Dialog
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
                className="lg:hidden"
            >
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                alt=""
                                src="/monitoring.svg"
                                className="h-8 w-auto"
                            />
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6 hidden">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                            <form className="hidden">
                                <Combobox
                                    value={selectedStock}
                                    onChange={setSelectedStock}
                                    onClose={() => setQuery("")}
                                >
                                    <div className="relative cursor-pointer">
                                        <ComboboxInput
                                            placeholder="종목을 검색하세요"
                                            displayValue={(stock) => stock.name}
                                            onChange={(event) =>
                                                setQuery(event.target.value)
                                            }
                                            className="w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                                        />
                                        <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                                            <ChevronDownIcon className="size-4" />
                                        </ComboboxButton>
                                    </div>
                                    <ComboboxOptions
                                        anchor="bottom"
                                        transition
                                        className="w-[var(--input-width)] rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 backdrop-blur-xs"
                                    >
                                        {filterStocks.map((stock) => (
                                            <ComboboxOption
                                                key={stock.id}
                                                value={stock}
                                                className="group flex items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                                            >
                                                <div className="w-full text-sm/6 flex flex-row justify-start gap-2 px-1 items-center cursor-pointer">
                                                    <BuildingOffice2Icon className="size-4 fill-indigo-900" />
                                                    {stock.name}
                                                </div>
                                            </ComboboxOption>
                                        ))}
                                    </ComboboxOptions>
                                </Combobox>
                                <button
                                    type="submit"
                                    className="w-8 h-8 p-1 items-center"
                                >
                                    <MagnifyingGlassIcon className="w-6 h-6 fill-indigo-900 hover:fill-indigo-400" />
                                </button>
                            </form>
                            <div className="py-6">
                                <a
                                    href="/login"
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    로그인
                                </a>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
};

export default Header;
