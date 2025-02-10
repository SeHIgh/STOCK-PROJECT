package com.example.stockproject.controller;


import com.example.stockproject.Web.WebSocketConfig1;
import com.example.stockproject.Web.WebSocketConfig2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebSocketController {
    private final WebSocketConfig1 webSocketConfig1;
    private final WebSocketConfig2 webSocketConfig2;

    @Autowired
    public WebSocketController(WebSocketConfig1 webSocketConfig, WebSocketConfig2 webSocketConfig2) {
        this.webSocketConfig1 = webSocketConfig;
        this.webSocketConfig2 = webSocketConfig2;
    }

    @GetMapping("/trade")   //한 종목에 들어갔을 떄, 매수 매도를 위한 실시간 체결가 정보 제공
    public String trade(){
        // /home에서 연결된 웹소켓 끊기
        webSocketConfig2.stopWebSocketConnection();
        //웹소켓 연결시도
        webSocketConfig1.webSocketConnectionManager().start();
        return "trade";
    }

    @GetMapping("/home")   //한 종목에 들어갔을 떄, 매수 매도를 위한 실시간 체결가 정보 제공
    public String home(){
        // /trade에서 연결된 웹소켓 끊기
        webSocketConfig1.stopWebSocketConnection();

        //웹소켓 연결시도
        webSocketConfig2.webSocketConnectionManager().start();
        return "home";
    }
}
