import axios from "axios";
import { useEffect, useState } from "react";

// 주문 컴포넌트 (매수/매도, 로그인 필요)
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

const Quote: React.FC<Pick<StockProps, "productCode">> = ({ productCode }) => {
    const [orderFlow, setOrderFlow] = useState([]);

    useEffect(() => {
        const fetchOrderFlow = async () => {
            try {
                const response = await axios.get(
                    `/api/order-flow/${productCode}`
                );
                setOrderFlow(response.data);
            } catch (error) {
                console.error("호가 데이터를 가져오는 중 오류 발생:", error);
            }
        };

        fetchOrderFlow();

        // 실시간 업데이트를 위해 5초마다 데이터 갱신
        const intervalId = setInterval(fetchOrderFlow, 5000);

        // 컴포넌트 언마운트 시 인터벌 정리
        return () => clearInterval(intervalId);
    }, [productCode]);
    return (
        <>
            <h2 className="text-lg font-semibold">호가</h2>
            <table>
                <thead>
                    <tr>
                        <th>가격</th>
                        <th>수량</th>
                    </tr>
                </thead>
                <tbody>
                    {orderFlow.map((order, index) => (
                        <tr key={index}>
                            {/* <td>{order.price}</td>
                            <td>{order.quantity}</td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default Quote;
