// 호가창 (체결 강도, 로그인 필요)
interface StockProps{
    stockId: string;
}

const OrderBook: React.FC<StockProps> = ({ stockId }) => {
    return (
        <div className="p-4 border rounded-lg shadow mt-4">
            <h2 className="text-xl font-semibold">호가 (체결 강도)</h2>
            <p>종목 ID: {stockId}</p>
        </div>
    );
};

export default OrderBook;