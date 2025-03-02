package com.example.stockproject.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.stockproject.dto.VolumeResponseOutput;
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
public class ApiVolumeService {
    @Value("${appkey1}")
    private String appkey;

    @Value("${appsecret1}")
    private String appSecret;

    @Value("${access_token1}")
    private String accessToken;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public ApiVolumeService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.baseUrl("https://openapi.koreainvestment.com:9443").build();
        this.objectMapper =objectMapper;
    }

    private HttpHeaders createVolumeRankHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
        headers.set("appkey", appkey);
        headers.set("appSecret", appSecret);
        headers.set("tr_id", "FHPST01710000");
        headers.set("custtype", "P");
        return headers;
    }

    private Mono<List<VolumeResponseOutput>> parseFVolumeRank(String response) {
        try {
            List<VolumeResponseOutput> responseDataList = new ArrayList<>();
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode outputNode = rootNode.get("output");   //header 중 output내용
            if (outputNode != null) {
                int count = 0;
                for (JsonNode node : outputNode) {
                    if (count >= 10) break;     //10개까지 저장
                    VolumeResponseOutput responseData = new VolumeResponseOutput();

                    responseData.setHts_kor_isnm(node.get("hts_kor_isnm").asText());  //hts_kor_isnm 필드가 없지만 setHtsKorIsnm으로 자동매핑.
                    responseData.setData_rank(node.get("data_rank").asText());
                    responseData.setStck_prpr(node.get("stck_prpr").asText());
                    responseData.setAcml_vol(node.get("acml_vol").asText());
                    responseData.setVol_inrt(node.get("vol_inrt").asText());
                    responseData.setAcml_tr_pbmn(node.get("acml_tr_pbmn").asText());
                    responseData.setMksc_shrn_iscd(node.get("mksc_shrn_iscd").asText());
                    responseData.setPrdy_vol_value(node.get("prdy_vrss").asText());
                    responseData.setPrdy_ctrt(node.get("prdy_ctrt").asText());

                    // prdy_vrss_sign 값이 2이면 "+", 5이면 "-"를 설정
                    String prdyVolSign = node.get("prdy_vrss_sign").asText();
                    if (prdyVolSign.equals("2")) {
                        responseData.setPrdy_vol_sign("+");
                    } else if (prdyVolSign.equals("5")) {
                        responseData.setPrdy_vol_sign("-");
                    }
                    else {
                        responseData.setPrdy_vol_sign(prdyVolSign); // 기본값 유지
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

    //거래량 순위
    public Mono<List<VolumeResponseOutput>> getVolumeRank() {
        HttpHeaders headers = createVolumeRankHttpHeaders();

        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/uapi/domestic-stock/v1/quotations/volume-rank")
                        .queryParam("FID_COND_MRKT_DIV_CODE", "J")
                        .queryParam("FID_COND_SCR_DIV_CODE", "20171")
                        .queryParam("FID_INPUT_ISCD", "0002")
                        .queryParam("FID_DIV_CLS_CODE", "0")
                        .queryParam("FID_BLNG_CLS_CODE", "0")   //0 : 평균거래량 1:거래증가율 2:평균거래회전율 3:거래금액순 4:평균거래금액회전율
                        .queryParam("FID_TRGT_CLS_CODE", "111111111")
                        .queryParam("FID_TRGT_EXLS_CLS_CODE", "000000")
                        .queryParam("FID_INPUT_PRICE_1", "0")
                        .queryParam("FID_INPUT_PRICE_2", "0")
                        .queryParam("FID_VOL_CNT", "0")
                        .queryParam("FID_INPUT_DATE_1", "0")
                        .build())
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(response -> parseFVolumeRank(response));

    }
}