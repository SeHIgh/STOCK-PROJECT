import { useState, useEffect, useRef } from "react";
import {
    LiveQuoteInfoProps,
    LiveTradingInfoProps,
    TradeNotifyProps,
} from "../types";
import { fetchLiveQuoteInfo, fetchLiveTradingInfo } from "./api";
import useWebSocket from "../hooks/useWebSocket";
import { isLocalMode } from "../utils/\bglobalFunc";

// WebSocket 데이터 타입 정의
export interface WebSocketMessage<T extends string, D> {
    type: T;
    data: D;
}

type TradeInfoMessage = WebSocketMessage<"tradeInfo", LiveTradingInfoProps>;
type QuoteInfoMessage = WebSocketMessage<"quoteInfo", LiveQuoteInfoProps>;
type wsQuoteData = TradeInfoMessage | QuoteInfoMessage;

// export const useQuoteInfo = (stockName: string) => {
//     const [tradeInfo, setTradeInfo] = useState<LiveTradingInfoProps | null>(
//         null
//     );
//     const [quoteInfo, setQuoteInfo] = useState<LiveQuoteInfoProps | null>(null);

//     // WebSocket 데이터 수신
//     const { data: wsData, isConnected } = useWebSocket<wsQuoteData>(
//         `ws://localhost:8090/live?stockName=${stockName}`
//     );

//     useEffect(() => {
//         if (isLocalMode) {
//             // ✅ 로컬 모드일 때는 REST API를 통해 초기 데이터 가져오기
//             const loadTradeInfo = async () => {
//                 try {
//                     const response1 = await fetchLiveTradingInfo(stockName);
//                     setTradeInfo(response1);
//                 } catch (error) {
//                     console.error("⛔ 체결가 초기 데이터 로딩 실패", error);
//                 }

//                 try {
//                     const response2 = await fetchLiveQuoteInfo(stockName);
//                     setQuoteInfo(response2);
//                 } catch (error) {
//                     console.error("⛔ 호가 초기 데이터 로딩 실패", error);
//                 }
//             };
//             loadTradeInfo();
//         }
//     }, [stockName, isLocalMode]);

//     // WebSocket 데이터 반영
//     useEffect(() => {
//         if (isLocalMode || !wsData) return;

//         switch (wsData.type) {
//             case "tradeInfo":
//                 setTradeInfo(wsData.data);
//                 break;
//             case "quoteInfo":
//                 setQuoteInfo(wsData.data);
//                 break;
//         }
//     }, [wsData, isLocalMode]);

//     return { tradeInfo, quoteInfo, isConnected };
// };

// 로컬 모드에 따른 초기 데이터 로딩 및 WebSocket 데이터 수신 분기 처리
export const useQuoteInfo = (stockName: string) => {
    const [tradeInfo, setTradeInfo] = useState<LiveTradingInfoProps | null>(
        null
    );
    const [quoteInfo, setQuoteInfo] = useState<LiveQuoteInfoProps | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // WebSocket 데이터 수신 (isLocalMode가 false일 때만 실행)
    const wsData = useRef<wsQuoteData | null>(null);

    useEffect(() => {
        if (isLocalMode) {
            // ✅ 로컬 모드일 때는 REST API를 통해 초기 데이터 가져오기
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
        } else {
            // ✅ WebSocket을 통한 실시간 데이터 수신
            const ws = new WebSocket(
                `ws://localhost:8090/live?stockName=${stockName}`
            );

            ws.onopen = () => {
                setIsConnected(true);
                console.log("✅ WebSocket 연결 성공");
            };

            ws.onmessage = (event) => {
                const data: wsQuoteData = JSON.parse(event.data);
                wsData.current = data;

                switch (data.type) {
                    case "tradeInfo":
                        setTradeInfo(data.data);
                        break;
                    case "quoteInfo":
                        setQuoteInfo(data.data);
                        break;
                }
            };

            ws.onerror = (error) => {
                console.error("⛔ WebSocket 오류 발생", error);
            };

            ws.onclose = () => {
                setIsConnected(false);
                console.log("🔴 WebSocket 연결 종료");
            };

            return () => ws.close();
        }
    }, [stockName, isLocalMode]);

    return { tradeInfo, quoteInfo, isConnected };
};

type NotifyInfoMessage = WebSocketMessage<"notifyInfo", TradeNotifyProps>;

export const useTradeNotify = () => {
    const [tradeNotify, setTradeNotify] = useState<TradeNotifyProps | null>(
        null
    );

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
