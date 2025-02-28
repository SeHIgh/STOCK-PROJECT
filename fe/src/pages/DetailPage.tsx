import { useLocation, useParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import { fetchStockDetail, fetchStockTradeInfo } from "../api/api";
import { formatCurrency } from "../utils/format";
import { useCallback } from "react";
import SubLayout from "../components/SubLayout";
import StockChart from "../components/Detail/StockChart";
import OrderSection from "../components/Detail/OrderSection";
import Quote from "../components/Detail/Quote";
import LivePrice from "../components/Detail/LivePrice";
import OrderLog from "../components/Detail/OrderLog";

const DetailPage = () => {
    const location = useLocation();
    const { productCode } = location.state as { productCode: string };

    const { stockName } = useParams<{ stockName: string }>();

    const fetchStockDetailCallback = useCallback(
        () => fetchStockDetail(stockName || ""),
        [stockName]
    );

    const fetchStockTradeInfoCallback = useCallback(
        () => fetchStockTradeInfo(stockName || ""),
        [stockName]
    );

    const {
        data: stockDetailData,
        loading: loadingDetailData,
        error: errorDetailData,
    } = useFetchData(fetchStockDetailCallback);

    const {
        data: stockTradeInfoData,
        loading: loadingTradeInfoData,
        error: errorTradeInfoData,
    } = useFetchData(fetchStockTradeInfoCallback);

    if (loadingDetailData || errorDetailData)
        return (
            <SubLayout>
                <div className="w-full h-[calc(100dvh-72px)] min-h-[calc(100dvh-72px)] px-3 pt-3 pb-4 grid grid-flow-row grid-rows-[56px_minmax(300px,1fr)_minmax(230px,0.5fr)] grid-cols-[minmax(280px,1fr)_minmax(280px,1fr)_minmax(280px,1fr)_minmax(280px,1fr)] gap-3 overflow-x-scroll skeleton">
                    <div className="flex flex-row items-center gap-3 col-span-3 skeleton">
                        <div className="w-14 h-14 rounded-xl skeleton-img" />
                        <div className="flex flex-col justify-around">
                            <div className="flex flex-row justify-start gap-1">
                                <h1 className="text-base font-bold skeleton-text">
                                    삼성중공업
                                </h1>
                                <span className="text-gray-400 font-semibold skeleton-text">
                                    010140
                                </span>
                            </div>
                            <div className="flex flex-row justify-start gap-1 pt-0.5">
                                <h1 className="text-2xl font-bold skeleton-text">
                                    14,730원{"  "}
                                </h1>
                                <span className="text-base text-gray-500 font-medium skeleton-text">
                                    어제보다{" "}
                                </span>
                                {"  "}
                                <span
                                    className={`text-base font-semibold skeleton-text`}
                                >
                                    +1,800원(13.9%)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 차트 섹션 */}
                    <div
                        id="stock-chart"
                        className="flex-1 block-detail flex flex-row gap-1 col-span-2 skeleton-box"
                    >
                        {/* <StockChart productCode={productCode!} /> */}
                    </div>
                    {/* 주문 (매수, 매도) [로그인 시 열람 가능] */}
                    <div
                        id="stock-order"
                        className="flex-1 block-detail flex flex-row gap-1 col-span-1 row-span-2 skeleton-box"
                    >
                        {/* <OrderSection productCode={productCode!} /> */}
                    </div>
                    {/* 호가 (채결 강도) [로그인 시 열람 가능] */}
                    <div
                        id="order-flow"
                        className="flex-1 block-detail flex flex-row gap-1 col-span-1 row-span-2 skeleton-box"
                    >
                        {/* <Quote productCode={productCode!} /> */}
                    </div>
                    {/* 실시간 시세 */}
                    <div
                        id="real-time-quotes"
                        className="flex-1 block-detail flex flex-row gap-1 col-span-2 skeleton-box"
                    >
                        {/* <LivePrice productCode={productCode!} /> */}
                    </div>
                </div>
            </SubLayout>
        );
    if (!loadingTradeInfoData && !errorTradeInfoData) {
        console.log("📈 종목 주문 정보 : ", JSON.stringify(stockTradeInfoData, null, 2));
    }

    return (
        <SubLayout>
            <div className="w-full h-[calc(100dvh-72px)] min-h-[calc(100dvh-72px)] px-3 pt-3 pb-4 grid grid-flow-row grid-rows-[56px_minmax(300px,1fr)_minmax(230px,0.5fr)] grid-cols-[minmax(280px,1fr)_minmax(280px,1fr)_minmax(280px,1fr)_minmax(280px,1fr)] gap-3 overflow-x-scroll">
                <div className="flex flex-row items-center gap-3 col-span-3">
                    <img
                        src={`https://static.toss.im/png-icons/securities/icn-sec-fill-${productCode}.png`}
                        alt={stockName}
                        className="w-14 h-14 rounded-xl"
                    />
                    <div className="flex flex-col justify-around">
                        <h1 className="text-base font-bold">
                            {stockName}{" "}
                            <span className="text-gray-400 font-semibold">
                                {productCode}
                            </span>
                        </h1>
                        <h1 className="text-2xl font-bold">
                            {formatCurrency(stockDetailData?.stck_prpr || "")}원
                            {"  "}
                            <span className="text-base text-gray-500 font-medium">
                                어제보다{" "}
                            </span>
                            {"  "}
                            <span
                                className={`text-base font-semibold ${
                                    stockDetailData?.prdy_vrss_sign === "+"
                                        ? "text-red-400"
                                        : "text-blue-400"
                                }`}
                            >
                                {stockDetailData?.prdy_vrss_sign === "+"
                                    ? "+"
                                    : ""}
                                {formatCurrency(
                                    stockDetailData?.prdy_vrss || ""
                                )}
                                원({stockDetailData?.prdy_ctrt}%)
                            </span>
                        </h1>
                    </div>
                </div>
                {/* 데이터 로딩을 거치기 때문에 stockName 타입을 string 형태로 단언 : stockName! */}

                {/* 차트 섹션 */}
                <div
                    id="stock-chart"
                    className="flex-1 block-detail flex flex-row gap-1 col-span-2"
                >
                    <StockChart stockName={stockName!} />
                </div>
                {/* 호가 (채결 강도) [로그인 시 열람 가능] */}
                <div
                    id="order-flow"
                    className="flex-1 block-detail flex flex-row gap-1 col-span-1 row-span-2"
                >
                    <Quote stockName={stockName!} />
                </div>
                {/* 주문 (매수, 매도) [로그인 시 열람 가능] */}
                <div
                    id="stock-order"
                    className="flex-1 block-detail flex flex-col gap-1 col-span-1 row-span-2"
                >
                    <OrderSection
                        stockName={stockName!}
                        productCode={productCode}
                        upperLimit={"68000"}
                    />
                    <hr className="border-1 border-neutral-400/40" />
                    <OrderLog stockName={stockName!} />
                </div>
                {/* 실시간 시세 */}
                <div
                    id="real-time-quotes"
                    className="flex-1 block-detail flex flex-row gap-1 col-span-2"
                >
                    <LivePrice stockName={stockName!} />
                </div>
            </div>
        </SubLayout>
    );
};

export default DetailPage;
