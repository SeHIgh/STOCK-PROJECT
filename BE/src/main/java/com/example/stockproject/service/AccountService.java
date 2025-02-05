package com.example.stockproject.service;

import com.example.stockproject.dto.account.AccountBalanceResponseOutput;
import com.example.stockproject.dto.account.AccountStockResponseOutput;
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

    private Mono<List<Object>> parseAccount(String response) {
        try {
            List<Object> result = new ArrayList<>();
            List<AccountStockResponseOutput> stockList = new ArrayList<>();
            AccountBalanceResponseOutput balanceData = new AccountBalanceResponseOutput();

            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode outputNode1 = rootNode.get("output1");   // 보유 주식 정보
            JsonNode outputNode2 = rootNode.get("output2");   // 잔고 정보

            if (outputNode1 != null) {
                for (JsonNode node : outputNode1) {
                    AccountStockResponseOutput stockData = new AccountStockResponseOutput();
                    stockData.setPdno(node.get("pdno").asText());
                    stockData.setPrdtName(node.get("prdt_name").asText());
                    stockData.setTradDvsnName(node.get("trad_dvsn_name").asText());
                    stockData.setThdtBuyqty(node.get("thdt_buyqty").asText());
                    stockData.setThdtSllqty(node.get("thdt_sll_qty").asText());
                    stockList.add(stockData);
                }
            }

            if (outputNode2 != null && outputNode2.size() > 0) {
                JsonNode node = outputNode2.get(0);
                balanceData.setDncaTotAmt(node.get("dnca_tot_amt").asText());
                balanceData.setThdtBuyAmt(node.get("thdt_buy_amt").asText());
                balanceData.setThdtSllAmt(node.get("thdt_sll_amt").asText());
                balanceData.setNassAmt(node.get("nass_amt").asText());
            }

            // 두 개의 리스트를 하나의 List<Object>로 반환
            result.addAll(stockList);
            result.add(balanceData);

            return Mono.just(result);
        } catch (Exception e) {
            return Mono.error(e);
        }
    }


    //계좌잔고 조회를 위한 query parameter
    public Mono<List<Object>> getAccountInformation() {
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
                .flatMap(response -> parseAccount(response));  // parseAccount() 반환 타입 변경됨
    }

}
