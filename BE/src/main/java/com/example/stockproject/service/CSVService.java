package com.example.stockproject.service;

import com.example.stockproject.dto.StockInfo;
import com.example.stockproject.repository.StockInfoRepository;
import com.opencsv.CSVReader;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

//주식종목 CSV파일의 내용을 로컬 DB에 저장하는 서비스 코드
@Slf4j
@Service
@Transactional(readOnly = true)
public class CSVService {

    private final StockInfoRepository stockInfoRepository;

    public CSVService(StockInfoRepository stockInfoRepository) {
        this.stockInfoRepository = stockInfoRepository;
    }

    @PostConstruct
    //앱 실행 시 db 데이터 구축
    public void AddressInit() {
        if (!dataAlreadyLoaded(stockInfoRepository)) {
            loadDataFromCSV("stock_list.csv");
        }
        else{
            log.info("📄csv already loaded");
        }
    }

    private boolean dataAlreadyLoaded(StockInfoRepository repository) {
        return repository.count() > 0;
    }

    @Transactional
    public void loadDataFromCSV(String filename) {
        try {
            // fileName 기준으로 파일을 가져온 후, FileReader 변환 -> 이걸 다시 CSVReader로 변환
            ClassLoader classLoader = getClass().getClassLoader();
            //getClass().getClassLoader().getResource(filename)는 기본적으로 클래스패스(classpath)에서 파일을 찾음.
            //파일이 resources 폴더 내에 존재해야함!
            File file = new File(Objects.requireNonNull(classLoader.getResource(filename)).getFile());
            if (!file.exists()) {
                log.error("❌ CSV 파일을 찾을 수 없습니다: {}", filename);
                return;
            }
            log.info("✅ CSV 파일 존재 확인됨: {}", filename);

            FileReader reader = new FileReader(file, StandardCharsets.UTF_8); // UTF-8 인코딩 지정
            CSVReader csvReader = new CSVReader(reader);

            log.info("📄csv file loaded");
            List<StockInfo> stockList = new ArrayList<>();
            csvReader.readNext(); // 첫 번째 줄(헤더) 스킵

            String[] nextRecord;

            while ((nextRecord = csvReader.readNext()) != null) {
                StockInfo stock = new StockInfo(nextRecord[1], nextRecord[3], nextRecord[6]);
                stockList.add(stock);
                //log.info("stock_info 객체 데이터 저장: {}", stock);  // 저장된 데이터 로그 출력
            }

            stockInfoRepository.saveAll(stockList); // 저장
            log.info("🔖데이터 저장 완료");  // 데이터 저장 후 메시지

            csvReader.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
