package com.example.stockproject.service;

import com.example.stockproject.dto.PriceResponseOutput;
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
import reactor.core.CoreSubscriber;
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
    private final ApiPriceService apiPriceService;
    @Autowired
    public AccountService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper, ApiPriceService apiPriceService) {
        this.webClient = webClientBuilder.baseUrl("https://openapivts.koreainvestment.com:29443").build();
        this.objectMapper =objectMapper;
        this.apiPriceService = apiPriceService;
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
                    stockData.setPrdtName(node.get("prdt_name").asText());
                    stockData.setEvlu_pfls_rt(node.get("evlu_pfls_rt").asText());
                    stockData.setEvlu_pfls_amt(node.get("evlu_pfls_amt").asText());
                    stockData.setPchs_avg_pric(node.get("pchs_avg_pric").asText());
                    stockData.setPrpr(node.get("prpr").asText());
                    stockData.setHldg_qty(node.get("hldg_qty").asText());
                    stockData.setEvlu_amt(node.get("evlu_amt").asText());
                    stockData.setPchs_amt(node.get("pchs_amt").asText());

                    // `getPriceByStockName`을 호출하고, `block()`을 사용하여 결과를 동기적으로 처리
//                    //종가 계산 (ApiPrice서비스에서 현재가와 전일대비 항목을 가져와 계산)
//                    String stockName = node.get("prdt_name").asText();
//                    Mono<PriceResponseOutput> priceData = new Mono<PriceResponseOutput>
//                    priceData = apiPriceService.getPriceByStockName(stockName).block();
//                    int currentPrice = Integer.parseInt(priceData.getStckPrpr());


//                    int priceChange = Integer.parseInt(priceData.getPrdyVrss());
//                    int previousClosePrice = currentPrice - priceChange;
//
//                    // 🔹 보유수량 가져오기
//                    int holdingQuantity = Integer.parseInt(node.get("hldg_qty").asText());
//
//                    // 🔹 일간 수익금 계산 (일간 수익금 = (현재가 - 전일 종가) × 보유수량)
//                    int int_dailyProfit = (currentPrice - previousClosePrice) * holdingQuantity;
//                    String dailyProfit = String.valueOf(int_dailyProfit);
//
//                    // 🔹 일간 수익률 계산 (일간 수익률 = ((현재가 - 전일 종가) / 전일 종가) × 100)
//                    double dailyProfitRate_double = ((double) (currentPrice - previousClosePrice) / previousClosePrice) * 100;
//                    String dailyProfitRate = String.format("%.2f", dailyProfitRate_double);
//
//                    stockData.setDaily_profit(dailyProfit);
//                    stockData.setDaily_profitRate(dailyProfitRate);

                    stockList.add(stockData);
                }
            }

            if (outputNode2 != null && outputNode2.size() > 0) {
                JsonNode node = outputNode2.get(0);
                balanceData.setDncaTotAmt(node.get("dnca_tot_amt").asText());
                balanceData.setThdtBuyAmt(node.get("thdt_buy_amt").asText());
                balanceData.setThdtSllAmt(node.get("thdt_sll_amt").asText());
                balanceData.setTotEvluAmt(node.get("tot_evlu_amt").asText());
                balanceData.setNassAmt(node.get("nass_amt").asText());
                balanceData.setEvluPflsSmtlAmt(node.get("evlu_pfls_smtl_amt").asText());
                balanceData.setAsstIcdcAmt(node.get("asst_icdc_amt").asText());
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
