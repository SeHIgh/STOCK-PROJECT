package com.example.stockproject.service.Crawling;

import com.example.stockproject.dto.crawling.IndexDTO;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
public class DomesticStockService {
    private static final Logger logger = LoggerFactory.getLogger(DomesticStockService.class);

    public List<IndexDTO> getDomesticStock() {
        // resources 폴더 내 chromedriver 파일 경로 설정
        String driverPath = new File(ExchangeRateService.class.getResource("/static/chromedriver_mac/chromedriver").getFile()).getPath();
        // ChromeDriver 경로 설정
        System.setProperty("webdriver.chrome.driver", driverPath);
        logger.info("✅Chrome WebDriver 실행");

        // 웹드라이버 실행 (크롬 브라우저 띄우기)
        WebDriver driver = new ChromeDriver();
        // 네이버 증권 환율 페이지 접속
        driver.get("https://finance.naver.com/sise/");
        logger.info("✅ 국내 증시 지수 정보 크롤링 시작");

        WebElement kospiElement = driver.findElement(By.cssSelector("#KOSPI_now")); //코스피 지수 2,591.05
        String kospiIndex = kospiElement.getText();
        WebElement kospiChangeElement = driver.findElement(By.cssSelector("#KOSPI_change"));
        String[] kospiChangeParts = kospiChangeElement.getText().split(" "); // 공백 기준으로 분리 //코스피 등락율 [7.88 +0.31%상승]
        String kospiChangeRate = kospiChangeParts[1].substring(1, 5); ////+0.31
        String kospiChangeSign = kospiChangeRate.startsWith("+") ? "+" : "-" ;  //+

        WebElement kosdaqElement = driver.findElement(By.cssSelector("#KOSDAQ_now"));
        String kosdaqIndex = kosdaqElement.getText();
        WebElement kosdaqChangeElement = driver.findElement(By.cssSelector("#KOSDAQ_change"));
        String[] kosdaqChangeParts = kosdaqChangeElement.getText().split(" ");
        String kosdaqChangeRate = kosdaqChangeParts[1].substring(1, 5);
        String kosdaqChangeSign = kosdaqChangeRate.startsWith("+") ? "+" : "-";

        IndexDTO kospi = new IndexDTO("1","코스피","KOSPI", kosdaqIndex, kospiChangeRate, kospiChangeSign);
        IndexDTO kosdaq = new IndexDTO("2","코스닥", "KOSDAQ", kosdaqIndex, kosdaqChangeRate, kosdaqChangeSign );

        logger.info("📊 코스피 지수 {}, 등락율 {}, 부호 {}", kospiIndex, kospiChangeRate, kospiChangeSign);
        logger.info("📊 코스닥 지수 {}, 등락율 {}, 부호 {}", kosdaqIndex, kosdaqChangeRate, kosdaqChangeSign);

        List<IndexDTO> stockIndexList = new ArrayList<>();
        stockIndexList.add(kosdaq);
        stockIndexList.add(kospi);

        driver.quit();
        logger.info("🔴Chrome WebDriver 종료");

        return stockIndexList;

    }

}
