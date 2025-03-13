package com.example.stockproject.service;

import com.example.stockproject.dto.PriceResponseOutput;
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

import java.util.Optional;

@Service
public class ApiPriceService {
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
    public ApiPriceService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper, StockInfoRepository stockInfoRepository) {
        this.webClient = webClientBuilder.baseUrl("https://openapi.koreainvestment.com:9443").build();
        this.objectMapper = objectMapper;
        this.stockInfoRepository = stockInfoRepository;
    }

    private HttpHeaders createHttpHeaders2() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
        headers.set("appkey", appkey);
        headers.set("appSecret", appSecret);
        headers.set("tr_id", "FHKST01010100");
        return headers;
    }

    private Mono<PriceResponseOutput> parsePrice(String response) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode outputNode = rootNode.get("output");

            if (outputNode != null) {
                return Mono.just(parseNode(outputNode));
            } else {
                return Mono.empty();
            }
        } catch (Exception e) {
            return Mono.error(e);
        }
    }

    private PriceResponseOutput parseNode(JsonNode node) {
        PriceResponseOutput responseData = new PriceResponseOutput();

        responseData.setStckPrpr(node.has("stck_prpr") ? node.get("stck_prpr").asText() : "N/A");
        //responseData.setIscdStatClsCode(node.has("iscd_stat_cls_code") ? node.get("iscd_stat_cls_code").asText() : "N/A");
        responseData.setRprsMrktKorName(node.has("rprs_mrkt_kor_name") ? node.get("rprs_mrkt_kor_name").asText() : "N/A");
        responseData.setBstpKorIsnm(node.has("bstp_kor_isnm") ? node.get("bstp_kor_isnm").asText() : "N/A");
        responseData.setPrdyVrss(node.has("prdy_vrss") ? node.get("prdy_vrss").asText() : "N/A");
        responseData.setPrdyVrssSign(node.has("prdy_vrss_sign") ? node.get("prdy_vrss_sign").asText() : "N/A");
        responseData.setPrdyCtrt(node.has("prdy_ctrt") ? node.get("prdy_ctrt").asText() : "N/A");
        responseData.setAcmlVol(node.has("acml_vol") ? node.get("acml_vol").asText() : "N/A");
        responseData.setPrdyVrssVolRate(node.has("prdy_vrss_vol_rate") ? node.get("prdy_vrss_vol_rate").asText() : "N/A");
        responseData.setStckOprc(node.has("stck_oprc") ? node.get("stck_oprc").asText() : "N/A");
        responseData.setStckHgpr(node.has("stck_hgpr") ? node.get("stck_hgpr").asText() : "N/A");
        responseData.setStckLwpr(node.has("stck_lwpr") ? node.get("stck_lwpr").asText() : "N/A");
        responseData.setStckMxpr(node.has("stck_mxpr") ? node.get("stck_mxpr").asText() : "N/A");
        responseData.setStckLlam(node.has("stck_llam") ? node.get("stck_llam").asText() : "N/A");
        responseData.setStckSdpr(node.has("stck_sdpr") ? node.get("stck_sdpr").asText() : "N/A");
        responseData.setLstnStcn(node.has("lstn_stcn") ? node.get("lstn_stcn").asText() : "N/A");
        responseData.setPer(node.has("per") ? node.get("per").asText() : "N/A");
        responseData.setPbr(node.has("pbr") ? node.get("pbr").asText() : "N/A");
        responseData.setEps(node.has("eps") ? node.get("eps").asText() : "N/A");
        responseData.setBps(node.has("bps") ? node.get("bps").asText() : "N/A");

        return responseData;
    }

    public Mono<PriceResponseOutput> getPriceByStockName(String stockName) {
        Optional<StockInfo> stockInfo = stockInfoRepository.findByStockName(stockName);
        if(stockInfo.isEmpty()){
            return Mono.error(new RuntimeException("해당 종목명을 찾을 수 없습니다: " + stockName));
        }

        String stockCode = stockInfo.get().getStockCode();//stockCode;

        HttpHeaders headers = createHttpHeaders2();

        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/uapi/domestic-stock/v1/quotations/inquire-price")
                        .queryParam("FID_COND_MRKT_DIV_CODE", "J")
                        .queryParam("FID_INPUT_ISCD", stockCode)
                        .build())
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(this::parsePrice);
    }
}
