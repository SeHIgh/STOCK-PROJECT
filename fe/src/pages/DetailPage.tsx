import { useParams } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import LivePrice from "../components/Detail/LivePrice";
import StockChart from "../components/Detail/StockChart";
import OrderSection from "../components/Detail/OrderSection";
import OrderBook from "../components/Detail/OrderBook";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const DetailPage = () => {
    const { stockId } = useParams<{ stockId: string }>();
    const [stockData, setStockData] = useState<StockData | null>(null); // 주식 데이터 저장 할 변수

    interface StockData {
        표준코드: string;
        단축코드: string;
        "한글 종목명": string;
        "한글 종목약명": string;
        "영문 종목명": string;
        상장일: string;
        시장구분: string;
        증권구분: string;
        소속부: string;
        주식종류: string;
        액면가: string;
        상장주식수: string;
    }

    const getData = useCallback(async () => {
        try {
            const response = await axios.get<StockData[]>(
                `http://localhost:3000/kospi_list?단축코드=${stockId}`
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
    },[stockId]);

    useEffect(() => {
        if (stockId) getData(); // stockId가 있을 때만 실행
    }, [stockId, getData]); // stockId가 변경될 때마다 실행

    // 데이터 로딩 중 화면
    if (!stockData) return <p>Loading...</p>;

    console.log(stockData);

    return (
        <MainLayout>
            <div className="p-4">
                <h1 className="text-2xl font-bold">
                    {stockData?.["한글 종목약명"]}
                </h1>
                {/* 데이터 로딩을 거치기 때문에 stockId 타입을 string 형태로 단언 : stockId! */}
                <LivePrice stockId={stockId!} />
                <StockChart stockId={stockId!} />
                <OrderSection stockId={stockId!} />
                <OrderBook stockId={stockId!} />
            </div>
        </MainLayout>
    );
};

export default DetailPage;
