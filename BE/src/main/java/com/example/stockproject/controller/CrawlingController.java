package com.example.stockproject.controller;

import com.example.stockproject.dto.crawling.IndexDTO;
import com.example.stockproject.dto.crawling.NewsDTO;
import com.example.stockproject.dto.crawling.valueDTO;
import com.example.stockproject.service.Crawling.ExchangeRateService;
import com.example.stockproject.service.Crawling.IndexService;
import com.example.stockproject.service.Crawling.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class CrawlingController {

    private final ExchangeRateService exchangeRateService;
    private final IndexService indexService;
    private final NewsService newsService;

    @Autowired
    public CrawlingController(ExchangeRateService exchangeRateService, IndexService indexService,
                              NewsService newsService) {
        this.exchangeRateService = exchangeRateService;
        this.indexService = indexService;
        this.newsService = newsService;
    }

    //환율 크롤링
    @GetMapping("/api/exchangerate")
    public valueDTO getExchangeRate() {
        return exchangeRateService.getExchangeRate();
    }

    //지수(4가지) 크롤링
    @GetMapping("/api/stockindex")
    public List<IndexDTO> getStockIndex() {
        List<IndexDTO> stockIndexList = new ArrayList<>();
        stockIndexList = indexService.getAllStockIndex();
        return stockIndexList;
    }

    //뉴스 기사 크롤링
    @GetMapping("/api/news")
    public List<NewsDTO> getNewsList() {
        List<NewsDTO> newsList = new ArrayList<>();
        newsList = newsService.getNewsList();
        return newsList;
    }

}
