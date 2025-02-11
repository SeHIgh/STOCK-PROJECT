package com.example.stockproject.Web;

import ch.qos.logback.classic.Logger;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.Map;

@Component
public class KospiSocketHandler extends TextWebSocketHandler {

    private WebSocketSession session;

    @Value("${websocket.approval-key}")
    private String approvalKey;


    private static final Logger logger = (Logger) LoggerFactory.getLogger(PriceStockSocketHandler.class);

    private ObjectMapper objectMapper = new ObjectMapper();

    //WebSocket 연결이 성공하면 실행되는 메서드
    //연결이 완료되면 afterConnectionEstablished()가 실행됨.
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        this.session = session;
        super.afterConnectionEstablished(session);

        logger.info("✅ 실시간 KOSPI&KOSDAQ지수를 위한 WebSocket 연결 성공! 세션 ID: {}", session.getId());

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

    //필요 정보에 따라 구독 요청을 하면 됨.
    //sendSubscriptionRequest()에서 서버에 구독 요청 JSON 메시지를 전송.
    private void sendSubscriptionRequest() throws Exception {
        //2개의 구독 정보
        String[] marketKeys = {"0001", "1001"}; // KOSPI: 0001, KOSDAQ: 1001

        // 한국투자증권 서버에 JSON으로 request를 만들기 위해
        for (String marketKey : marketKeys) {
            Map<String, String> header = new HashMap<>();
            header.put("approval_key", approvalKey);
            header.put("tr_type", "1");
            header.put("custtype", "P");
            header.put("content-type", "utf-8");

            Map<String, Map<String, String>> body = new HashMap<>();
            Map<String, String> input = new HashMap<>();
            input.put("tr_id", "H0UPCNT0"); // 실시간 체결가 요청 ID
            input.put("tr_key", marketKey); // KOSPI:0001, KOSDAQ:1001

            body.put("input", input);

            // 최종 요청 데이터
            // header와 body를 합쳐 request 생성
            Map<String, Object> request = new HashMap<>();
            request.put("header", header);
            request.put("body", body);

            String jsonRequest = objectMapper.writeValueAsString(request);
            logger.info("📤 [{}] 요청 전송: {}", marketKey.equals("0001") ? "KOSPI" : "KOSDAQ", jsonRequest);

            session.sendMessage(new TextMessage(jsonRequest));
        }
    }


    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        logger.info("📩 메시지 수신: {}", payload); // 원본 메시지 확인

        try {
            if (payload.startsWith("{")) { // 1️⃣ JSON 형식 메시지 (연결 확인 등)
                handleJsonMessage(payload);
            } else { // 2️⃣ '|'와 '^'로 구분된 실시간 데이터
                handleLiveData(payload);
            }
        } catch (Exception e) {
            logger.error("❌ 메시지 처리 중 오류 발생: {}", e.getMessage(), e);
        }
    }

    private void handleJsonMessage(String payload) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(payload); //json문자열을 json트리구조로 변경

            String trId = jsonNode.path("header").path("tr_id").asText();   //트리구조의 key값 이용
            String trKey = jsonNode.path("header").path("tr_key").asText();
            String msgCode = jsonNode.path("body").path("msg_cd").asText();
            String msgText = jsonNode.path("body").path("msg1").asText();

            // "SUBSCRIBE SUCCESS" 확인 후 추가 요청 처리
            // 구독 성공 메시지를 받았을 때만 요청을 보냄
            if ("SUBSCRIBE SUCCESS".equals(msgText)) {
                logger.info("✅ 구독 성공! 실시간 데이터를 수신할 준비 완료.");
            }

            logger.info("📌 응답 데이터: tr_id={}, tr_key={}, msg_cd={}, msg={}", trId, trKey, msgCode, msgText);

            // 필요하면 보안 키(iv, key)도 저장
            if (jsonNode.path("body").has("output")) {
                String iv = jsonNode.path("body").path("output").path("iv").asText();
                String key = jsonNode.path("body").path("output").path("key").asText();
                logger.info("🔑 보안키 수신: iv={}, key={}", iv, key);
            }
        } catch (Exception e) {
            logger.error("❌ JSON 메시지 처리 실패: {}", e.getMessage(), e);
        }
    }

    private void handleLiveData(String payload) {
        try {
            // 여러 개의 메시지가 연속해서 오는 경우가 있음 -> `|`로 먼저 분리
            String[] messages = payload.split("\\|");

            String trNum = messages[0];
            String trId = messages[1]; // TR ID (예: H0UPCNT0)
            String msgCode = messages[2]; // 메시지 코드 (예: 001)
            String trKey = messages[3]; //KOSPI(0001) 또는 KOSDAQ(1001) 코드 포함

            // '^'로 세부 데이터 분리
            String[] stockData = messages[3].split("\\^");

            String stockCode = stockData[0];    // 종목 코드 (0001)
            String timestamp = stockData[1];    // 시간 (094719)
            String price = stockData[2];        // 현재가 (51000)
            String bstp_nmix_prdy_vrss = stockData[4];   //전일대비

            String marketType = "0001".equals(stockCode) ? "KOSPI" : "KOSDAQ"; // 시장 구분

            logger.info("📊 [{}] 실시간 데이터: TR ID={}, 종목 코드={}, 시간={}, 현재가={}, 전일대비={}",
                    marketType, trId, stockCode, timestamp, price, bstp_nmix_prdy_vrss);
        } catch (Exception e) {
            logger.error("❌ 실시간 데이터 처리 실패: {}", e.getMessage(), e);
        }
    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        logger.info("❌ 실시간 KOSPI&KOSDAQ 지수 WebSocket 연결 종료: {}", session.getId());
        this.session = null;  // 세션을 null로 설정하여 메모리 누수 방지
        super.afterConnectionClosed(session, status);  // 부모 클래스의 메서드 호출
    }

    //5초마다 호출되는 핑 메시지 전송
    @Scheduled(fixedRate = 5000)
    public void sendPingMessage() {
        try {
            if (session != null) {
                if (session.isOpen()) {
                    String pingMessage = "ping";
                    session.sendMessage(new TextMessage(pingMessage));
                    logger.info("📍 실시간 지수확인을 위한 PING 메시지 전송");
                } else {
                    logger.warn("⚠️ WebSocket 세션이 열려 있지 않음");
                }
            } else {
                logger.warn("⚠️ WebSocket 세션이 null임");
            }
        } catch (Exception e) {
            logger.error("❌ PING 메시지 전송 실패", e);
        }
    }
}
