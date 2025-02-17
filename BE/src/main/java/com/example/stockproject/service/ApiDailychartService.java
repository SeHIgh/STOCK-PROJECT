package com.example.stockproject.service;

import com.example.stockproject.dto.DailyChartResponseOutput;
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

@Service
public class ApiDailychartService {
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
    public ApiDailychartService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper,
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

    private Mono<List<DailyChartResponseOutput>> parseDailyChart(String response) {
        try {
            List<DailyChartResponseOutput> responseDataList = new ArrayList<>();
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode outputNode = rootNode.get("output2");
            if (outputNode != null && outputNode.isArray()) {
                int count = 0;
                for (JsonNode node : outputNode) {
                    if (count >= 4) break;  // 최대 10개까지만 저장
                    DailyChartResponseOutput responseData = new DailyChartResponseOutput();

                    //등락률 계산
                    String stck_clpr = node.get("stck_clpr").asText();
                    String prdy_vrss = node.get("prdy_vrss").asText();
                    String PriceChangePercentage = calculatePriceChangePercentage(stck_clpr, prdy_vrss);

                    responseData.setStck_bsop_date(node.get("stck_bsop_date").asText());
                    responseData.setStck_clpr(node.get("stck_clpr").asText());
                    responseData.setStck_oprc(node.get("stck_oprc").asText());
                    responseData.setStck_hgpr(node.get("stck_hgpr").asText());
                    responseData.setStck_lwpr(node.get("stck_lwpr").asText());
                    //responseData.setPrdy_vrss(node.get("prdy_vrss").asText());
                    responseData.setAcml_vol(node.get("acml_vol").asText());
                    responseData.setAcml_tr_pbmn(node.get("acml_tr_pbmn").asText());
                    responseData.setPrdy_ctrt(PriceChangePercentage);

                    responseDataList.add(responseData);
                    count++;
                }
            }
            return Mono.just(responseDataList);
        } catch (Exception e) {
            return Mono.error(e);
        }
    }

    //일별 시세
    public Mono<List<DailyChartResponseOutput>> getDailyChartByStockName(String stockName) {
        Optional<StockInfo> stockInfo = stockInfoRepository.findByStockName(stockName);
        if(stockInfo.isEmpty()){
            return Mono.error(new RuntimeException("해당 종목명을 찾을 수 없습니다: " + stockName));
        }

        String stockCode = stockInfo.get().getStockCode();//stockCode;

        HttpHeaders headers = createHttpHeaders();

        //현재 날짜 가져오기(yyyyMMdd 형식)
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        //일주일 전
        String sevenDaysAgo = LocalDate.now().minusDays(7).format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice")
                        .queryParam("fid_cond_mrkt_div_code", "J")
                        .queryParam("fid_input_iscd", stockCode)
                        .queryParam("fid_input_date_1", sevenDaysAgo)     //조회 시작일자
                        .queryParam("fid_input_date_2", today)     //조회 종료일자
                        .queryParam("fid_period_div_code", "D")         //D:일봉, W:주봉, M:월봉, Y:년봉 (String으로 파라미터 넘겨주면 바꾸게 가능)
                        .queryParam("fid_org_adj_prc", "0")    //0:수정주가 1:원주가
                        .build())
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(response -> parseDailyChart(response));
    }

    //특정 기간 등락률 = (종료 일자 종가 - 시작 일자 종가) / 시작 일자 종가 * 100
    //일 등락률 = (오늘종가 – 어제종가) / 어제종가 * 100
    //당일 종가와 전일대비등락수치를 이용한 등락률 계산
    public String calculatePriceChangePercentage(String stck_clpr, String prdy_vrss) {
        try {
            double currentPrice = Double.parseDouble(stck_clpr); // 오늘 종가
            double priceChange = Double.parseDouble(prdy_vrss);  // 전일 대비 등락 수치

            // 전일 종가 계산 (오늘 종가- 전일 대비 등락 수치 = 전일 종가)
            double previousPrice = currentPrice - priceChange;

            if (previousPrice == 0) {
                return "0.00"; // 전일 종가가 0인 경우 예외 처리
            }

            // 전일 대비 등락률 계산
            // 전일대비등락수치 / 어제 종가 * 100
            double changePercentage = (priceChange / previousPrice) * 100;

            return String.format("%.2f", changePercentage); // 소수점 두 자리로 포맷
        } catch (NumberFormatException e) {
            return "N/A"; // 잘못된 데이터 포맷 처리
        }
    }

}
