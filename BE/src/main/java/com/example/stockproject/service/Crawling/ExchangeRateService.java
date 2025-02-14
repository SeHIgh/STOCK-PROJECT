package com.example.stockproject.service.Crawling;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.concurrent.TimeUnit;

@Service
public class ExchangeRateService {

    // Logger 생성
    private static final Logger logger = LoggerFactory.getLogger(ExchangeRateService.class);


    public void getExchangeRate() {


        // ChromeDriver 경로 설정 (다운로드한 chromedriver.exe 위치)
        //System.setProperty("webdriver.chrome.driver", "/Users/kangjuho/Desktop/projectSorce/chromedriver-mac-arm64/chromedriver"); // 경로

        // resources 폴더 내 chromedriver 파일 경로 설정
        String driverPath = new File(ExchangeRateService.class.getResource("/static/chromedriver_mac/chromedriver").getFile()).getPath();
        // ChromeDriver 경로 설정
        System.setProperty("webdriver.chrome.driver", driverPath);
        logger.info("✅Chrome WebDriver 실행");

        // 웹드라이버 실행 (크롬 브라우저 띄우기)
        WebDriver driver = new ChromeDriver();

        // 네이버 증권 환율 페이지 접속
        driver.get("https://finance.naver.com/marketindex/");
        logger.info("✅환율 정보 크롤링 시작");

        while (true) {
            try {

                //CSS
                //#exchangeList li.on .head_info .value

                // 환율 정보 가져오기 (JavaScript가 실행된 후의 데이터를 가져옴)
                WebElement exchangeRateElement = driver.findElement(By.cssSelector("#exchangeList li.on .head_info .value"));

                String exchangeRate = exchangeRateElement.getText();

                // 결과 출력
                //System.out.println("현재 원/달러 환율: " + exchangeRate);
                logger.info("📊현재 원/달러 환율: {}", exchangeRate);

                // 10초 대기 후 다시 가져오기
                TimeUnit.SECONDS.sleep(10);

            } catch (Exception e) {
                e.printStackTrace();
                logger.error("❌환율 정보를 가져오는 중 오류 발생", e);
                break; // 예외가 발생하면 루프 종료
            }
        }

        // WebDriver 종료
        driver.quit();
        logger.info("🔴Chrome WebDriver 종료");
    }

//    // 크롤링을 중지하는 메서드
//    public void stopExchangeRateService() {
//        // WebDriver 종료
//        driver.quit();
//        logger.info("🔴Chrome WebDriver 종료");
//    }
}
