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
    @Value("${appkey}")
    private String appkey;

    @Value("${appsecret}")
    private String appSecret;

    @Value("${access_token}")
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
                for (JsonNode node : outputNode) {
                    FluctResponseOutput responseData = new FluctResponseOutput();

                    responseData.setStckShrnIscd(node.get("stck_shrn_iscd").asText());
                    responseData.setDataRank(node.get("data_rank").asText());
                    responseData.setHtsKorIsnm(node.get("hts_kor_isnm").asText());
                    responseData.setStckPrpr(node.get("stck_prpr").asText());
                    responseData.setPrdyVrss(node.get("prdy_vrss").asText());
                    responseData.setPrdyVrssSign(node.get("prdy_vrss_sign").asText());
                    responseData.setPrdyCtrt(node.get("prdy_ctrt").asText());
                    responseData.setAcmlVol(node.get("acml_vol").asText());
                    responseData.setStckHgpr(node.get("stck_hgpr").asText());
                    responseData.setHgprHour(node.get("hgpr_hour").asText());
                    responseData.setAcmlHgprDate(node.get("acml_hgpr_date").asText());
                    responseData.setStckLwpr(node.get("stck_lwpr").asText());
                    responseData.setLwprHour(node.get("lwpr_hour").asText());
                    responseData.setAcmlLwprDate(node.get("acml_lwpr_date").asText());
                    responseData.setLwprVrssPrprRate(node.get("lwpr_vrss_prpr_rate").asText());
                    responseData.setDsgtDateClprVrssPrprRate(node.get("dsgt_date_clpr_vrss_prpr_rate").asText());
                    responseData.setCnntAscnDynu(node.get("cnnt_ascn_dynu").asText());
                    responseData.setHgprVrssPrprRate(node.get("hgpr_vrss_prpr_rate").asText());
                    responseData.setCnntDownDynu(node.get("cnnt_down_dynu").asText());
                    responseData.setOprcVrssPrprSign(node.get("oprc_vrss_prpr_sign").asText());
                    responseData.setOprcVrssPrpr(node.get("oprc_vrss_prpr").asText());
                    responseData.setOprcVrssPrprRate(node.get("oprc_vrss_prpr_rate").asText());
                    responseData.setPrdRsfl(node.get("prd_rsfl").asText());
                    responseData.setPrdRsflRate(node.get("prd_rsfl_rate").asText());

                    responseDataList.add(responseData);
                }
            }
            return Mono.just(responseDataList);
        } catch (Exception e) {
            return Mono.error(e);
        }
    }

    public Mono<List<FluctResponseOutput>> getFluctuation() {
        HttpHeaders headers = createHttpHeaders();

        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/uapi/domestic-stock/v1/ranking/fluctuation")
                        .queryParam("fid_cond_mrkt_div_code", "J")
                        .queryParam("fid_cond_scr_div_code", "20170")
                        .queryParam("fid_input_iscd", "0000")
                        .queryParam("fid_rank_sort_cls_code", "0")
                        .queryParam("fid_input_cnt_1", "0")
                        .queryParam("fid_prc_cls_code", "0")
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
