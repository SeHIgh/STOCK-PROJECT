import { useState, useEffect } from "react";
import useWebSocket from "../hooks/useWebSocket";
import { TradeNotifyProps } from "../types";

export const useTradeNotify = () => {
    const [tradeNotify, setTradeNotify] = useState<TradeNotifyProps | null>(
        null
    );

    // WebSocket 연결
    const { data: wsData, isConnected } = useWebSocket(
        `ws://localhost:8090/tradeNotify`
    );

    useEffect(() => {
        if (wsData !== null) {
            try {
                const parsedData = JSON.parse(wsData);
                if (parsedData.type === "notifyInfo") {
                    setTradeNotify(parsedData.data);
                }
            } catch (error) {
                console.error(
                    "⛔ WebSocket 데이터 파싱 실패 - 체결 통보 알람",
                    error
                );
            }
        }
    }, [wsData]);

    return { tradeNotify, isConnected };
};
