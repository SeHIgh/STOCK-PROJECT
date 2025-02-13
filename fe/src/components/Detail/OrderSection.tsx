// import axios from "axios";

// 호가창 (체결 강도, 로그인 필요)
interface StockPrice {
    priceType: "MARKET" | string;
    base: number;
    close: number;
    marketVolume: number;
    marketAmount: number;
    open?: number;
    high?: number;
    low?: number;
}

interface StockProps {
    productCode: string;
    name: string;
    logoImageUrl: string;
    price: StockPrice;
    date?: string;
}

const OrderSection: React.FC<Pick<StockProps, "productCode">> = ({
    productCode,
}) => {
    // // 주문 목록 가져오기
    // const fetchOrders = async () => {
    //     try {
    //         const response = await axios.get("/api/orders");
    //         // response.data를 상태로 설정
    //     } catch (error) {
    //         console.error("주문 목록을 가져오는 중 오류 발생:", error);
    //     }
    // };

    // // 새로운 주문 제출
    // const submitOrder = async (orderData) => {
    //     try {
    //         const response = await axios.post("/api/orders", orderData);
    //         // 주문 제출 후 필요한 처리
    //     } catch (error) {
    //         console.error("주문 제출 중 오류 발생:", error);
    //     }
    // };

    return (
        <>
            <h2 className="text-lg font-semibold">주문하기</h2>
            <div>
                <button className="bg-green-400/50 text-white px-4 py-2 rounded mr-2">
                    매수
                </button>
                <button className="bg-red-400/50 text-white px-4 py-2 rounded">
                    매도
                </button>
            </div>
        </>
    );
};

export default OrderSection;
