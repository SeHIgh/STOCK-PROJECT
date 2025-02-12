package com.example.stockproject.controller;

import com.example.stockproject.service.Crawling.ExchangeRateService;
import org.openqa.selenium.WebDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CrawlingController {

    private final ExchangeRateService exchangeRateService;

    @Autowired
    public CrawlingController(ExchangeRateService exchangeRateService) {
        this.exchangeRateService = exchangeRateService;
    }

    @GetMapping("/exchange")
    public void getExchangeRate() {
        exchangeRateService.getExchangeRate();
    }
}
