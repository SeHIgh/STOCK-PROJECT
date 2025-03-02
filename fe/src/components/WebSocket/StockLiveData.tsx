import React from "react";
import useWebSocket from "../../hooks/useWebSocket";

const StockLiveData: React.FC = () => {
    const { data, isConnected } = useWebSocket("ws://localhost:8090/live");

    return (
        <div className="test-component">
            <h2 className="text-xl font-bold">📊 실시간 체결가</h2>
            <p className="mt-2 text-base">
                {isConnected
                    ? data
                        ? `💹 ${data}`
                        : "데이터 수신 중..."
                    : "❌ 연결 안 됨"}
            </p>
        </div>
    );
};

export default StockLiveData;
