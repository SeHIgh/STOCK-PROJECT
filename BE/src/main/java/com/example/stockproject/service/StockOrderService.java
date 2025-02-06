package com.example.stockproject.service;

import com.example.stockproject.dto.order.OrderRequest;
import com.example.stockproject.dto.order.OrderResponseOutput;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StockOrderService {
    @Value("${appkey2}")
    private String appkey;

    @Value("${appsecret2}")
    private String appSecret;

    @Value("${access_token2}")
    private String accessToken;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public StockOrderService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.baseUrl("https://openapivts.koreainvestment.com:29443").build();
        this.objectMapper =objectMapper;
    }

    //주식 매수를 위한 Header request
    private HttpHeaders createOrderHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
        headers.set("appkey", appkey);
        headers.set("appSecret", appSecret);
        headers.set("tr_id", "VTTC0802U");  //주식 현금 매수 주문
        return headers;
    }

    private Mono<List<OrderResponseOutput>> parseOrderStock(String response) {
        try {
            List<OrderResponseOutput> responseDataList = new ArrayList<>();
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode outputNode = rootNode.get("output");

            if (outputNode != null) {
                if (outputNode.isArray()) {
                    for (JsonNode node : outputNode) {
                        OrderResponseOutput responseData = new OrderResponseOutput();
                        responseData.setODNO(node.get("ODNO").asText());
                        responseData.setORD_TMD(node.get("ORD_TMD").asText());
                        responseDataList.add(responseData);
                    }
                } else {
                    OrderResponseOutput responseData = new OrderResponseOutput();
                    responseData.setODNO(outputNode.get("ODNO").asText());
                    responseData.setORD_TMD(outputNode.get("ORD_TMD").asText());
                    responseDataList.add(responseData);
                }
            }
            return Mono.just(responseDataList);
        } catch (Exception e) {
            return Mono.error(e);
        }
    }



    //post 요청을 위한 body 데이터
    public Mono<List<OrderResponseOutput>> orderStock(OrderRequest orderRequest) {
        HttpHeaders headers = createOrderHttpHeaders();
//
//        OrderRequest orderRequest = new OrderRequest();
//        orderRequest.setCano("50124326");
//        orderRequest.setAcntPrdtCd("01");
//        orderRequest.setPdno("005930");
//        orderRequest.setOrdDvsn("00");
//        orderRequest.setOrdQty("5");
//        orderRequest.setOrdUnpr("53700");

        // 요청 바디 데이터
        Map<String, String> requestBody = new HashMap<>();

        requestBody.put("CANO", orderRequest.getCano());
        requestBody.put("ACNT_PRDT_CD", orderRequest.getAcntPrdtCd());
        requestBody.put("PDNO", orderRequest.getPdno());
        requestBody.put("ORD_DVSN", orderRequest.getOrdDvsn());
        requestBody.put("ORD_QTY", orderRequest.getOrdQty());
        requestBody.put("ORD_UNPR", orderRequest.getOrdUnpr());


        return webClient.post()
                .uri("/uapi/domestic-stock/v1/trading/order-cash")
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(this::parseOrderStock);
    }

}
