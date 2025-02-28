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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AccountService {

    private static final Logger logger = LoggerFactory.getLogger(AccountService.class);

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
        JsonNode outputNode1 = rootNode.get("output1");
        JsonNode outputNode2 = rootNode.get("output2");

        if (outputNode1 != null) {
            List<Mono<AccountStockResponseOutput>> stockMonos = new ArrayList<>();

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

                String stockName = node.get("prdt_name").asText();
                //🔹 보유수량 가져오기
                int holdingQuantity = Integer.parseInt(node.get("hldg_qty").asText());

                Mono<AccountStockResponseOutput> stockMono = apiPriceService.getPriceByStockName(stockName)
                        .map(priceData -> {
                            if (priceData != null) {
                                //🔹 종가계산 (현재가와 전일대비 이용)
                                int currentPrice = Integer.parseInt(priceData.getStckPrpr());
                                int priceChange = Integer.parseInt(priceData.getPrdyVrss());
                                int previousClosePrice = currentPrice - priceChange;
                                //🔹 일간 수익금 계산 (일간 수익금 = (현재가 - 전일 종가) × 보유수량)
                                int int_dailyProfit = (currentPrice - previousClosePrice) * holdingQuantity;
                                //🔹 일간 수익률 계산 (일간 수익률 = ((현재가 - 전일 종가) / 전일 종가) × 100)
                                double double_dailyProfitRate = ((double) (currentPrice - previousClosePrice) / previousClosePrice) * 100;

                                String dailyProfit = String.valueOf(int_dailyProfit);
                                String dailyProfitRate = String.format("%.2f", double_dailyProfitRate);

                                stockData.setDaily_profit(dailyProfit);
                                stockData.setDaily_profit_rate(dailyProfitRate);

                                logger.info("🔖Stock: {}, Current Price: {}, Previous Close Price: {}, Holding Quantity: {}, Daily Profit: {}, Daily Profit Rate: {}",
                                        stockName, currentPrice, previousClosePrice, holdingQuantity, dailyProfit, dailyProfitRate);
                            }
                            else{
                                logger.warn("❗️해당 종목의 가격 정보를 가져올 수 없습니다: {}", stockName);
                            }
                            return stockData;
                        });

                stockMonos.add(stockMono);
            }

            return Mono.zip(stockMonos, objects -> {
                for (Object obj : objects) {
                    stockList.add((AccountStockResponseOutput) obj);
                }
                result.addAll(stockList);
                if (outputNode2 != null && outputNode2.size() > 0) {
                    JsonNode node = outputNode2.get(0);
                    balanceData.setTotEvluAmt(node.get("tot_evlu_amt").asText());
                    balanceData.setDncaTotAmt(node.get("dnca_tot_amt").asText());
                    balanceData.setEvluPflsSmtlAmt(node.get("evlu_pfls_smtl_amt").asText());
                    //balanceData.setThdtBuyAmt(node.get("thdt_buy_amt").asText());
                    //balanceData.setThdtSllAmt(node.get("thdt_sll_amt").asText());
                    //balanceData.setNassAmt(node.get("nass_amt").asText());
                    balanceData.setAsstIcdcAmt(node.get("asst_icdc_amt").asText());
                    //balanceData.setBfdy_tot_asst_evlu_amt(node.get("bfdy_tot_asst_evlu_amt").asText());

                    // 일간 수익 계산
                    double totEvluAmt = node.get("tot_evlu_amt").asDouble();  // 오늘의 총 평가금액
                    double bfdyTotAsstEvluAmt = node.get("bfdy_tot_asst_evlu_amt").asDouble();  // 전일 평가금액
                    double dailyTotProfit = totEvluAmt - bfdyTotAsstEvluAmt;  // 일간 수익 계산

                    balanceData.setDaily_tot_profit(String.valueOf(dailyTotProfit)); // 일간 수익

                    // 원금 계산 (수정됨)
//                    double pchsAmtSmtlAmt = node.get("pchs_amt_smtl_amt").asDouble(); // 매입금액 합계
//                    double totStlnSlngChgs = node.get("tot_stln_slng_chgs").asDouble(); // 총 매도금액 합계
//
//                    double principal = bfdyTotAsstEvluAmt + pchsAmtSmtlAmt - totStlnSlngChgs; // 원금 계산
//                    balanceData.setPrincipal(String.valueOf(principal)); // 원금 저장


                    // 원금 계산 (수정됨)
                    double pchsAmtSmtlAmt = node.get("pchs_amt_smtl_amt").asDouble(0.0);  // 매입금액 합계
                    double bfdySllAmt = node.get("bfdy_sll_amt").asDouble(0.0);  // 전일 매도금액
                    double thdtSllAmt = node.get("thdt_sll_amt").asDouble(0.0);  // 금일 매도금액
                    double totalSellAmt = bfdySllAmt + thdtSllAmt;  // 총 매도금액 계산

                    double principal = bfdyTotAsstEvluAmt + pchsAmtSmtlAmt - totalSellAmt;  // 원금 계산
                    balanceData.setPrincipal(String.valueOf(principal));  // 원금 저장
                    result.add(balanceData);
                }
                return result;
            });
        }

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


//    간단한 비동기 처리 -> 오류남. Mono로 처리했기 때문에 block()이 안되는것같음.
//    private Mono<List<Object>> parseAccount(String response) {
//        try {
//            List<Object> result = new ArrayList<>();
//            List<AccountStockResponseOutput> stockList = new ArrayList<>();
//            AccountBalanceResponseOutput balanceData = new AccountBalanceResponseOutput();
//
//            JsonNode rootNode = objectMapper.readTree(response);
//            JsonNode outputNode1 = rootNode.get("output1");   // 보유 주식 정보
//            JsonNode outputNode2 = rootNode.get("output2");   // 잔고 정보
//
//            if (outputNode1 != null) {
//                for (JsonNode node : outputNode1) {
//                    AccountStockResponseOutput stockData = new AccountStockResponseOutput();
//                    stockData.setPrdtName(node.get("prdt_name").asText());
//                    stockData.setEvlu_pfls_rt(node.get("evlu_pfls_rt").asText());
//                    stockData.setEvlu_pfls_amt(node.get("evlu_pfls_amt").asText());
//                    stockData.setPchs_avg_pric(node.get("pchs_avg_pric").asText());
//                    stockData.setPrpr(node.get("prpr").asText());
//                    stockData.setHldg_qty(node.get("hldg_qty").asText());
//                    stockData.setEvlu_amt(node.get("evlu_amt").asText());
//                    stockData.setPchs_amt(node.get("pchs_amt").asText());
//
//                     //2`getPriceByStockName`을 호출하고, `block()`을 사용하여 결과를 동기적으로 처리
//                    String stockName = node.get("prdt_name").asText();
//                    int holdingQuantity = Integer.parseInt(node.get("hldg_qty").asText());
//
//                    PriceResponseOutput priceData = apiPriceService.getPriceByStockName(stockName).block();
//                    if (priceData != null) {
//                        int currentPrice = Integer.parseInt(priceData.getStckPrpr());
//                        int priceChange = Integer.parseInt(priceData.getPrdyVrss());
//                        int previousClosePrice = currentPrice - priceChange;
//
//                        int int_dailyProfit = (currentPrice - previousClosePrice) * holdingQuantity;
//                        double double_dailyProfitRate = ((double) (currentPrice - previousClosePrice) / previousClosePrice) * 100;
//
//                        String dailyProfit = String.valueOf(int_dailyProfit);
//                        String dailyProfitRate = String.format("%.2f", double_dailyProfitRate);
//
//                        logger.info("🔖Stock: {}, Current Price: {}, Previous Close Price: {}, Holding Quantity: {}, Daily Profit: {}, Daily Profit Rate: {}",
//                                stockName, currentPrice, previousClosePrice, holdingQuantity, dailyProfit, dailyProfitRate);
//
//                        stockData.setDaily_profit(dailyProfit);
//                        stockData.setDaily_profit_rate(dailyProfitRate);
//                    }
//                }
//            }
//
//            if (outputNode2 != null && outputNode2.size() > 0) {
//                JsonNode node = outputNode2.get(0);
//                balanceData.setDncaTotAmt(node.get("dnca_tot_amt").asText());
//                balanceData.setThdtBuyAmt(node.get("thdt_buy_amt").asText());
//                balanceData.setThdtSllAmt(node.get("thdt_sll_amt").asText());
//                balanceData.setTotEvluAmt(node.get("tot_evlu_amt").asText());
//                balanceData.setNassAmt(node.get("nass_amt").asText());
//                balanceData.setEvluPflsSmtlAmt(node.get("evlu_pfls_smtl_amt").asText());
//                balanceData.setAsstIcdcAmt(node.get("asst_icdc_amt").asText());
//            }
//
//            // 두 개의 리스트를 하나의 List<Object>로 반환
//            result.addAll(stockList);
//            result.add(balanceData);
//
//            return Mono.just(result);
//        } catch (Exception e) {
//            return Mono.error(e);
//        }
//    }