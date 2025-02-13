package com.example.stockproject.service.Crawling;

import java.io.File;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
public class OverseasStockService {
    // Logger 생성
    private static final Logger logger = LoggerFactory.getLogger(ExchangeRateService.class);

    public void getOverseasStock() {

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

//        String initialUrl = driver.getCurrentUrl(); //초기 URL저장
//        logger.info(initialUrl);

        // 초기 요청 URL을 세션에 저장
        String initialUrl = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest().getRequestURL().toString();
        logger.info("✅ 초기 URL: {}", initialUrl);

        while (true) {
            try {
//                String currentUrl = driver.getCurrentUrl();
//                logger.info(currentUrl);
//
                // 현재 요청 URL을 확인
                String currentUrl = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest().getRequestURL().toString();
                logger.info("✅ 현재 URL: {}", currentUrl);

                if(!currentUrl.equals(initialUrl)) {                 // 페이지 이동 감지
                    logger.info("🔴페이지가 이동되어 크롤링을 종료합니다.");
                    break;                                           // 페이지가 이동하면 크롤링 종료
                }

                //나스닥 지수 크롤링
                WebElement nasdaqElement = driver.findElement(By.cssSelector("#worldIndexColumn2 li.on .point_status"));
                String nasdaqIndex = nasdaqElement.findElement(By.tagName("strong")).getText();
                String nasdaqChange = nasdaqElement.findElement(By.tagName("em")).getText();
                String nasdaqChangeSign = nasdaqElement.findElements(By.tagName("span")).get(1).getText();
                String nasdaqChangeRate = nasdaqElement.findElement(By.tagName("span")).getText();

                // S&P500 지수 크롤링
                WebElement sp500Element = driver.findElement(By.cssSelector("#worldIndexColumn3 li.on .point_status"));
                String sp500Index = sp500Element.findElement(By.tagName("strong")).getText();
                String sp500Change = sp500Element.findElement(By.tagName("em")).getText();
                String sp500ChangeSign = sp500Element.findElements(By.tagName("span")).get(1).getText();
                String sp500ChangeRate = sp500Element.findElement(By.tagName("span")).getText();

                // 로그 출력 (변동률과 실제 값 구분)
                logger.info("📊나스닥 종합 지수: {} (변동: {}{} 변동률: {})", nasdaqIndex, nasdaqChangeSign, nasdaqChange, nasdaqChangeRate);
                logger.info("📊S&P500 지수: {} (변동: {}{} 변동률: {})", sp500Index, sp500ChangeSign, sp500Change, sp500ChangeRate);

                // 10초 대기 후 다시 가져오기
                TimeUnit.SECONDS.sleep(10);

            } catch (InterruptedException e) {
                logger.error("❌ sleep 중 오류 발생: {}", e.getMessage());
                Thread.currentThread().interrupt(); // 인터럽트 상태 복구
                break;
            }
        }

        // WebDriver 종료
        driver.quit();
        logger.info("🔴Chrome WebDriver 종료");
    }
}
