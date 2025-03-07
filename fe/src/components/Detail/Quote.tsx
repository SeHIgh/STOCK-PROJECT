import { random } from "lodash";
import { useLayoutEffect, useRef } from "react";
import { useQuoteInfo } from "../../api/apiws";
import { LiveQuoteInfoProps } from "../../types";
import { useRecoilValue } from "recoil";
import { liveTradeDataState } from "../../recoil/livetrade/atoms";
import { stockDataState } from "../../recoil/\bstockdata/atoms";
import { formatCurrency } from "../../utils/format";
import StockLiveData from "../WebSocket/StockLiveData";

const getBorderIndex = (
    prices: number[],
    tradePrice: number,
    isAscending: boolean
) => {
    if (prices.length === 0) return -1;

    // 정확히 일치하는 가격이 있으면 해당 index 반환
    let exactMatch = prices.indexOf(tradePrice);
    if (exactMatch !== -1) return exactMatch;

    if (isAscending) {
        // askPrices (오름차순)
        if (tradePrice < prices[0] && tradePrice > prices[0] - 100) return 0; // 최저 가격보다 낮으면 첫 번째 인덱스
        if (tradePrice > prices[prices.length - 1]) return prices.length - 1; // 최고 가격보다 높으면 마지막 인덱스

        // 경계 찾기
        for (let i = 0; i < prices.length - 1; i++) {
            if (prices[i] < tradePrice && prices[i + 1] > tradePrice) {
                return i;
            }
        }
    } else {
        // bidPrices (내림차순)
        if (tradePrice < prices[prices.length - 1]) return prices.length - 1; // 최저 가격보다 낮으면 마지막 인덱스

        // 경계 찾기
        for (let i = 0; i < prices.length - 1; i++) {
            if (prices[i] > tradePrice && prices[i + 1] < tradePrice) {
                return i;
            }
        }
    }

    return -1;
};
const Quote: React.FC<{ stockName: string }> = ({ stockName }) => {
    const stockData = useRecoilValue(stockDataState);
    const liveTradeData = useRecoilValue(liveTradeDataState);
    const scrollRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        // 스크롤을 리로딩시 중앙으로 이동
        requestAnimationFrame(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop =
                    scrollRef.current.scrollHeight / 6;
            }
        });
    }, []);

    // WebSocket 기반 실시간 데이터 훅 사용
    const { quoteInfo, isConnected: qiConnected } = useQuoteInfo(
        stockData.stockName
    );
    const { tradeInfo, isConnected: tiConnected } = useQuoteInfo(
        stockData.stockName
    );

    const tradePrice = Number(tradeInfo?.trade_price);
    const bidPrices = quoteInfo?.bidPrices.map(Number) || [];
    const askPrices = quoteInfo?.askPrices.map(Number) || [];

    // 체결가가 포함되거나 경계 사이에 있을 경우 테두리 적용할 index 찾기
    const bidBorderIndex = getBorderIndex(bidPrices, tradePrice, false); // bidPrices는 내림차순
    const askBorderIndex = getBorderIndex(askPrices, tradePrice, true); // askPrices는 오름차순

    return (
        <div className="w-full h-full px-2 sm:px-0 mx-auto overflow-hidden flex flex-col gap-2 scrollbar">
            <h2 className="text-base font-semibold">호가</h2>
            <div
                ref={scrollRef}
                className="w-full h-full min-h-150 overflow-y-scroll scrollbar"
            >
                <div className="pl-1 w-full h-full grid grid-flow-row grid-rows-[minmax(500px,1fr)_minmax(500px,1fr)] grid-cols-[minmax(20px,1fr)_minmax(40px,1.5fr)_minmax(20px,1fr)]">
                    <ul className="quote-ul col-span-2">
                        {quoteInfo?.askVolumes.map((askVol, i) => {
                            const price = Number(
                                `${
                                    i === 0
                                        ? tradeInfo?.low_price
                                        : quoteInfo.askPrices[9 - i]
                                }`
                            ); // 매도 가격 맵핑
                            return (
                                <li className="quote-li-high text-xs" key={i}>
                                    <div className="w-full h-full py-3 border-r-2 border-neutral-400/30 flex flex-row justify-end items-center">
                                        <div
                                            className="relative text-blue-400 h-full flex flex-row justify-end items-center bg-blue-300/50 rounded-l-lg"
                                            style={{
                                                width: `${
                                                    (Number(askVol) /
                                                        Math.max(
                                                            ...[
                                                                ...quoteInfo.askVolumes,
                                                                ...quoteInfo.bidVolumes,
                                                            ].map(Number)
                                                        )) *
                                                    100
                                                }%`,
                                            }}
                                        >
                                            <span className="absolute right-0 pr-2">
                                                {askVol}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            className={`w-full h-full overflow-hidden p-0 ${
                                                price >
                                                Number(stockData.stockPrice)
                                                    ? "text-red-500"
                                                    : price ===
                                                      Number(
                                                          stockData.stockPrice
                                                      )
                                                    ? "text-gray-500"
                                                    : "text-blue-500"
                                            } rounded-xl flex flex-col justify-center items-center gap-0.5 hover:bg-neutral-400/10 border-2 ${
                                                9 - i === askBorderIndex
                                                    ? "border-neutral-600/60"
                                                    : "border-transparent"
                                            }`}
                                        >
                                            {i === 0 ? (
                                                <span className="font-bold text-red-500">
                                                    상한가
                                                </span>
                                            ) : (
                                                <></>
                                            )}
                                            <div className="overflow-hidden flex flex-col lg:flex-row items-center gap-1">
                                                <span className="text-xs lg:text-sm font-semibold">
                                                    {price.toLocaleString()}
                                                </span>
                                                <span>
                                                    {price >
                                                    Number(stockData.stockPrice)
                                                        ? "+"
                                                        : price ===
                                                          Number(
                                                              stockData.stockPrice
                                                          )
                                                        ? ""
                                                        : "-"}
                                                    $
                                                    {(
                                                        ((price -
                                                            Number(
                                                                stockData.stockPrice
                                                            )) /
                                                            Number(
                                                                stockData.stockPrice
                                                            )) *
                                                        100
                                                    ).toFixed(2)}
                                                    %
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <ul className="quote-ul-desc col-span-1 border-l-2 border-neutral-400/30">
                        {tradeInfo && (
                            <div>
                                <li>
                                    <span>상한가</span>
                                    <span>
                                        {formatCurrency(tradeInfo.high_price)}
                                    </span>
                                </li>
                                <li>
                                    <span>하한가</span>
                                    <span>
                                        {formatCurrency(tradeInfo.low_price)}
                                    </span>
                                </li>
                                <li>
                                    <span>시작</span>
                                    <span>
                                        {formatCurrency(tradeInfo.high_price)}
                                    </span>
                                </li>
                                <li>
                                    <span>최고</span>
                                    <span>
                                        {formatCurrency(tradeInfo.high_price)}
                                    </span>
                                </li>
                                <li>
                                    <span>최저</span>
                                    <span>
                                        {formatCurrency(tradeInfo.low_price)}
                                    </span>
                                </li>
                                <li>
                                    <span>거래량</span>
                                    <span>
                                        {formatCurrency(tradeInfo.trade_volume)}
                                    </span>
                                </li>
                                <li>
                                    <span>어제보다</span>
                                    <span>
                                        {parseFloat(
                                            tradeInfo.change_rate
                                        ).toFixed(2)}
                                        %
                                    </span>
                                </li>
                            </div>
                        )}
                    </ul>
                    <ul className="quote-ul-strong col-span-1 border-t-2 border-r-2 border-neutral-400/30">
                        <div>
                            {tradeInfo && (
                                <li>
                                    <span>체결강도</span>
                                    <span className="text-red-400">
                                        {parseFloat(
                                            tradeInfo!.trade_strength
                                        ).toFixed(2)}
                                        %
                                    </span>
                                </li>
                            )}
                            {liveTradeData.map((data, i) => (
                                <li key={i}>
                                    <span>
                                        {formatCurrency(data.trade_price)}
                                    </span>
                                    <span
                                        className={
                                            data.trade_type === "1"
                                                ? "text-red-500"
                                                : "text-blue-500"
                                        }
                                    >
                                        {formatCurrency(data.trade_volume)}
                                    </span>
                                </li>
                            ))}
                        </div>
                    </ul>
                    <ul className="quote-ul col-span-2 border-t-2 border-neutral-400/30">
                        {quoteInfo?.bidVolumes.map((bidVol, i) => {
                            const price = Number(
                                `${
                                    i === 9
                                        ? tradeInfo?.low_price
                                        : quoteInfo.bidPrices[i]
                                }`
                            ); // 매수 가격 매핑
                            return (
                                <li className="quote-li-low text-xs" key={i}>
                                    <div>
                                        <button
                                            className={`w-full h-full overflow-hidden p-0 ${
                                                price >
                                                Number(stockData.stockPrice)
                                                    ? "text-red-500"
                                                    : price ===
                                                      Number(
                                                          stockData.stockPrice
                                                      )
                                                    ? "text-gray-500"
                                                    : "text-blue-500"
                                            } rounded-xl flex flex-col justify-center items-center gap-0.5 hover:bg-neutral-400/10 border-2 ${
                                                i === bidBorderIndex
                                                    ? "border-neutral-600/60"
                                                    : "border-transparent"
                                            }`}
                                        >
                                            <div className="overflow-hidden flex flex-col items-center gap-1 lg:flex-row">
                                                <span className="text-xs lg:text-sm font-semibold">
                                                    {i === 9
                                                        ? `${formatCurrency(
                                                              tradeInfo!
                                                                  .low_price
                                                          )}`
                                                        : `${price.toLocaleString()}`}
                                                </span>
                                                <span>
                                                    {i === 9
                                                        ? `${
                                                              Number(
                                                                  tradeInfo!
                                                                      .low_price
                                                              ) >
                                                              Number(
                                                                  stockData.stockPrice
                                                              )
                                                                  ? "+"
                                                                  : Number(
                                                                        tradeInfo!
                                                                            .low_price
                                                                    ) ===
                                                                    Number(
                                                                        stockData.stockPrice
                                                                    )
                                                                  ? ""
                                                                  : "-"
                                                          }${(
                                                              ((Number(
                                                                  tradeInfo!
                                                                      .low_price
                                                              ) -
                                                                  Number(
                                                                      stockData.stockPrice
                                                                  )) /
                                                                  Number(
                                                                      stockData.stockPrice
                                                                  )) *
                                                              100
                                                          ).toFixed(2)}%`
                                                        : `${
                                                              price >
                                                              Number(
                                                                  stockData.stockPrice
                                                              )
                                                                  ? "+"
                                                                  : price ===
                                                                    Number(
                                                                        stockData.stockPrice
                                                                    )
                                                                  ? ""
                                                                  : "-"
                                                          }${(
                                                              ((price -
                                                                  Number(
                                                                      stockData.stockPrice
                                                                  )) /
                                                                  Number(
                                                                      stockData.stockPrice
                                                                  )) *
                                                              100
                                                          ).toFixed(2)}%`}
                                                </span>
                                            </div>
                                            {i === 9 ? (
                                                <span className="font-bold text-blue-500">
                                                    하한가
                                                </span>
                                            ) : null}
                                        </button>
                                    </div>
                                    <div className="w-full h-full py-3 border-l-2 border-neutral-400/30 flex flex-row justify-start items-center">
                                        <div
                                            className="relative text-red-400 h-full flex flex-row justify-start items-center bg-red-300/50 rounded-r-lg"
                                            style={{
                                                width: `${
                                                    (Number(bidVol) /
                                                        Math.max(
                                                            ...[
                                                                ...quoteInfo.askVolumes,
                                                                ...quoteInfo.bidVolumes,
                                                            ].map(Number)
                                                        )) *
                                                    100
                                                }%`,
                                            }}
                                        >
                                            <span className="absolute left-0 pl-2">
                                                {bidVol}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Quote;
