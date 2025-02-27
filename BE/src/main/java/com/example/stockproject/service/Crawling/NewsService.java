package com.example.stockproject.service.Crawling;

import com.example.stockproject.dto.crawling.NewsDTO;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
public class NewsService {

    private static final Logger logger = LoggerFactory.getLogger(NewsService.class);

    public List<NewsDTO> getNewsList() {

        //ChoromeOption 설정 추가
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");         //크롤링 시, 웹사이트 열지 않음.
        //options.addArguments("--no-sandbox");
        //options.addArguments("--disable-dev-shm-usage");
        WebDriver driver = new ChromeDriver(options);

        String driverPath = new File(NewsService.class.getResource("/static/chromedriver_mac/chromedriver").getFile()).getPath();

        System.setProperty("webdriver.chrome.driver", driverPath);
        logger.info("✅Chrome WebDriver 실행");

        //WebDriver driver = new ChromeDriver();

        //네이버 증권 뉴스 페이지 접속
        driver.get("https://finance.naver.com/news/mainnews.naver");
        logger.info("✅뉴스 기사 정보 크롤링 시작");

        // 주요 뉴스 리스트 찾기
        List<WebElement> newsElements = driver.findElements(By.cssSelector(".newsList li.block1"));
        List<NewsDTO> newsList = new ArrayList<>();

        for (int i = 0; i < Math.min(newsElements.size(), 10); i++) { // 최대 4개만 가져오기
            WebElement newsItem = newsElements.get(i);

            // 뉴스 제목 및 링크 가져오기
            WebElement titleElement = newsItem.findElement(By.cssSelector(".articleSubject a"));
            String title = titleElement.getText();

            String link = titleElement.getAttribute("href");

            // 출처 및 시간 가져오기
            WebElement pressElement = newsItem.findElement(By.cssSelector(".articleSummary .press"));
            String source = pressElement.getText();

            WebElement timeElement = newsItem.findElement(By.cssSelector(".articleSummary .wdate"));
            String createdAt = timeElement.getText();

            // 카테고리 기본값 설정
            String category = "증권";

            // 이미지 URL
            WebElement imgElement = newsItem.findElement(By.cssSelector(".thumb img"));
            String imageUrl = imgElement.getAttribute("src");

            // NewsDTO 객체 생성 및 리스트에 추가
            NewsDTO newsDTO = new NewsDTO(title, createdAt, source, category, link, imageUrl);
            newsList.add(newsDTO);

            // 로그 출력
            logger.info("📰 뉴스 제목: {}", title);
            logger.info("⏰ 시간: {}", createdAt);
            logger.info("📰 출처: {}", source);
            logger.info("📌 카테고리: {}", category);
            logger.info("🔗 링크: {}", link);
            logger.info("🌄 사진: {}", imageUrl);
        }


        driver.quit();
        logger.info("🔴 Chrome WebDriver 종료");

        return newsList;
    }
}

/*
title: "[코스닥 마감] 美 고용지표 경계감 속 소폭 상승…대왕고래 관련주 ‘뚝’",
        time: "2시간 전",
        source: "이데일리",
        category: "증권",
        link: "*",
 */