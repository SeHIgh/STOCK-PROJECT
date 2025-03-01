import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {} from "@heroicons/react/24/solid";
import Search from "../Search";

const navigation = [
    { name: "국내", href: "/main" },
    { name: "해외", href: "*" },
];

const Header = () => {
    // 메뉴 크기
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="h-18 inset-x-0 sticky top-0 z-50 backdrop-blur-2xl flex items-center">
            <nav
                aria-label="Global"
                className="w-full h-full flex items-center justify-between px-6 py-1 lg:px-8"
            >
                <div className="flex lg:flex-1">
                    <a href="/main" className="-m-1.5 p-1.5 w-fit h-14">
                        {/* <span className="sr-only">Your Company</span> */}
                        <img
                            alt=""
                            src="/AnTrading_Logo_v2.svg"
                            className="h-14 w-auto"
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
                <Search />
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
                            <Search />
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
