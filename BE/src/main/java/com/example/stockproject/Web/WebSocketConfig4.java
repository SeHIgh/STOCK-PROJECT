package com.example.stockproject.Web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.client.WebSocketConnectionManager;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Component
@EnableWebSocket
@EnableScheduling
public class WebSocketConfig4 implements WebSocketConfigurer {

    private final AskingPriceSocketHandler askingPriceSocketHandler;
    private WebSocketConnectionManager connectionManager;

    @Autowired
    public WebSocketConfig4(AskingPriceSocketHandler askingPriceSocketHandler) {
        this.askingPriceSocketHandler = askingPriceSocketHandler;
    }

    // 서버 WebSocket 핸들러 등록
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(askingPriceSocketHandler, "/asdf")
                .setAllowedOrigins("*");
    }

    // 클라이언트 WebSocket 연결 [수동] 설정
    public WebSocketConnectionManager webSocketConnectionManager() {
        connectionManager = new WebSocketConnectionManager(
                new StandardWebSocketClient(),
                askingPriceSocketHandler,  // ✅ Spring이 관리하는 Bean 사용
                "ws://ops.koreainvestment.com:31000"
        );

        connectionManager.setAutoStartup(false);    //자동 연결을 막음.
        return connectionManager;
    }

    //연결 종료 메서드 추가
    public void stopWebSocketConnection(){
        if(connectionManager != null){
            connectionManager.stop();
        }
    }
}
