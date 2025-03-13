package com.example.stockproject.Web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.client.WebSocketConnectionManager;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer{
    private final LiveDataSocketHandler liveDataSocketHandler;
    private WebSocketConnectionManager connectionManager;

    @Autowired
    public WebSocketConfig(LiveDataSocketHandler liveDataSocketHandler) {
        this.liveDataSocketHandler = liveDataSocketHandler;
    }

    // 서버 WebSocket 핸들러 등록
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(liveDataSocketHandler, "/live")
                .setAllowedOrigins("*");
    }

    @Bean
    public WebSocketConnectionManager webSocketConnectionManager() {
        if (connectionManager == null) { // ✅ 기존 연결이 없을 때만 생성
            connectionManager = new WebSocketConnectionManager(
                    new StandardWebSocketClient(),
                    liveDataSocketHandler,
                    "ws://ops.koreainvestment.com:31000"
            );
            connectionManager.setAutoStartup(false); // 수동 연결 관리
        }
        return connectionManager;
    }

    public void stopWebSocketConnection() {
        if (connectionManager != null) {
            connectionManager.stop();
            connectionManager = null;  // ✅ 연결 종료 후 초기화
        }
    }
}
