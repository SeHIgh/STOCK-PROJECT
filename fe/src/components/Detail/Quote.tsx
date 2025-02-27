import { random } from "lodash";
import { useLayoutEffect, useRef } from "react";

// const generateData = (standardPrice: number) =>
//     Array.from({ length: 10 }).map((_, i) => ({
//         price: standardPrice + 100 * (10 - i),
//         volume: random(0, 1000000),
//     }));

const Quote: React.FC<{ stockName: string }> = ({ stockName }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        // 스크롤을 리로딩시 중앙으로 이동
        requestAnimationFrame(() => {
            if (scrollRef.current) {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop =
                        scrollRef.current.scrollHeight / 6;
                }
            }
        });
    }, []);

    const standardVol = 1000000;
    let changeVol = random(0, 1000000);
    const standardPrice = 58200;
    let changePrice = random(0, 1000000);

    return (
        <div className="w-full h-full px-2 sm:px-0 mx-auto overflow-hidden flex flex-col gap-2 scrollbar">
            <h2 className="text-base font-semibold">호가</h2>
            <div
                ref={scrollRef}
                className="w-full h-full min-h-150 overflow-y-scroll scrollbar"
            >
                <div className="pl-1 w-full h-full grid grid-flow-row grid-rows-[minmax(500px,1fr)_minmax(500px,1fr)] grid-cols-[minmax(20px,1fr)_minmax(40px,1.5fr)_minmax(20px,1fr)]">
                    <ul className="quote-ul col-span-2">
                        {Array.from({ length: 10 }).map(
                            (_, i) => (
                                (changePrice = standardPrice + 100 * (10 - i)),
                                (
                                    <li
                                        className="quote-li-high text-xs"
                                        key={i}
                                    >
                                        <div className="w-full h-full py-3 border-r-2 border-neutral-400/30 flex flex-row justify-end items-center">
                                            {i === 0 ? (
                                                <></>
                                            ) : (
                                                ((changeVol = random(
                                                    0,
                                                    1000000
                                                )),
                                                (
                                                    <div
                                                        className="relative text-blue-400 h-full flex flex-row justify-end items-center bg-blue-300/50 rounded-l-lg"
                                                        style={{
                                                            width: `${
                                                                (changeVol /
                                                                    standardVol) *
                                                                100
                                                            }%`,
                                                        }}
                                                    >
                                                        <span className="absolute right-0 pr-2">
                                                            {changeVol}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div>
                                            <button
                                                className={`w-full h-full overflow-hidden p-0 text-red-400 rounded-xl flex flex-col justify-center items-center gap-0.5 hover:bg-neutral-400/10 border-2 ${
                                                    i === 9
                                                        ? "border-neutral-600/60"
                                                        : "border-transparent"
                                                }`}
                                            >
                                                {i === 0 ? (
                                                    <span className="font-bold">
                                                        상한가
                                                    </span>
                                                ) : (
                                                    <></>
                                                )}
                                                <div className="overflow-hidden flex flex-col lg:flex-row items-center gap-1">
                                                    <span className="text-xs lg:text-sm font-semibold">
                                                        {`${changePrice.toLocaleString()}`}
                                                    </span>
                                                    <span
                                                        className={
                                                            changePrice >=
                                                            standardPrice
                                                                ? "text-red-500"
                                                                : "text-blue-500"
                                                        }
                                                    >
                                                        {`${
                                                            changePrice >
                                                            standardPrice
                                                                ? "+"
                                                                : ""
                                                        }${(
                                                            ((changePrice -
                                                                standardPrice) /
                                                                standardPrice) *
                                                            100
                                                        ).toFixed(2)}%`}
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    </li>
                                )
                            )
                        )}
                    </ul>
                    <ul className="quote-ul-desc col-span-1 border-l-2 border-neutral-400/30">
                        <div>
                            <li>
                                <span>상한가</span>
                                <span>74,400</span>
                            </li>
                            <li>
                                <span>하한가</span>
                                <span>40,200</span>
                            </li>
                            <li>
                                <span>시작</span>
                                <span>56,600</span>
                            </li>
                            <li>
                                <span>최고</span>
                                <span>57,800</span>
                            </li>
                            <li>
                                <span>최저</span>
                                <span>56,500</span>
                            </li>
                            <li>
                                <span>거래량</span>
                                <span>1,462만 5,181</span>
                            </li>
                            <li>
                                <span>어제보다</span>
                                <span>103.44%</span>
                            </li>
                        </div>
                    </ul>
                    <ul className="quote-ul-strong col-span-1 border-t-2 border-r-2 border-neutral-400/30">
                        <div>
                            <li>
                                <span>체결강도</span>
                                <span className="text-red-400">142.40%</span>
                            </li>
                            {Array.from({ length: 15 }).map((_, i) => (
                                <li>
                                    <span>57,200</span>
                                    <span className="text-blue-400">
                                        {random(1, 150)}
                                    </span>
                                </li>
                            ))}
                        </div>
                    </ul>
                    <ul className="quote-ul col-span-2 border-t-2 border-neutral-400/30">
                        {Array.from({ length: 10 }).map(
                            (_, i) => (
                                (changePrice = standardPrice - 100 * i),
                                (
                                    <li
                                        className="quote-li-low text-xs"
                                        key={i}
                                    >
                                        <div>
                                            <button className="w-full h-full overflow-hidden p-0 text-blue-400 rounded-xl flex flex-col justify-center items-center gap-0.5 hover:bg-neutral-400/10">
                                                <div className="overflow-hidden flex flex-col items-center gap-1 lg:flex-row">
                                                    <span className="text-xs lg:text-sm font-semibold">
                                                        {`${changePrice.toLocaleString()}`}
                                                    </span>
                                                    <span
                                                        className={
                                                            changePrice >
                                                            standardPrice
                                                                ? "text-red-500"
                                                                : "text-blue-500"
                                                        }
                                                    >
                                                        {`${
                                                            changePrice >
                                                            standardPrice
                                                                ? "+"
                                                                : ""
                                                        } ${(
                                                            ((changePrice -
                                                                standardPrice) /
                                                                standardPrice) *
                                                            100
                                                        ).toFixed(2)}%`}
                                                    </span>
                                                </div>
                                                {i === 9 ? (
                                                    <span className="font-bold">
                                                        하한가
                                                    </span>
                                                ) : (
                                                    <></>
                                                )}
                                            </button>
                                        </div>
                                        <div className="w-full h-full py-3 border-l-2 border-neutral-400/30 flex flex-row justify-start items-center">
                                            {i === 0 ? (
                                                <></>
                                            ) : (
                                                ((changeVol = random(
                                                    0,
                                                    1000000
                                                )),
                                                (
                                                    <div
                                                        className="relative text-red-400 h-full flex flex-row justify-start items-center bg-red-300/50 rounded-r-lg"
                                                        style={{
                                                            width: `${
                                                                (changeVol /
                                                                    standardVol) *
                                                                100
                                                            }%`,
                                                        }}
                                                    >
                                                        <span className="absolute left-0 pl-2">
                                                            {changeVol}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </li>
                                )
                            )
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Quote;
