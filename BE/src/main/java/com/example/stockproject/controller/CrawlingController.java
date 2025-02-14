package com.example.stockproject.controller;

import com.example.stockproject.service.Crawling.ExchangeRateService;
import com.example.stockproject.service.Crawling.OverseasStockService;
import org.openqa.selenium.WebDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

//현재 페이지 이동 시, 크롤링이 종료가 안됨.
//초기 URL을 컨트롤러의 전역으로 설정하고, 이를 비교하는 형식으로 해야하나?

@RestController
public class CrawlingController {

    private final ExchangeRateService exchangeRateService;
    private final OverseasStockService overseasStockService;

    @Autowired
    public CrawlingController(ExchangeRateService exchangeRateService, OverseasStockService overseasStockService) {
        this.exchangeRateService = exchangeRateService;
        this.overseasStockService = overseasStockService;
    }

    @GetMapping("/exchange")
    public void getExchangeRate() {
        //overseasStockService.stopOverseasStockService();
        exchangeRateService.getExchangeRate();
    }

    @GetMapping("/overseasStock")
    public void getOverseasStock() {
        //exchangeRateService.stopExchangeRateService();
        overseasStockService.getOverseasStock();
    }
}
