package com.example.stockproject.controller;

import com.example.stockproject.Web.PriceStockSocketHandler;
import com.example.stockproject.Web.WebSocketConfig1;
import com.example.stockproject.dto.StockInfo;
import com.example.stockproject.dto.order.TradePossibleDTO;
import com.example.stockproject.dto.order.OrderRequest;
import com.example.stockproject.dto.order.OrderResponseOutput;
import com.example.stockproject.repository.StockInfoRepository;
import com.example.stockproject.service.StockOrderService;
import com.example.stockproject.service.TradeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;

@RestController
public class TradingController {
    private static final Logger logger = LoggerFactory.getLogger(TradingController.class);
    private final TradeService tradeService;
    private final PriceStockSocketHandler priceStockSocketHandler;
    private final StockOrderService stockOrderService;
    private final StockInfoRepository stockInfoRepository;
    private final WebSocketConfig1 webSocketConfig1;

    public TradingController(StockOrderService stockOrderService, TradeService tradeService, PriceStockSocketHandler priceStockSocketHandler,
                             StockInfoRepository stockInfoRepository,
                             WebSocketConfig1 webSocketConfig1) {
        this.stockOrderService = stockOrderService;
        this.tradeService = tradeService;
        this.priceStockSocketHandler = priceStockSocketHandler;
        this.stockInfoRepository = stockInfoRepository;
        this.webSocketConfig1 = webSocketConfig1;
    }

    //주식 매수 주문
    @PostMapping("/trading/buy")
    public Mono<List<OrderResponseOutput>> buyStock(@RequestBody OrderRequest orderRequest){
        logger.debug("🔴매수 Order Request: {}", orderRequest);
        return stockOrderService.buyStock(orderRequest);
    }

    @PostMapping("/trading/sell")
    public Mono<List<OrderResponseOutput>> sellStock(@RequestBody OrderRequest orderRequest){
        logger.debug("🔵매도 Order Request: {}", orderRequest);
        return stockOrderService.sellStock(orderRequest);
    }


    // http://localhost:8090/trading?stockName=삼성전자
    //실시간 체결가 웹소켓 통신 & 매수&매도 가능정보 반환 (+실시간 호가 웹소켓통신)
    @GetMapping("/api/trading")
    public Mono<TradePossibleDTO> tradeStock(@RequestParam String stockName){
        logger.info("📌 거래 시 필요 정보 - 종목명: {}", stockName);

        Optional<StockInfo> stockInfo = stockInfoRepository.findByStockName(stockName);
        String stockCode = stockInfo.get().getStockCode();//stockCode;
        priceStockSocketHandler.setTrKey(stockCode);

        //웹소켓 연결시도
        webSocketConfig1.webSocketConnectionManager().start();

        return tradeService.getTradeInfo(stockName);
    }
}

/*
post시 body값에 이렇게 입력해야함.
@RequestBody 애너테이션이 이 값을 OrderRequest객체로 변환

{
  "cano": "50124326",
  "acntPrdtCd": "01",
  "pdno": "000660",
  "ordDvsn": "00",
  "ordQty": "10",
  "ordUnpr": "206000"
}
 */