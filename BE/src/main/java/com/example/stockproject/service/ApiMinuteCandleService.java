package com.example.stockproject.service;

import com.example.stockproject.dto.StockInfo;
import com.example.stockproject.dto.candle.MinuteCandleResponseOutput;
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

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ApiMinuteCandleService {
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
    public ApiMinuteCandleService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper,
                                  StockInfoRepository stockInfoRepository) {
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
        headers.set("tr_id","FHKST03010200");
        headers.set("custtype","P");
        return headers;
    }

//    private Mono<List<MinuteCandleResponseOutput>> parseResponse(String response) {
//
//        try {
//            JsonNode rootNode = objectMapper.readTree(response);
//            JsonNode outputNode1 = rootNode.get("output2");
//
//            List<MinuteCandleResponseOutput> candleList = new ArrayList<>();
//
//            if (outputNode1 != null) {
//                for (JsonNode node : outputNode1) {
//                    MinuteCandleResponseOutput candleData = new MinuteCandleResponseOutput();
//                    candleData.setCntg_vol(node.get("cntg_vol").asText());
//                    candleData.setStck_cntg_hour(node.get("stck_cntg_hour").asText());
//                    candleData.setStck_hgpr(node.get("stck_hgpr").asText());
//                    candleData.setStck_lwpr(node.get("stck_lwpr").asText());
//                    candleData.setStck_oprc(node.get("stck_oprc").asText());
//                    candleData.setStck_prpr(node.get("stck_prpr").asText());
//
//                    candleList.add(candleData);
//                }
//            }
//
//            return candleList;
//        }
//
//    }


    private Mono<List<MinuteCandleResponseOutput>> parseResponse(String response) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode outputNode = rootNode.get("output2");

            List<MinuteCandleResponseOutput> candleList = new ArrayList<>();

            if (outputNode != null && outputNode.isArray()) {
                int count=0;
                for (JsonNode node : outputNode) {
                    if(count >=10) {
                        break;
                    }

                    MinuteCandleResponseOutput candleData = new MinuteCandleResponseOutput();
                    candleData.setCntg_vol(node.get("cntg_vol").asText());
                    candleData.setStck_cntg_hour(node.get("stck_cntg_hour").asText());
                    candleData.setStck_hgpr(node.get("stck_hgpr").asText());
                    candleData.setStck_lwpr(node.get("stck_lwpr").asText());
                    candleData.setStck_oprc(node.get("stck_oprc").asText());
                    candleData.setStck_prpr(node.get("stck_prpr").asText());

                    candleList.add(candleData);
                    count++;
                }
            }

            return Mono.just(candleList);
        } catch (Exception e) {
            return Mono.error(new RuntimeException("JSON 파싱 오류", e));
        }
    }

    //분봉 조회를 위한 query parameter
    public Mono<List<MinuteCandleResponseOutput>> getCandleInformation(String stockName) {
        Optional<StockInfo> stockInfo = stockInfoRepository.findByStockName(stockName);
        if(stockInfo.isEmpty()){
            return Mono.error(new RuntimeException("해당 종목명을 찾을 수 없습니다: " + stockName));
        }

        String stockCode = stockInfo.get().getStockCode();//stockCode;
        HttpHeaders headers = createHttpHeaders();

        //guswotlrksdmf HHmmss형식으로 변환
        String currentTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HHmmss"));

        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice")
                        .queryParam("fid_cond_mrkt_div_code", "J")
                        .queryParam("fid_etc_cls_code", "")
                        .queryParam("fid_input_hour_1", currentTime)
                        .queryParam("fid_input_iscd", stockCode)
                        .queryParam("fid_pw_data_incu_yn", "Y")
                        .build())
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(response -> parseResponse(response));  // parseAccount() 반환 타입 변경됨
    }

}
