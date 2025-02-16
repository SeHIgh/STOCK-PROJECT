package com.example.stockproject.service;

import com.example.stockproject.dto.DailyChartResponseOutput;
import com.example.stockproject.dto.FluctResponseOutput;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

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

    @Autowired
    public ApiDailychartService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.baseUrl("https://openapi.koreainvestment.com:9443").build();
        this.objectMapper = objectMapper;
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
            JsonNode outputNode = rootNode.get("output");
            if (outputNode != null) {
                int count = 0;
                for (JsonNode node : outputNode) {
                    if (count >= 10) break;  // 최대 10개까지만 저장
                    DailyChartResponseOutput responseData = new DailyChartResponseOutput();

                    responseData.setStck_bsop_date(node.get("stck_bsop_date").asText());
                    responseData.setStck_clpr(node.get("stck_clpr").asText());
                    responseData.setStck_hgpr(node.get("stck_hgpr").asText());

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
    public Mono<List<DailyChartResponseOutput>> getDailyChart() {
        HttpHeaders headers = createHttpHeaders();

        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice")
                        .queryParam("FID_COND_MRKT_DIV_CODE", "J")
                        .queryParam("FID_INPUT_ISCD", "005930")
                        .queryParam("FID_INPUT_DATE_1", "20250210")     //조회 시작일자 (ex. 20220501
                        .queryParam("FID_INPUT_DATE_2", "20250214")     //조회 종료일자 (ex. 20220530)
                        .queryParam("FID_PERIOD_DIV_CODE", "D")         //D:일봉, W:주봉, M:월봉, Y:년봉
                        .queryParam("FID_ORG_ADJ_PRC", "0")    //0:수정주가 1:원주가
                        .build())
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(response -> parseDailyChart(response));
    }

}
