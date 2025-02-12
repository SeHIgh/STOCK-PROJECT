// 차트 컴포넌트
interface StockProps {
    stockId: string;
}

const StockChart: React.FC<StockProps> = ({ stockId }) => {
    return (
        <div className="p-4 border rounded-lg shadow mt-4">
            <h2 className="text-xl font-semibold">차트</h2>
            <p>종목 ID: {stockId}</p>
        </div>
    );
};

export default StockChart;
