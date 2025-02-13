package com.example.stockproject.controller;

import com.example.stockproject.service.Crawling.ExchangeRateService;
import com.example.stockproject.service.Crawling.OverseasStockService;
import org.openqa.selenium.WebDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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
        exchangeRateService.getExchangeRate();
    }

    @GetMapping("/overseasStock")
    public void getOverseasStock() {overseasStockService.getOverseasStock();}
}
