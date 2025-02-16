package com.example.stockproject.service.Crawling;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import com.example.stockproject.dto.crawling.IndexDTO;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class OverseasStockService {
    // Logger 생성
    private static final Logger logger = LoggerFactory.getLogger(ExchangeRateService.class);

    public List<IndexDTO> getOverseasStock() {

        // resources 폴더 내 chromedriver 파일 경로 설정
        String driverPath = new File(ExchangeRateService.class.getResource("/static/chromedriver_mac/chromedriver").getFile()).getPath();
        // ChromeDriver 경로 설정
        System.setProperty("webdriver.chrome.driver", driverPath);
        logger.info("✅Chrome WebDriver 실행");

        // 웹드라이버 실행 (크롬 브라우저 띄우기)
        WebDriver driver = new ChromeDriver();
        // 네이버 증권 환율 페이지 접속
        driver.get("https://finance.naver.com/world/");
        logger.info("✅ 해외증시 지수 정보 크롤링 시작");

        // 나스닥 지수 크롤링
        WebElement nasdaqElement = driver.findElement(By.cssSelector("#worldIndexColumn2 li.on .point_status"));
        String nasdaqIndex = nasdaqElement.findElement(By.tagName("strong")).getText();
        String nasdaqChange = nasdaqElement.findElement(By.tagName("em")).getText();
        String nasdaqChangeSign = nasdaqElement.findElements(By.tagName("span")).get(1).getText();
        String nasdaqChangeRate = nasdaqElement.findElement(By.tagName("span")).getText().substring(1,5); //+0.41%

        // S&P500 지수 크롤링
        WebElement sp500Element = driver.findElement(By.cssSelector("#worldIndexColumn3 li.on .point_status"));
        String sp500Index = sp500Element.findElement(By.tagName("strong")).getText();
        String sp500Change = sp500Element.findElement(By.tagName("em")).getText();
        String sp500ChangeSign = sp500Element.findElements(By.tagName("span")).get(1).getText();
        String sp500ChangeRate = sp500Element.findElement(By.tagName("span")).getText().substring(1,5); //+0.41%;

        IndexDTO nasdaq = new IndexDTO("3", "나스닥", "NASDAQ", nasdaqIndex, nasdaqChangeRate, nasdaqChangeSign);
        IndexDTO sp500 = new IndexDTO("4","S&P500", "SPX",sp500Index, sp500Change, sp500ChangeSign);


        logger.info("📊 나스닥 지수 {}, 등락율 {}, 부호 {}", nasdaqIndex, nasdaqChangeRate, nasdaqChangeSign);
        logger.info("📊 S&P500 지수 {}, 등락율 {}, 부호 {}", sp500Index, sp500Change, sp500ChangeSign);

        List<IndexDTO> stockIndexList = new ArrayList<>();
        stockIndexList.add(nasdaq);
        stockIndexList.add(sp500);

        driver.quit();
        logger.info("🔴Chrome WebDriver 종료");

        return stockIndexList;
    }
}

