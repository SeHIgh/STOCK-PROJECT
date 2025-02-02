package com.example.stockproject.Web;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.client.WebSocketConnectionManager;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
//import org.springframework.web.socket.client.WebSocketClient;

//@Configuration
//@EnableWebSocket
//public class WebSocketConfig implements WebSocketConfigurer {
//
//    @Value("${websocket.approval-key}")
//    private String approvalKey;
//
//    @Value("${websocket.tr-key}")
//    private String trKey;
//
//
//    @Override
//    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//
//        //웹소켓 Request를 보낼때 필요한 객체
//        WebSocketClient webSocketClient = new StandardWebSocketClient();
//
//        //응답받았을때 메세지를 처리해줄 Handler 생성 후 WebSocketConnectionManager에 넣음.
//        WebSocketConnectionManager connectionManager = new WebSocketConnectionManager
//                (webSocketClient,
//                        new PriceStockSocketHandler(approvalKey, trKey),
//                        "ws://ops.koreainvestment.com:21000/tryitout/H0STASP0");
//
//        connectionManager.setAutoStartup(true); // 애플리케이션 시작 시 자동 연결 설정
//        connectionManager.start(); // WebSocket 연결 시작
//    }
//}
//
@Configuration
@EnableWebSocket
@EnableScheduling
public class WebSocketConfig implements WebSocketConfigurer {

    @Value("${websocket.approval-key}")
    private String approvalKey;

    @Value("${websocket.tr-key}")
    private String trKey;

    //clinet
    @Bean
    public WebSocketConnectionManager webSocketConnectionManager() {
        WebSocketClient webSocketClient = new StandardWebSocketClient();

        WebSocketConnectionManager connectionManager = new WebSocketConnectionManager(
                webSocketClient,
                new PriceStockSocketHandler(approvalKey, trKey),        // 핸들러 등록
                "ws://ops.koreainvestment.com:21000/tryitout/H0STASP0"  //실시간 호가 api
        );

        connectionManager.setAutoStartup(true); // 애플리케이션 시작 시 자동 연결
        return connectionManager; // Spring이 관리하도록 Bean으로 등록
    }


    //server
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new PriceStockSocketHandler(approvalKey, trKey), "/live")
                .setAllowedOrigins("*");
    }
}