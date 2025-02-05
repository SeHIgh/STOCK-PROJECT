package com.example.stockproject.service;

import com.example.stockproject.dto.AccountResponseOutput;
import com.example.stockproject.dto.VolumeResponseOutput;
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
public class AccountService {
    @Value("${appkey2}")
    private String appkey;

    @Value("${appsecret2}")
    private String appSecret;

    @Value("${access_token2}")
    private String accessToken;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public AccountService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.baseUrl("https://openapivts.koreainvestment.com:29443").build();
        this.objectMapper =objectMapper;
    }

    //계좌잔고 조회를 위한 Header request
    private HttpHeaders createAccountHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
        headers.set("appkey", appkey);
        headers.set("appSecret", appSecret);
        headers.set("tr_id", "VTTC8434R");  //계좌잔고 조회
        return headers;
    }

    private Mono<List<AccountResponseOutput>> parseAccount(String response) {
        try {
            List<AccountResponseOutput> responseDataList = new ArrayList<>();
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode outputNode1 = rootNode.get("output1");   //header 중 output1내용
            JsonNode outputNode2 = rootNode.get("output2");   //header 중 output2내용

            if (outputNode1 != null) {
                for (JsonNode node : outputNode1) {
                    //System.out.println("output node: " + node.toPrettyString());
                    AccountResponseOutput responseData = new AccountResponseOutput();

                    responseData.setPdno(node.get("pdno").asText());
                    responseData.setPrdtName(node.get("prdt_name").asText());
                    responseData.setTradDvsnName(node.get("trad_dvsn_name").asText());
                    responseData.setThdtBuyqty(node.get("thdt_buyqty").asText());
                    responseData.setThdtSllqty(node.get("thdt_sll_qty").asText());

                    responseDataList.add(responseData);
                }
            }
            if (outputNode2 != null) {
                for (JsonNode node : outputNode2) {
                    //System.out.println("output node: " + node.toPrettyString());
                    AccountResponseOutput responseData2 = new AccountResponseOutput();

                    responseData2.setDncaTotAmt(node.get("dnca_tot_amt").asText());
                    responseData2.setThdtBuyAmt(node.get("thdt_buy_amt").asText());
                    responseData2.setThdtSllAmt(node.get("thdt_sll_amt").asText());
                    responseData2.setNassAmt(node.get("nass_amt").asText());

                    responseDataList.add(responseData2);
                }
            }
            return Mono.just(responseDataList);
        } catch (Exception e) {
            return Mono.error(e);
        }
    }

    //계좌잔고 조회를 위한 query parameter
    public Mono<List<AccountResponseOutput>> getAccountInformation() {
        HttpHeaders headers = createAccountHttpHeaders();

        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/uapi/domestic-stock/v1/trading/inquire-balance")
                        .queryParam("CANO", "50124326")
                        .queryParam("ACNT_PRDT_CD", "01")
                        .queryParam("AFHR_FLPR_YN", "N")
                        .queryParam("OFL_YN", "")
                        .queryParam("INQR_DVSN", "01")
                        .queryParam("UNPR_DVSN", "01")
                        .queryParam("FUND_STTL_ICLD_YN", "N")
                        .queryParam("FNCG_AMT_AUTO_RDPT_YN", "N")
                        .queryParam("PRCS_DVSN", "01")
                        .queryParam("CTX_AREA_FK100", "")
                        .queryParam("CTX_AREA_NK100", "")
                        .build())
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(response -> parseAccount(response));
    }
}
