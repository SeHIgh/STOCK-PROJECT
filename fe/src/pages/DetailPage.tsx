import { useParams } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import LivePrice from "../components/Detail/LivePrice";
import StockChart from "../components/Detail/StockChart";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import OrderSection from "../components/Detail/OrderSection";
import Quote from "../components/Detail/Quote";

// 250213 최신화 (토스증권 실시간 차트 json 반영)
interface StockPrice {
    priceType: "MARKET" | string;
    base: number;
    close: number;
    baseKrw?: number | null;
    closeKrw?: number | null;
    marketVolume: number;
    marketAmount: number;
}

interface StockProps {
    productCode: string;
    name: string;
    logoImageUrl: string;
    price: StockPrice;
}

const DetailPage = () => {
    const { productCode } = useParams<{ productCode: string }>();
    const [stockData, setStockData] = useState<StockProps>(); // 주식 데이터 저장 할 변수

    const getData = useCallback(async () => {
        try {
            const response = await axios.get<StockProps[]>(
                `http://localhost:3000/stock_list?productCode=${productCode}`
                // "/api/v1/dashboard/wts/overview/indicator/index?market=kr"
            );
            setStockData(response.data[0]);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(
                    error.response?.data?.message || "서버 연결이 불안정합니다."
                );
            } else {
                console.error("알 수 없는 오류가 발생했습니다.");
            }
        }
    }, [productCode]);

    console.log("토스 환율 API :", stockData);

    useEffect(() => {
        if (productCode) getData(); // productCode가 있을 때만 실행
    }, [productCode, getData]); // productCode가 변경될 때마다 실행

    // 데이터 로딩 중 화면
    if (!stockData) return <p>Loading...</p>;

    console.log("조회 데이터 :", stockData);

    return (
        <MainLayout>
            <div className="w-full min-h-[calc(100dvh-96px)] px-10 py-4 pb-10 grid grid-flow-row grid-rows-[56px_360px_minmax(200px,1fr)] grid-cols-[minmax(280px,1fr)_minmax(280px,1fr)_minmax(280px,1fr)_minmax(280px,1fr)] gap-3 overflow-x-scroll">
                <div className="flex flex-row items-center gap-3 col-span-3">
                    <img
                        src={stockData.logoImageUrl}
                        alt={stockData.name}
                        className="w-14 h-14 rounded-xl"
                    />
                    <div className="flex flex-col justify-around">
                        <h1 className="text-base font-bold">
                            {stockData?.name}{" "}
                            <span className="text-gray-400 font-semibold">
                                {stockData?.productCode}
                            </span>
                        </h1>
                        <h1 className="text-2xl font-bold">
                            {stockData?.price.base.toLocaleString()}원{"  "}
                            <span className="text-base text-gray-500 font-medium">
                                어제보다{" "}
                            </span>
                            {"  "}
                            <span
                                className={`text-base font-semibold ${
                                    stockData?.price.base -
                                        stockData?.price.close >
                                    0
                                        ? "text-red-400"
                                        : "text-blue-400"
                                }`}
                            >
                                {stockData?.price.base -
                                    stockData?.price.close >
                                0
                                    ? "+"
                                    : ""}
                                {(
                                    stockData?.price.base -
                                    stockData?.price.close
                                ).toLocaleString()}
                                원(
                                {Math.abs(
                                    ((stockData?.price.base -
                                        stockData?.price.close) /
                                        stockData?.price.base) *
                                        100
                                ).toFixed(2)}
                                %)
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
                    <StockChart productCode={productCode!} />
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
