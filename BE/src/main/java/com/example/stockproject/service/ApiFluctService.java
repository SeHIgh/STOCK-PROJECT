package com.example.stockproject.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.stockproject.dto.FluctResponseOutput;
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
public class ApiFluctService {
    @Value("${appkey1}")
    private String appkey;

    @Value("${appsecret1}")
    private String appSecret;

    @Value("${access_token1}")
    private String accessToken;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public ApiFluctService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.baseUrl("https://openapi.koreainvestment.com:9443").build();
        this.objectMapper = objectMapper;
    }

    private HttpHeaders createHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
        headers.set("appkey", appkey);
        headers.set("appSecret", appSecret);
        headers.set("tr_id","FHPST01700000");
        headers.set("custtype","P");
        return headers;
    }

    private Mono<List<FluctResponseOutput>> parseFluct(String response) {
        try {
            List<FluctResponseOutput> responseDataList = new ArrayList<>();
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode outputNode = rootNode.get("output");
            if (outputNode != null) {
                int count = 0;
                for (JsonNode node : outputNode) {
                    if (count >= 10) break;  // 최대 10개까지만 저장
                    FluctResponseOutput responseData = new FluctResponseOutput();

                    responseData.setStck_shrn_iscd(node.get("stck_shrn_iscd").asText());
                    responseData.setData_rank(node.get("data_rank").asText());
                    responseData.setHts_kor_isnm(node.get("hts_kor_isnm").asText());
                    responseData.setStck_prpr(node.get("stck_prpr").asText());
                    responseData.setPrdy_vrss(node.get("prdy_vrss").asText());
                    String sign = node.get("prdy_vrss_sign").asText();
                    if ("1".equals(sign)) {
                        responseData.setPrdy_vrss_sign("+");
                    } else if ("5".equals(sign)) {
                        responseData.setPrdy_vrss_sign("-");
                    } else {
                        responseData.setPrdy_vrss_sign(sign);  // 기본적으로 원래 값 유지
                    }
                    //responseData.setPrdy_vrss_sign(node.get("prdy_vrss_sign").asText());
                    responseData.setPrdy_ctrt(node.get("prdy_ctrt").asText());
                    responseData.setAcml_vol(node.get("acml_vol").asText());

                    // stck_prpr(현재가)와 acml_vol(누적 거래량) 곱하기
                    try {
                        long price = Long.parseLong(node.get("stck_prpr").asText().replace(",", ""));
                        long volume = Long.parseLong(node.get("acml_vol").asText().replace(",", ""));
                        long transactionAmount = price * volume;

                        // 계산된 거래대금을 문자열로 변환 후 저장
                        responseData.setAcml_tr_pbmn(String.valueOf(transactionAmount));
                    } catch (NumberFormatException e) {
                        responseData.setAcml_tr_pbmn("0"); // 변환 실패 시 기본값 설정
                    }

                    responseDataList.add(responseData);
                    count++;
                }
            }
            return Mono.just(responseDataList);
        } catch (Exception e) {
            return Mono.error(e);
        }
    }

    //등락율 상위 10위
    public Mono<List<FluctResponseOutput>> getTop10Fluctuation() {
        HttpHeaders headers = createHttpHeaders();

        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/uapi/domestic-stock/v1/ranking/fluctuation")
                        .queryParam("fid_cond_mrkt_div_code", "J")
                        .queryParam("fid_cond_scr_div_code", "20170")
                        .queryParam("fid_input_iscd", "0000")
                        .queryParam("fid_rank_sort_cls_code", "0")  // 0 :상승률, 1 :하락률
                        .queryParam("fid_input_cnt_1", "0")
                        .queryParam("fid_prc_cls_code", "1")    //0 :저가대비, 1:종가대비
                        .queryParam("fid_input_price_1", "")    //공백
                        .queryParam("fid_input_price_2", "")//공백
                        .queryParam("fid_vol_cnt", "")//공백
                        .queryParam("fid_trgt_cls_code", "0")
                        .queryParam("fid_trgt_exls_cls_code", "0")
                        .queryParam("fid_div_cls_code", "0")
                        .queryParam("fid_rsfl_rate1", "")//공백
                        .queryParam("fid_rsfl_rate2", "")//공백
                        .build())
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(response -> parseFluct(response));
    }

    //등락율 하위 10위
    public Mono<List<FluctResponseOutput>> getBottom10Fluctuation() {
        HttpHeaders headers = createHttpHeaders();

        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/uapi/domestic-stock/v1/ranking/fluctuation")
                        .queryParam("fid_cond_mrkt_div_code", "J")
                        .queryParam("fid_cond_scr_div_code", "20170")
                        .queryParam("fid_input_iscd", "0000")
                        .queryParam("fid_rank_sort_cls_code", "1")  // 0 :상승률, 1 :하락률
                        .queryParam("fid_input_cnt_1", "0")
                        .queryParam("fid_prc_cls_code", "1")        //0 :저가대비, 1:종가대비
                        .queryParam("fid_input_price_1", "")    //공백
                        .queryParam("fid_input_price_2", "")//공백
                        .queryParam("fid_vol_cnt", "")//공백
                        .queryParam("fid_trgt_cls_code", "0")
                        .queryParam("fid_trgt_exls_cls_code", "0")
                        .queryParam("fid_div_cls_code", "0")
                        .queryParam("fid_rsfl_rate1", "")//공백
                        .queryParam("fid_rsfl_rate2", "")//공백
                        .build())
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(response -> parseFluct(response));
    }
}
