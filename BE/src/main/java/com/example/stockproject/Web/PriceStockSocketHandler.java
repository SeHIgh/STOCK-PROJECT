package com.example.stockproject.Web;

import ch.qos.logback.classic.Logger;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.Map;

public class PriceStockSocketHandler extends TextWebSocketHandler {

    private WebSocketSession session;
    private final String approvalKey;
    private final String trKey;

    private static final Logger logger = (Logger) LoggerFactory.getLogger(PriceStockSocketHandler.class);

    private ObjectMapper objectMapper = new ObjectMapper();

    public PriceStockSocketHandler(String approvalKey, String trKey) {
        this.approvalKey = approvalKey;
        this.trKey = trKey;
    }

    //WebSocket 연결이 성공하면 실행되는 메서드
    //연결이 완료되면 afterConnectionEstablished()가 실행됨.
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        this.session = session;
        super.afterConnectionEstablished(session);

        logger.info("✅ WebSocket 연결 성공! 세션 ID: {}", session.getId());

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
        input.put("tr_id", "H0STASP0");
        input.put("tr_key", trKey);

        body.put("input", input);

        // 최종 요청 데이터
        // header와 body를 합쳐 request 생성
        Map<String, Object> request = new HashMap<>();
        request.put("header", header);
        request.put("body", body);

        // JSON 변환 후 전송
        String jsonRequest = objectMapper.writeValueAsString(request);
        logger.info("📤 요청 전송: {}", jsonRequest);

        //session.sendMessage()를 이용해 JSON 데이터를 서버에 전송.
        session.sendMessage(new TextMessage(jsonRequest));
    }

    //response값 받아옴.
    //서버에서 메시지를 수신하면 handleTextMessage() 실행됨.
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        //서버로부터 메시지를 받았을 때 실행되는 코드
//        String stockInfo[] = message.getPayload().split("\\^");
//        if(stockInfo.length >1) {
//            System.out.println("현재 주식 현재 가격 : "+ stockInfo[1]);
//        }

        // 메시지 수신 로그
        logger.info("📩 메시지 수신: {}", message.getPayload());  // 메시지가 들어오는지 로그로 확인
        String payload = message.getPayload();

        try {
            // JSON 파싱
            Map<String, Object> responseMap = objectMapper.readValue(payload, Map.class);

            // "header"와 "body" 부분을 가져오기
            Map<String, Object> header = (Map<String, Object>) responseMap.get("header");
            Map<String, Object> body = (Map<String, Object>) responseMap.get("body");

            // body가 null이거나 비어있는 경우 예외 처리
            if (body == null || body.isEmpty()) {
                logger.warn("⚠️ body가 존재하지 않거나 비어 있습니다. 메시지를 확인하세요: {}", payload);
                return;
            }


            // "SUBSCRIBE SUCCESS" 확인 후 추가 요청 처리
            String msg1 = (String) body.get("msg1");

            // 구독 성공 메시지를 받았을 때만 요청을 보냄
            if ("SUBSCRIBE SUCCESS".equals(msg1)) {
                logger.info("✅ 구독 성공! 실시간 데이터를 수신할 준비 완료.");
                //sendSubscriptionRequest();
            }

            // 받은 JSON을 파싱하여 원하는 데이터를 추출하려면 ObjectMapper를 사용하면 됨
            // 예제: 메시지를 HashMap 형태로 변환

            // 필요한 데이터 추출
            String trId = (String) header.get("tr_id");
            String trKey = (String) header.get("tr_key");
            String messageCode = (String) body.get("msg_cd");
            String messageText = (String) body.get("msg1");

            // output 데이터 (실시간 주식 데이터)
            Map<String, Object> output = (Map<String, Object>) body.get("output");

            logger.info("📌 응답 데이터 - TR ID: {}, TR Key: {}, Message: {}, output: {}", trId, trKey, messageText, output);
            String iv = output != null ? (String) output.get("iv") : "N/A";
            String key = output != null ? (String) output.get("key") : "N/A";

            // 추출된 데이터 출력
            System.out.println("TR ID: " + trId);
            System.out.println("TR Key: " + trKey);
            System.out.println("Message Code: " + messageCode);
            System.out.println("Message Text: " + messageText);
            System.out.println("IV: " + iv);
            System.out.println("Key: " + key);
        } catch (Exception e) {
            logger.error("❌ 메시지 처리 중 오류 발생: {}", e.getMessage(), e);
        }
    }


    //5초마다 호출되는 핑 메시지 전송
    @Scheduled(fixedRate = 5000)
    public void sendPingMessage() {
        try {
            if (session != null) {
                if (session.isOpen()) {
                    logger.info("📤 PING 메시지 전송 시작");
                    String pingMessage = "{\"header\":{\"tr_id\":\"PINGPONG\"}}";
                    session.sendMessage(new TextMessage(pingMessage));
                    logger.info("📤 PING 메시지 전송");
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
