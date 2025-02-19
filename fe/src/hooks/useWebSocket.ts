import { useEffect, useState, useRef } from "react";

const useWebSocket = (url: string) => {
    const [data, setData] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("✅ WebSocket 연결됨:", url);
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            console.log("📩 실시간 데이터 수신:", event.data);
            setData(event.data);
        };

        socket.onerror = (error) => {
            console.error("❌ WebSocket 오류:", error);
        };

        socket.onclose = () => {
            console.log("❌ WebSocket 연결 종료");
            setIsConnected(false);
        };

        return () => {
            socket.close();
        };
    }, [url]);

    return { data, isConnected };
};

export default useWebSocket;
