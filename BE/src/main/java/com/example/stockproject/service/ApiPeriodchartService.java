package com.example.stockproject.service;

import com.example.stockproject.dto.PeriodChartResponseOutput;
import com.example.stockproject.dto.StockInfo;
import com.example.stockproject.repository.StockInfoRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

//일,주,월,년봉 차트를 위한 정보
@Service
public class ApiPeriodchartService {
    @Value("${appkey1}")
    private String appkey;

    @Value("${appsecret1}")
    private String appSecret;

    @Value("${access_token1}")
    private String accessToken;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final StockInfoRepository stockInfoRepository;

    @Autowired
    public ApiPeriodchartService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper,
                                StockInfoRepository stockInfoRepository
            ,ApiPriceService apiPriceService) {
        this.webClient = webClientBuilder.baseUrl("https://openapi.koreainvestment.com:9443").build();
        this.objectMapper = objectMapper;
        this.stockInfoRepository = stockInfoRepository;
    }

    private HttpHeaders createHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
        headers.set("appkey", appkey);
        headers.set("appSecret", appSecret);
        headers.set("tr_id","FHKST03010100");
        headers.set("custtype","P");
        return headers;
    }

    private Mono<List<PeriodChartResponseOutput>> parsePeriodChart(String response) {
        try {
            List<PeriodChartResponseOutput> responseDataList = new ArrayList<>();
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode outputNode1 = rootNode.get("output1"); //현재가를 가져오기 위함.
            JsonNode outputNode = rootNode.get("output2");
            if (outputNode != null && outputNode.isArray()) {
                int count = 0;
                for (JsonNode node : outputNode) {
                    if (count >= 30) break;  // 최대 10개까지만 저장
                    PeriodChartResponseOutput responseData = new PeriodChartResponseOutput();

                    responseData.setDt(node.get("stck_bsop_date").asText());
                    responseData.setBase(outputNode1.get("stck_prpr").asText());
                    responseData.setOpen(node.get("stck_oprc").asText());
                    responseData.setHigh(node.get("stck_hgpr").asText());
                    responseData.setLow(node.get("stck_lwpr").asText());
                    responseData.setClose(node.get("stck_clpr").asText());
                    responseData.setVolume(node.get("acml_vol").asText());
                    responseData.setAmount(node.get("acml_tr_pbmn").asText());

                    responseDataList.add(responseData);
                    count++;
                }
            }
            return Mono.just(responseDataList);
        } catch (Exception e) {
            return Mono.error(e);
        }
    }

    //기간별 시세
    public Mono<List<PeriodChartResponseOutput>> getPeriodChartByStockName(String stockName, String period) {
        Optional<StockInfo> stockInfo = stockInfoRepository.findByStockName(stockName);
        if(stockInfo.isEmpty()){
            return Mono.error(new RuntimeException("해당 종목명을 찾을 수 없습니다: " + stockName));
        }

        String stockCode = stockInfo.get().getStockCode();//stockCode;

        HttpHeaders headers = createHttpHeaders();

        // 시작 날짜 계산
        String startDate = calculateStartDate(period);
        String endDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")); // 오늘 날짜

        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice")
                        .queryParam("fid_cond_mrkt_div_code", "J")
                        .queryParam("fid_input_iscd", stockCode)
                        .queryParam("fid_input_date_1", startDate)     //조회 시작일자
                        .queryParam("fid_input_date_2", endDate)     //조회 종료일자
                        .queryParam("fid_period_div_code", period)         //D:일봉, W:주봉, M:월봉, Y:년봉 (String으로 파라미터 넘겨주면 바꾸게 가능)
                        .queryParam("fid_org_adj_prc", "0")    //0:수정주가 1:원주가
                        .build())
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(response -> parsePeriodChart(response));
    }

    private String calculateStartDate(String period) {
        LocalDate startDate;
        switch (period.toUpperCase()) {
            case "D": // 일봉: 30일 전
                startDate = LocalDate.now().minusDays(30);
                break;
            case "W": // 주봉: 30주 전
                startDate = LocalDate.now().minusWeeks(30);
                break;
            case "M": // 월봉: 30개월 전
                startDate = LocalDate.now().minusMonths(30);
                break;
            case "Y": // 년봉: 30년 전
                startDate = LocalDate.now().minusYears(30);
                break;
            default:
                throw new IllegalArgumentException("잘못된 period 값: " + period);
        }
        return startDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    }


}
