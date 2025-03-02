package com.example.stockproject.service.Crawling;

import com.example.stockproject.dto.crawling.valueDTO;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class ExchangeRateService {

    // Logger 생성
    private static final Logger logger = LoggerFactory.getLogger(ExchangeRateService.class);


    public valueDTO getExchangeRate() {

        //ChromeOption 설정 추가
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");

        // 웹드라이버 실행 (크롬 브라우저 띄우기)
        WebDriver driver = new ChromeDriver(options);

        // ChromeDriver 경로 설정 (다운로드한 chromedriver.exe 위치)
        //System.setProperty("webdriver.chrome.driver", "/Users/kangjuho/Desktop/projectSorce/chromedriver-mac-arm64/chromedriver"); // 경로

        // resources 폴더 내 chromedriver 파일 경로 설정
        String driverPath = new File(ExchangeRateService.class.getResource("/static/chromedriver_mac/chromedriver").getFile()).getPath();

        // ChromeDriver 경로 설정
        System.setProperty("webdriver.chrome.driver", driverPath);
        logger.info("✅Chrome WebDriver 실행");


        // 네이버 증권 환율 페이지 접속
        driver.get("https://finance.naver.com/marketindex/");
        logger.info("✅환율 정보 크롤링 시작");

        //CSS
        //#exchangeList li.on .head_info .value

        // 환율 정보 가져오기 (JavaScript가 실행된 후의 데이터를 가져옴)
        WebElement exchangeRateElement = driver.findElement(By.cssSelector("#exchangeList li.on .head_info .value"));

        String value = exchangeRateElement.getText();
        valueDTO exchangeRate = new valueDTO(value);

        // 결과 출력
        //System.out.println("현재 원/달러 환율: " + exchangeRate);
        logger.info("📊현재 원/달러 환율: {}", value);

        // WebDriver 종료
        driver.quit();
        logger.info("🔴Chrome WebDriver 종료");

        return exchangeRate;
    }
}
