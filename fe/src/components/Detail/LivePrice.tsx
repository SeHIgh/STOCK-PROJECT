// 실시간 시세 컴포넌트
interface StockProps{
    stockId: string;
}

const LivePrice: React.FC<StockProps> = ({ stockId }) => {
    return (
        <div className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold">실시간 시세</h2>
            <p>종목 ID: {stockId}</p>
        </div>
    );
};

export default LivePrice;