package com.example.stockproject.Web;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.socket.client.StandardWebSocketClient;
import org.springframework.web.reactive.socket.client.WebSocketClient;
import org.springframework.web.socket.client.WebSocketConnectionManager;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
//import org.springframework.web.socket.client.WebSocketClient;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Value("${websocket.approval-key}")
    private String approvalKey;

    @Value("${websocket.tr-key}")
    private String trKey;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {

        //webSocket Request를 보낼때 필요한 객체
        WebSocketClient webSocketClient = new StandardWebSocketClient();

        //응답받았을때 메세지를 처리해줄 Handler 생성 후 WebSocketConnectionManager에 넣음.
        WebSocketConnectionManager connectionManager = new WebSocketConnectionManager
                ((org.springframework.web.socket.client.WebSocketClient) webSocketClient,
                        new PriceStockSocketHandler(approvalKey, trKey),
                        "asd");

        connectionManager.setAutoStartup(true);
        connectionManager.start();
    }
}
