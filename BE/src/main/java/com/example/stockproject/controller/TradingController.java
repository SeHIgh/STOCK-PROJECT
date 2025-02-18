package com.example.stockproject.controller;

import com.example.stockproject.dto.order.OrderRequest;
import com.example.stockproject.dto.order.OrderResponseOutput;
import com.example.stockproject.service.StockOrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
public class TradingController {
    private static final Logger logger = LoggerFactory.getLogger(TradingController.class);

    private StockOrderService stockOrderService;

    public TradingController(StockOrderService stockOrderService) {
        this.stockOrderService = stockOrderService;
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