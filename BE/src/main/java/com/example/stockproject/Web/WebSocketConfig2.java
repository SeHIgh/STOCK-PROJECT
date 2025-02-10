package com.example.stockproject.Web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.client.WebSocketConnectionManager;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@EnableScheduling
public class WebSocketConfig2 implements WebSocketConfigurer {
    private final KospiSocketHandler kospiSocketHandler;
    private WebSocketConnectionManager connectionManager;

    @Autowired
    public WebSocketConfig2(KospiSocketHandler kospiSocketHandler) {
        this.kospiSocketHandler = kospiSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {

    }

    // 클라이언트 WebSocket 연결 [수동] 설정
    public WebSocketConnectionManager webSocketConnectionManager() {
        connectionManager = new WebSocketConnectionManager(
                new StandardWebSocketClient(),
                kospiSocketHandler,  // ✅ Spring이 관리하는 Bean 사용
                "ws://ops.koreainvestment.com:21000//tryitout/H0UPCNT0"
        );

        connectionManager.setAutoStartup(false);    //자동 연결을 막음.
        return connectionManager;
    }

    //연결 종료 메서드 추가
    public void stopWebSocketConnection() {
        if(connectionManager != null){
            connectionManager.stop();
        }
    }
}
