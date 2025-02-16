package com.example.stockproject.controller;

import com.example.stockproject.dto.crawling.IndexDTO;
import com.example.stockproject.service.Crawling.ExchangeRateService;
import com.example.stockproject.service.Crawling.IndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CrawlingController {

    private final ExchangeRateService exchangeRateService;
    private final IndexService indexService;
    @Autowired
    public CrawlingController(ExchangeRateService exchangeRateService, IndexService indexService) {
        this.exchangeRateService = exchangeRateService;
        this.indexService = indexService;
    }

    //환율 크롤링
    @GetMapping("/api/exchangerate")
    public String getExchangeRate() {
        return exchangeRateService.getExchangeRate();
    }

    //지수(4가지) 크롤링
    @GetMapping("/api/stockindex")
    public List<IndexDTO> getStockIndex() {
        return indexService.getAllStockIndex();
    }
}
