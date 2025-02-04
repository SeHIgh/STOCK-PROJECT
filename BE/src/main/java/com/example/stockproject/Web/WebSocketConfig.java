package com.example.stockproject.Web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.client.WebSocketConnectionManager;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@EnableScheduling
public class WebSocketConfig implements WebSocketConfigurer {

    private final PriceStockSocketHandler priceStockSocketHandler;

    @Autowired
    public WebSocketConfig(PriceStockSocketHandler priceStockSocketHandler) {
        this.priceStockSocketHandler = priceStockSocketHandler;
    }

    // 클라이언트 WebSocket 연결 설정
    @Bean
    public WebSocketConnectionManager webSocketConnectionManager() {
        WebSocketConnectionManager connectionManager = new WebSocketConnectionManager(
                new StandardWebSocketClient(),
                priceStockSocketHandler,  // ✅ Spring이 관리하는 Bean 사용
                "ws://ops.koreainvestment.com:21000/tryitout/H0STCNT0"
        );

        connectionManager.setAutoStartup(true);
        return connectionManager;
    }

    // 서버 WebSocket 핸들러 등록
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(priceStockSocketHandler, "/live")
                .setAllowedOrigins("*");
    }
}
