// 주문 컴포넌트 (매수/매도, 로그인 필요)
interface StockProps {
    stockId: string;
}

const OrderSection: React.FC<StockProps> = ({ stockId }) => {
    return (
        <div className="p-4 border rounded-lg shadow mt-4">
            <h2 className="text-xl font-semibold">주문</h2>
            <p>종목 ID: {stockId}</p>
            <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                매수
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">
                매도
            </button>
        </div>
    );
};

export default OrderSection;
