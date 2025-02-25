package com.example.stockproject.controller;


import com.example.stockproject.Web.KospiSocketHandler;
import com.example.stockproject.Web.WebSocketConfig1;
import com.example.stockproject.Web.WebSocketConfig2;
import com.example.stockproject.Web.WebSocketConfig3;
import com.example.stockproject.dto.web.LiveDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebSocketController {
    private final WebSocketConfig1 webSocketConfig1;
    private final WebSocketConfig2 webSocketConfig2;
    private final WebSocketConfig3 webSocketConfig3;

    private final KospiSocketHandler kospiSocketHandler;
    @Autowired
    public WebSocketController(WebSocketConfig1 webSocketConfig, WebSocketConfig2 webSocketConfig2,
                               KospiSocketHandler kospiSocketHandler,
                               WebSocketConfig3 webSocketConfig3) {
        this.webSocketConfig1 = webSocketConfig;
        this.webSocketConfig2 = webSocketConfig2;
        this.kospiSocketHandler = kospiSocketHandler;   //만약 핸들러에서 실시간 정보를 프론트로 넘길 수 있다면, 컨트롤러에서 반환하지 않아도 되나?
        this.webSocketConfig3 = webSocketConfig3;
    }

    @GetMapping("/trade")   //한 종목에 들어갔을 떄, 매수 매도를 위한 실시간 체결가 정보 제공
    public String trade(){
        // /home에서 연결된 웹소켓 끊기
        webSocketConfig2.stopWebSocketConnection();
        //웹소켓 연결시도
        webSocketConfig1.webSocketConnectionManager().start();
        return "trade";     //html이동
    }

    @GetMapping("/home")   //메인화면에 필요한 실시간 체결가(KOSPI, KOSDAQ) 정보 제공
    public LiveDataDTO home(){
        // /trade에서 연결된 웹소켓 끊기
        webSocketConfig1.stopWebSocketConnection();

        //웹소켓 연결시도
        webSocketConfig2.webSocketConnectionManager().start();

        return kospiSocketHandler.getLatestStockData(); //DTO반환 -> 이렇게 하면 실시간 정보가 뜰 때 마다 반환하는 것인가? 처음에만 반환하는 것인가?
                                                        //=>처음에만 반환하는 것이기 떄문에 핸들러의 handleLiveData함수에서 프론트로 바로 json문자열 반환하는 것이 좋음.
    }

    @GetMapping("/notify")  //시장가 or 지정가 매수,매도 시 실시간 체결통보 정보 제공
    public String Notification(){
        webSocketConfig3.webSocketConnectionManager().start();
        return "notify";
    }
}
