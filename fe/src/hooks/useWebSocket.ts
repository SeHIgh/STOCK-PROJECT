import { useEffect, useState, useRef } from "react";

const useWebSocket = <T>(url: string, reconnectInterval = 5000) => {
    // 5초마다 재연결 시도
    const [data, setData] = useState<T | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connectWebSocket = () => {
        if (socketRef.current) return; // 기존 연결이 있으면 새로 연결하지 않음.

        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("✅ WebSocket 연결됨:", url);
            setIsConnected(true);
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };

        socket.onmessage = (event) => {
            try {
                const parsedData: T = JSON.parse(event.data);
                console.log("📩 실시간 데이터 수신:", parsedData);
                setData(parsedData);
            } catch (error) {
                console.error("⛔ WebSocket 데이터 파싱 실패", error);
            }
        };

        socket.onerror = (error) => {
            console.error("❌ WebSocket 오류:", error);
        };

        socket.onclose = () => {
            console.log("❌ WebSocket 연결 종료");
            setIsConnected(false);
            socketRef.current = null; // 연결이 닫히면 ref 초기화

            // 일정 시간 후 자동 재연결 (연결이 강제 종료된 경우)
            reconnectTimeoutRef.current = setTimeout(
                connectWebSocket,
                reconnectInterval
            );
        };
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [url]);

    return { data, isConnected };
};

export default useWebSocket;
