package com.example.stockproject.Web;

import ch.qos.logback.classic.Logger;
import com.example.stockproject.repository.StockInfoRepository;
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
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Component
public class AskingPriceSocketHandler extends TextWebSocketHandler {
    private WebSocketSession session;
    private final StockInfoRepository stockInfoRepository;

    @Value("${websocket.approval-key}")
    private String approvalKey;

    @Setter
    private String trKey;

    private static final Logger logger = (Logger) LoggerFactory.getLogger(PriceStockSocketHandler.class);

    private ObjectMapper objectMapper = new ObjectMapper();

    public AskingPriceSocketHandler(StockInfoRepository stockInfoRepository) {
        this.stockInfoRepository = stockInfoRepository;
    }

    //WebSocket 연결이 성공하면 실행되는 메서드
    //연결이 완료되면 afterConnectionEstablished()가 실행됨.
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        this.session = session;
        super.afterConnectionEstablished(session);

        logger.info("✅ 실시간 호가를 위한 WebSocket 연결 성공! 세션 ID: {}", session.getId());

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

        // 한국투자증권 서버에 JSON으로 request를 만들기 위해
        Map<String, String> header = new HashMap<>();
        header.put("approval_key", approvalKey);
        header.put("tr_type", "1");
        header.put("custtype", "P");
        header.put("content-type", "utf-8");

        Map<String, Map<String, String>> body = new HashMap<>();
        Map<String, String> input = new HashMap<>();
        input.put("tr_id", "H0STASP0"); //실시간 호가
        input.put("tr_key", "005930");

        body.put("input", input);

        // 최종 요청 데이터
        // header와 body를 합쳐 request 생성
        Map<String, Object> request = new HashMap<>();
        request.put("header", header);
        request.put("body", body);

        // JSON 변환 후 전송
        String jsonRequest = objectMapper.writeValueAsString(request);
        logger.info("📤 서버에 구독 요청 전송: {}", jsonRequest);

        //session.sendMessage()를 이용해 JSON 데이터를 서버에 전송.
        session.sendMessage(new TextMessage(jsonRequest));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        logger.info("📩 메시지 수신: {}", payload); // 원본 메시지 확인

        handleJsonMessage(payload);
//        //오늘은 장이 안열려서 체결이 안되기 때문에 넘겨줄 데이터가 없음 그래서 여기서 임시로 데이터를 보내야할듯.
//
//        try {
//            if (payload.startsWith("{")) { // 1️⃣ JSON 형식 메시지 (연결 확인 등)
//                handleJsonMessage(payload);
//            } else { // 2️⃣ '|'와 '^'로 구분된 실시간 데이터
//                handleLiveData(payload);
//            }
//        } catch (Exception e) {
//            logger.error("❌ 메시지 처리 중 오류 발생: {}", e.getMessage(), e);
//        }
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

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        logger.info("❌ 실시간 호가 WebSocket 연결 종료: {}", session.getId());
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
                    logger.info("📍 실시간 호가를 위한 PING 메시지 전송");
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
