package com.example.stockproject.Web;

import ch.qos.logback.classic.Logger;
import com.example.stockproject.dto.web.LiveTradingInfoDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Setter;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Component
public class LiveDataSocketHandler extends TextWebSocketHandler {
    private WebSocketSession session;

    @Value("${websocket.approval-key}")
    private String approvalKey;

    // tr_key 값을 동적으로 설정할 수 있도록 setter 메서드 추가
    //    @Value("${websocket.tr-key}")

    @Setter
    private String trKey;

    private static final Logger logger = (Logger) LoggerFactory.getLogger(PriceStockSocketHandler.class);

    private ObjectMapper objectMapper = new ObjectMapper();

    //WebSocket 연결이 성공하면 실행되는 메서드
    //연결이 완료되면 afterConnectionEstablished()가 실행됨.
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        this.session = session;
        super.afterConnectionEstablished(session);

        logger.info("✅실시간 호가 & 체결가 정보를 위한 WebSocket 연결 성공! 세션 ID: {}", session.getId());

        //buildRequest()를 호출하여 구독 요청을 보냄.
        buildRequest();
    }

    //요청 로직
    //WebSocket연결이 성공하면 buildRequset()호출하여 구독요청
    protected void buildRequest() {
        try {
            sendSubscriptionRequest(); // 구독 요청 전송, json형식으로 서버에 전송
        } catch (Exception e) {
            logger.error("❌ 구독 요청 전송 중 오류 발생", e);
        }
    }

    private void sendSubscriptionRequest() throws Exception {
        // 한국투자증권 서버에 JSON으로 request를 만들기 위해 공통 헤더 생성
        Map<String, String> header = new HashMap<>();
        header.put("approval_key", approvalKey);
        header.put("tr_type", "1");
        header.put("custtype", "P");
        header.put("content-type", "utf-8");

        // 체결가 구독 요청 (tr_id: H0STCNT0)
        sendSingleSubscription(header, "H0STCNT0");

        // 호가 구독 요청 (tr_id: H0STASP0)
        sendSingleSubscription(header, "H0STASP0");
    }

    private void sendSingleSubscription(Map<String, String> header, String trId) throws Exception {
        // 요청 Body 생성
        Map<String, Map<String, String>> body = new HashMap<>();
        Map<String, String> input = new HashMap<>();
        input.put("tr_id", trId); //실시간 호가
        input.put("tr_key", trKey);

        body.put("input", input);

        // 최종 요청 데이터 생성
        Map<String, Object> request = new HashMap<>();
        request.put("header", header);
        request.put("body", body);

        // JSON 변환 후 전송
        String jsonRequest = objectMapper.writeValueAsString(request);
        logger.info("📤 서버에 구독 요청 전송 (tr_id: {}): {}", trId, jsonRequest);

        // WebSocket을 통해 메시지 전송
        session.sendMessage(new TextMessage(jsonRequest));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        logger.info("📩 메시지 수신: {}", payload); // 원본 메시지 확인

        try {
            if (payload.startsWith("{")) { // JSON 형식 메시지 (연결 확인 등)
                handleJsonMessage(payload);
            } else { // '|'와 '^'로 구분된 실시간 데이터
                handleLiveData(payload);
            }
        } catch (Exception e) {
            logger.error("❌ 메시지 처리 중 오류 발생: {}", e.getMessage(), e);
        }
    }

    private void handleJsonMessage(String payload) {
        try {
            JsonNode jsonNode = objectMapper.readTree(payload); // JSON 문자열을 JSON 트리 구조로 변경

            String trId = jsonNode.path("header").path("tr_id").asText();  // 트리 구조에서 tr_id 값을 추출
            String msgText = jsonNode.path("body").path("msg1").asText();

            // "SUBSCRIBE SUCCESS" 메시지를 확인하여 구독 성공 여부를 처리
            if ("SUBSCRIBE SUCCESS".equals(msgText)) {
                if ("H0STCNT0".equals(trId)) {
                    logger.info("✅ 체결가 구독 성공!");
                } else if ("H0STASP0".equals(trId)) {
                    logger.info("✅ 호가 구독 성공!");
                }
            }

            //logger.info("📌 응답 데이터: tr_id={}, msg={}", trId, msgText);
        } catch (Exception e) {
            logger.error("❌ JSON 메시지 처리 실패: {}", e.getMessage(), e);
        }
    }

    private void handleLiveData(String payload) {
        try {
            // 여러 개의 메시지가 연속해서 올 수 있으므로 `|`로 먼저 분리
            String[] messages = payload.split("\\|");

            String trId = messages[1]; // TR ID (예: H0STASP0, H0STCNT0)

            // 각 tr_id에 따라 처리
            if ("H0STCNT0".equals(trId)) { // 체결가
                handleTradePriceData(messages);
            } else if ("H0STASP0".equals(trId)) { // 호가
                handleAskingPriceData(messages);
            }

        } catch (Exception e) {
            logger.error("❌ 실시간 데이터 처리 실패: {}", e.getMessage(), e);
        }
    }

    // 체결가 데이터 처리
    private void handleTradePriceData(String[] messages) {
        try {
            // 여러 개의 메시지가 연속해서 오는 경우가 있음 -> `|`로 먼저 분리
            //String[] messages = payload.split("\\|");

            String trNum = messages[0];
            String trId = messages[1]; // TR ID (예: H0STASP0)
            String msgCode = messages[2]; // 메시지 코드 (예: 001)
            String trKey = messages[3]; // 종목 코드 포함 데이터

            // '^'로 세부 데이터 분리
            String[] stockData = messages[3].split("\\^");

            String stockCode = stockData[0]; // 종목 코드 (005930)
            String timestamp = stockData[1]; // 시간 (094719)

            String tradePrice = stockData[2];         // 체결가
            String changeRate = stockData[5];         // 전일 대비율
            String tradeStrength= stockData[18];      // 체결강도
            String tradeVolume = stockData[12];        // 체결 거래량
            String tradeType = stockData[21];          // 체결구분 (1: 매수, 2: 매도)
            String prevAccumVolumeRate = stockData[42]; // 전일 동시간 누적 거래량 비율
            String highPrice = stockData[8];           //최고가
            String lowPrice = stockData[9];            //최저가
            String totalAskpPrice = stockData[38];    //총 매도호가 잔량
            String totalBidPrice = stockData[39];     //총 매수호가 잔량
            String time = timestamp;
            String opening_price = stockData[7];        //주식 시가

            //현재가와 전일대비율로 전일종가계산
            double current_price = Double.parseDouble(tradePrice);
            double change_rate = Double.parseDouble(changeRate);
            //종가
            double prev_close_price = current_price / (1 + change_rate / 100);

            //상한가, 하한가 계산 (전일종가대비 30% 증가, 감소)
            double upper_limit_price = prev_close_price * 1.3;  // 상한가: 전일 종가의 130%
            double lower_limit_price = prev_close_price * 0.7;  // 하한가: 전일 종가의 70%

            // double 값을 소수점 없이 String으로 변환
            String upperLimitPrice = String.format("%.0f", upper_limit_price);  // 소수점 없이 변환
            String lowerLimitPrice = String.format("%.0f", lower_limit_price);  // 소수점 없이 변환

            // DTO 객체 생성
            LiveTradingInfoDTO tradeInfoDTO = new LiveTradingInfoDTO(tradePrice, changeRate, tradeStrength, tradeVolume, tradeType, prevAccumVolumeRate,
                    highPrice, lowPrice, totalAskpPrice, totalBidPrice, time,
                    opening_price, upperLimitPrice, lowerLimitPrice);

            Map<String, Object> tradeInfo = new HashMap<>();
            tradeInfo.put("type","tradeInfo");
            tradeInfo.put("data", tradeInfoDTO);

            // JSON 변환
            ObjectMapper objectMapper = new ObjectMapper();
            String tradeInfoJson = objectMapper.writeValueAsString(tradeInfo);

            // 로그 출력
            logger.info("📊 실시간 거래 정보: {}", tradeInfoJson);

            // WebSocket을 통해 JSON 전송
            if (session != null && session.isOpen()) {
                session.sendMessage(new TextMessage(tradeInfoJson));
                logger.info("📤 프론트엔드로 실시간 체결가 정보 전송: {}", tradeInfoJson);
            } else {
                logger.warn("⚠️ WebSocket 세션이 닫혀 있어 데이터를 전송할 수 없음.");
            }

        } catch (Exception e) {
            logger.error("❌ 실시간 데이터 처리 실패: {}", e.getMessage(), e);
        }
    }


    // 호가 데이터 처리
    private void handleAskingPriceData(String[] messages) {
        try {
            /*
            005930^093730^0^71900^72000^72100^72200^72300^72400^72500^72600^72700^72800^71800^
            71700^71600^71500^71400^71300^71200^71100^71000^70900^91918^117942^92673^79708^106729^141988^176192^113906^134077^
            104229^95221^159371^220746^284657^212742^195370^182710^209747^376432^158171^1159362^2095167^0^0^0^0^525579^-72000^
            5^-100.00^3159115^0^8^0^0^0
             */

            // 여러 개의 메시지가 연속해서 오는 경우가 있음 -> `|`로 먼저 분리
            //String[] messages = payload.split("\\|");

            String trNum = messages[0];
            String trId = messages[1]; // TR ID (예: H0STASP0)
            String msgCode = messages[2]; // 메시지 코드 (예: 001)
            String trKey = messages[3]; // 종목 코드 포함 데이터

            // '^'로 세부 데이터 분리
            String[] stockData = messages[3].split("\\^");

            String stockCode = stockData[0]; // 종목 코드 (005930)
            String timestamp = stockData[1]; // 시간 (094719)
            String HOUR_CLS_CODE = stockData[2]; // 시간구분코드 0:장중

            Map<String, Object> dataMap = new HashMap<>();

            //매도호가
            dataMap.put("askPrices", Arrays.asList(
                    stockData[3], stockData[4], stockData[5], stockData[6], stockData[7],
                    stockData[8], stockData[9], stockData[10], stockData[11], stockData[12]
            ));

            //매수호가
            dataMap.put("bidPrices", Arrays.asList(
                    stockData[13], stockData[14], stockData[15], stockData[16], stockData[17],
                    stockData[18], stockData[19], stockData[20], stockData[21], stockData[22]
            ));

            //매도 잔량
            dataMap.put("askVolumes", Arrays.asList(
                    stockData[23], stockData[24], stockData[25], stockData[26], stockData[27],
                    stockData[28], stockData[29], stockData[30], stockData[31], stockData[32]
            ));

            //매수 잔량
            dataMap.put("bidVolumes", Arrays.asList(
                    stockData[33], stockData[34], stockData[35], stockData[36], stockData[37],
                    stockData[38], stockData[39], stockData[40], stockData[41], stockData[42]
            ));

            Map<String, Object> quoteInfo = new HashMap<>();
            quoteInfo.put("type", "quoteInfo");
            quoteInfo.put("data", dataMap);

            ObjectMapper objectMapper = new ObjectMapper();
            String quoteInfoJson = objectMapper.writeValueAsString(quoteInfo);

            // 로그 출력
            logger.info("📊 실시간 데이터: TR ID={}, 종목 코드={}, 시간={}", trId, stockCode, timestamp);

            // WebSocket 세션이 열려 있다면 JSON 데이터 전송
            if (session != null && session.isOpen()) {
                session.sendMessage(new TextMessage(quoteInfoJson));
                logger.info("📤 프론트엔드로 실시간 호가 정보 전송: {}", quoteInfoJson);
            } else {
                logger.warn("⚠️ WebSocket 세션이 닫혀 있어 데이터를 전송할 수 없음.");
            }

        } catch (Exception e) {
            logger.error("❌ 실시간 데이터 처리 실패: {}", e.getMessage(), e);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        logger.info("❌ 실시간 호가 WebSocket 연결 종료: {}", session.getId());
        this.session = null;  // 세션을 null로 설정하여 메모리 누수 방지
        super.afterConnectionClosed(session, status);  // 부모 클래스의 메서드 호출
    }

    // 5초마다 핑 메시지 전송
    @Scheduled(fixedRate = 5000)
    public void sendPingMessage() {
        try {
            if (session != null && session.isOpen()) {
                String pingMessage = "ping";
                session.sendMessage(new TextMessage(pingMessage));
                logger.info("📍 실시간 체결가 및 호가 정보를 위한 PING 메시지 전송");
            }
        } catch (Exception e) {
            logger.error("❌ PING 메시지 전송 실패", e);
        }
    }

}
