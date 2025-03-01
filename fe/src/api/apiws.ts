import { useState, useEffect } from "react";

import { LivePriceProps } from "../types";
import { fetchStockLivePrice } from "./api";
import useWebSocket from "../hooks/useWebSocket";

const useLiveStockPrice = (stockName: string) => {
    const [stockLive, setStockLive] = useState<LivePriceProps[]>([]);

    // WebSocket을 통해 실시간 데이터 수신
    const { data: wsData, isConnected } = useWebSocket(
        `ws://localhost:8090/live?stockName=${stockName}`
    );

    // 최초 마운트 시 REST API로 초기 데이터 가져오기
    useEffect(() => {
        const loadStockLive = async () => {
            try {
                const response = await fetchStockLivePrice(stockName);
                setStockLive(response);
            } catch (error) {
                console.error("⛔ 실시간 시세 초기 데이터 로딩 실패", error);
            }
        };
        loadStockLive();
    }, [stockName]);

    // WebSocket으로 받은 데이터를 기존 데이터와 병합하지 않고 그대로 대체
    useEffect(() => {
        if (wsData) {
            try {
                const parsedData: LivePriceProps[] = JSON.parse(wsData);
                setStockLive(parsedData); // 기존 데이터 덮어쓰기
            } catch (error) {
                console.error("⛔ WebSocket 데이터 파싱 실패 - 실시간 시세", error);
            }
        }
    }, [wsData]);

    return { stockLive, isConnected };
};

export default useLiveStockPrice;
