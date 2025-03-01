package com.example.stockproject.controller;


import com.example.stockproject.Web.*;
import com.example.stockproject.dto.StockInfo;
import com.example.stockproject.dto.web.LiveDataDTO;
import com.example.stockproject.repository.StockInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RequiredArgsConstructor
@RestController
public class WebSocketController {
    private final WebSocketConfig1 webSocketConfig1;
    private final WebSocketConfig2 webSocketConfig2;
    private final WebSocketConfig3 webSocketConfig3;
    private final WebSocketConfig4 webSocketConfig4;

    private final KospiSocketHandler kospiSocketHandler;

    private final StockInfoRepository stockInfoRepository;
    private final PriceStockSocketHandler priceStockSocketHandler;


    //실시간 체결가 정보는 TradingController에서 매수&매도 가능정보반환 과 같이 구현
    //url 같이 사용.
//
//    //TradingController의 /trading과 겹쳐서 오류가 나옴. 이름을 달리 해야함...
//    @GetMapping("/web/trading")   //한 종목에 들어갔을 떄, 매수 매도를 위한 실시간 체결가 정보 제공
//    public String trade(@RequestParam String stockName){
//        Optional<StockInfo> stockInfo = stockInfoRepository.findByStockName(stockName);
//
//        String stockCode = stockInfo.get().getStockCode();//stockCode;
//        priceStockSocketHandler.setTrKey(stockCode);
//
//        webSocketConfig2.stopWebSocketConnection();
//        //웹소켓 연결시도
//        webSocketConfig1.webSocketConnectionManager().start();
//        return "trade";     //html이동
//    }

    //코스피와 코스닥 정보도 웹크롤링으로 구현했기에 사용x
//
//    @GetMapping("/home")   //메인화면에 필요한 실시간 체결가(KOSPI, KOSDAQ) 정보 제공
//    public LiveDataDTO home(){
//        // /trade에서 연결된 웹소켓 끊기
//        webSocketConfig1.stopWebSocketConnection();
//
//        //웹소켓 연결시도
//        webSocketConfig2.webSocketConnectionManager().start();
//
//        return kospiSocketHandler.getLatestStockData(); //DTO반환 -> 이렇게 하면 실시간 정보가 뜰 때 마다 반환하는 것인가? 처음에만 반환하는 것인가?
//                                                        //=>처음에만 반환하는 것이기 떄문에 핸들러의 handleLiveData함수에서 프론트로 바로 json문자열 반환하는 것이 좋음.
//    }

    @GetMapping("/notify")  //시장가 or 지정가 매수,매도 시 실시간 체결통보 정보 제공
    public String Notification(){
        webSocketConfig3.webSocketConnectionManager().start();
        return "notify";
    }

    @GetMapping("/web/askingprice")  //시장가 or 지정가 매수,매도 시 실시간 체결통보 정보 제공
    public String getAskingPrice(){
        webSocketConfig4.webSocketConnectionManager().start();
        return "asking price";
    }

}
