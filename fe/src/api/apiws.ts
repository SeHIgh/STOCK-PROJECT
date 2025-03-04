import { useState, useEffect } from "react";
import {
    LiveQuoteInfoProps,
    LiveTradingInfoProps,
    TradeNotifyProps,
} from "../types";
import { fetchLiveQuoteInfo, fetchLiveTradingInfo } from "./api";
import useWebSocket from "../hooks/useWebSocket";

// WebSocket 데이터 타입 정의
export interface WebSocketMessage<T extends string, D> {
    type: T;
    data: D;
}

type TradeInfoMessage = WebSocketMessage<"tradeInfo", LiveTradingInfoProps[]>;
type QuoteInfoMessage = WebSocketMessage<"quoteInfo", LiveQuoteInfoProps>;
type wsQuoteData = TradeInfoMessage | QuoteInfoMessage;

export const useQuoteInfo = (stockName: string) => {
    const [tradeInfo, setTradeInfo] = useState<LiveTradingInfoProps[] | null>(null);
    const [quoteInfo, setQuoteInfo] = useState<LiveQuoteInfoProps | null>(null);

    // WebSocket 데이터 수신
    const { data: wsData, isConnected } = useWebSocket<wsQuoteData>(
        `ws://localhost:8090/trading?stockName=${stockName}`
    );

    // 초기 데이터 가져오기 (REST API)
    useEffect(() => {
        const loadTradeInfo = async () => {
            try {
                const response1 = await fetchLiveTradingInfo(stockName);
                setTradeInfo(response1);
            } catch (error) {
                console.error("⛔ 체결가 초기 데이터 로딩 실패", error);
            }

            try {
                const response2 = await fetchLiveQuoteInfo(stockName);
                setQuoteInfo(response2);
            } catch (error) {
                console.error("⛔ 호가 초기 데이터 로딩 실패", error);
            }
        };
        loadTradeInfo();
    }, [stockName]);

    // WebSocket 데이터 반영
    useEffect(() => {
        if (!wsData) return;

        switch (wsData.type) {
            case "tradeInfo":
                setTradeInfo(wsData.data);
                break;
            case "quoteInfo":
                setQuoteInfo(wsData.data);
                break;
        }
    }, [wsData]);

    return { tradeInfo, quoteInfo, isConnected };
};

type NotifyInfoMessage = WebSocketMessage<"notifyInfo", TradeNotifyProps>;

export const useTradeNotify = () => {
    const [tradeNotify, setTradeNotify] = useState<TradeNotifyProps | null>(null);

    // WebSocket 연결
    const { data: wsData, isConnected } = useWebSocket<NotifyInfoMessage>(
        `ws://localhost:8090/tradeNotify`
    );

    useEffect(() => {
        if (wsData?.type === "notifyInfo") {
            setTradeNotify(wsData.data);
        }
    }, [wsData]);

    return { tradeNotify, isConnected };
};