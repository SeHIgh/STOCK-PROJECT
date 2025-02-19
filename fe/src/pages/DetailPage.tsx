import { useLocation, useParams } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import useFetchData from "../hooks/useFetchData";
import { fetchStockDetail } from "../api/api";
import { formatCurrency } from "../utils/format";
import { useCallback } from "react";

const DetailPage = () => {
    const location = useLocation();
    const { productCode } = location.state as { productCode: string };

    const { stockName } = useParams<{ stockName: string }>();

    const fetchStockDetailCallback = useCallback(
        () => fetchStockDetail(stockName || ""),
        [stockName]
    );

    const {
        data: stockDetailData,
        loading: loadingDetailData,
        error: errorDetailData,
    } = useFetchData(fetchStockDetailCallback);

    if (loadingDetailData || errorDetailData)
        return (
            <MainLayout>
                <div className="w-full min-h-[calc(100dvh-96px)] px-10 py-4 pb-10 grid grid-flow-row grid-rows-[56px_360px_minmax(200px,1fr)] grid-cols-[minmax(280px,1fr)_minmax(280px,1fr)_minmax(280px,1fr)_minmax(280px,1fr)] gap-3 overflow-x-scroll skeleton">
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
                        className="flex-1 block-detail gray-hover flex flex-row gap-1 col-span-2 skeleton-box"
                    >
                        {/* <StockChart productCode={productCode!} /> */}
                    </div>
                    {/* 주문 (매수, 매도) [로그인 시 열람 가능] */}
                    <div
                        id="stock-order"
                        className="flex-1 block-detail gray-hover flex flex-row gap-1 col-span-1 row-span-2 skeleton-box"
                    >
                        {/* <OrderSection productCode={productCode!} /> */}
                    </div>
                    {/* 호가 (채결 강도) [로그인 시 열람 가능] */}
                    <div
                        id="order-flow"
                        className="flex-1 block-detail gray-hover flex flex-row gap-1 col-span-1 row-span-2 skeleton-box"
                    >
                        {/* <Quote productCode={productCode!} /> */}
                    </div>
                    {/* 실시간 시세 */}
                    <div
                        id="real-time-quotes"
                        className="flex-1 block-detail gray-hover flex flex-row gap-1 col-span-2 skeleton-box"
                    >
                        {/* <LivePrice productCode={productCode!} /> */}
                    </div>
                </div>
            </MainLayout>
        );

    return (
        <MainLayout>
            <div className="w-full min-h-[calc(100dvh-96px)] px-10 py-4 pb-10 grid grid-flow-row grid-rows-[56px_360px_minmax(200px,1fr)] grid-cols-[minmax(280px,1fr)_minmax(280px,1fr)_minmax(280px,1fr)_minmax(280px,1fr)] gap-3 overflow-x-scroll">
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
                {/* 데이터 로딩을 거치기 때문에 productCode 타입을 string 형태로 단언 : productCode! */}

                {/* 차트 섹션 */}
                <div
                    id="stock-chart"
                    className="flex-1 block-detail gray-hover flex flex-row gap-1 col-span-2"
                >
                    {/* <StockChart productCode={productCode!} /> */}
                </div>
                {/* 주문 (매수, 매도) [로그인 시 열람 가능] */}
                <div
                    id="stock-order"
                    className="flex-1 block-detail gray-hover flex flex-row gap-1 col-span-1 row-span-2"
                >
                    {/* <OrderSection productCode={productCode!} /> */}
                </div>
                {/* 호가 (채결 강도) [로그인 시 열람 가능] */}
                <div
                    id="order-flow"
                    className="flex-1 block-detail gray-hover flex flex-row gap-1 col-span-1 row-span-2"
                >
                    {/* <Quote productCode={productCode!} /> */}
                </div>
                {/* 실시간 시세 */}
                <div
                    id="real-time-quotes"
                    className="flex-1 block-detail gray-hover flex flex-row gap-1 col-span-2"
                >
                    {/* <LivePrice productCode={productCode!} /> */}
                </div>
            </div>
        </MainLayout>
    );
};

export default DetailPage;
