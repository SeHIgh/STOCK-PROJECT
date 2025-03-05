import React from "react";
import { useTradeNotify } from "../../hooks/useTradeNotify";

const TradeNotifyComponent = () => {
    const { tradeNotify, isConnected } = useTradeNotify();

    return (
        <div>
            <h2>실시간 체결 알람</h2>
            {isConnected ? (
                tradeNotify ? (
                    <div>
                        <p>
                            종목명: {tradeNotify.stockName} (
                            {tradeNotify.stockCode})
                        </p>
                        <p>
                            주문 유형: {tradeNotify.orderType} (
                            {tradeNotify.orderKind})
                        </p>
                        <p>
                            체결 수량: {tradeNotify.executedQuantity} /{" "}
                            {tradeNotify.orderQuantity}
                        </p>
                        <p>체결 가격: {tradeNotify.executedPrice} 원</p>
                        <p>체결 상태: {tradeNotify.executionStatus}</p>
                        <p>체결 시간: {tradeNotify.timestamp}</p>
                    </div>
                ) : (
                    <p>체결 데이터 없음</p>
                )
            ) : (
                <p>WebSocket 연결 안됨</p>
            )}
        </div>
    );
};

export default TradeNotifyComponent;
