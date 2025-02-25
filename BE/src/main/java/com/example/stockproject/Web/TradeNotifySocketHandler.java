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

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class TradeNotifySocketHandler extends TextWebSocketHandler {
    private WebSocketSession session;

    @Value("${websocket.approval-key}")
    private String approvalKey;

    private static final Logger logger = (Logger) LoggerFactory.getLogger(PriceStockSocketHandler.class);

    private ObjectMapper objectMapper = new ObjectMapper();

    static String iv;
    static String key;

    //WebSocket 연결이 성공하면 실행되는 메서드
    //연결이 완료되면 afterConnectionEstablished()가 실행됨.
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        this.session = session;
        super.afterConnectionEstablished(session);

        logger.info("✅ 실시간 체결통보를 위한 WebSocket 연결 성공! 세션 ID: {}", session.getId());

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
        input.put("tr_id", "H0STCNI9"); //실시간 체결통보
        input.put("tr_key", "kang2383");  //HTS ID

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

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        logger.info("📩 메시지 수신: {}", payload); // 원본 메시지 확인

        try {
            if (payload.startsWith("{")) { // 1️⃣ JSON 형식 메시지 (연결 확인 등)
                handleJsonMessage(payload);
            } else { // 2️⃣ '|'와 '^'로 구분된 실시간 데이터
                handleNotifyData(payload);
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
                iv = jsonNode.path("body").path("output").path("iv").asText();
                key = jsonNode.path("body").path("output").path("key").asText();
                logger.info("🔑 보안키 수신: iv={}, key={}", iv, key);
            }
        } catch (Exception e) {
            logger.error("❌ JSON 메시지 처리 실패: {}", e.getMessage(), e);
        }
    }

    private void handleNotifyData(String payload) {
        try {

            //1|H0STCNI9|001|yuyTjvTaFlyAXq+cMZ1B0rT9z/yWdbpJEXqWfWXcAHtKzWSmt6FzZ8lOuYqOEqvCPf4GAYvnaXwkdKc5wF88XDC5PoRmcyHzb/J4VNVpe9qs/xttYjB5mnxs+JL/cOYEhBGkM6NHdQEkklCw1w5GY5kkg5tnKD4iAmDQu+hqF5ahYHyOWlj7Kr/WF80pKsWhrazqdExzshw8iXb1MqiH+sHtG5UBhqQTx/1IyTRShEA=
            //|로 분리 후 [3]인덱스를 복호화 해야함.

            // 여러 개의 메시지가 연속해서 오는 경우가 있음 -> `|`로 먼저 분리
            String[] messages = payload.split("\\|");

            String trNum = messages[0];
            String trId = messages[1]; // TR ID (예: H0STASP0)
            String msgCode = messages[2]; // 메시지 코드 (예: 001)
            String encryptedText = messages[3]; // 암호화된 문자열

            // 로그 출력
            logger.info("암호화된 메시지:{}", encryptedText);

            // 복호화 수행
            String encryptedResponse = encryptedText; // 실제 API 응답 데이터로 변경
            String decryptedResponse = decryptAES256(encryptedResponse, key, iv);

            logger.info("✅ 복호화된 데이터: " + decryptedResponse);
            //시장가 매수 주문접수
            //✅ 복호화된 데이터: kang2383^5012432601^0000045793^^[02]^0^[01]^0^032350^0000000010^000000000^144112^0^1^1^00950^000000010^강주호^롯데관광개발^10^^롯데관광개발^
            //매수 체결
            //✅ 복호화된 데이터: kang2383^5012432601^0000045793^^[02]^0^00^0^032350^0000000003^[000008130]^144130^0^[2]^2^00950^000000010^강주호^롯데관광개발^10^^롯데관광개발^000000000

             //시장가 매도 주문접수
            //✅ 복호화된 데이터: kang2383^5012432601^0000045798^^[01]^0^[01]^0^[032350]^[0000000005]^000000000^[144128]^0^[1]^1^00950^000000005^강주호^롯데관광개발^10^^롯데관광개발^
            //매도 체결
            //✅ 복호화된 데이터: kang2383^5012432601^0000045798^^[01]^0^00^0^032350^0000000005^[000008130]^144130^0^[2]^2^00950^000000005^강주호^롯데관광개발^10^^롯데관광개발^000000000

            //[13]을 통해서 전달해줄 데이터 나누면 됨. 1주문과 2체결일때의 각각 필요 정보 다름
            // '^'로 세부 데이터 분리
            String[] stockData = decryptedResponse.split("\\^");

            String orderType = stockData[4].equals("01") ? "매도" : "매수"; // 매도매수구분
            //String correctionType = stockData[5].equals("0") ? "정상" : stockData[5].equals("1") ? "정정" : "취소"; // 정정구분
            String orderKind = stockData[6].equals("00") ? "지정가" : "시장가"; // 주문 종류
            String stockCode = stockData[8]; // 종목 코드
            String executedQuantity = stockData[9]; // 체결 수량
            String executedPrice = stockData[10]; // 체결 단가
            String timestamp = stockData[11]; // 체결 시간
            String executionStatus = stockData[13].equals("1") ? "주문,정정,취소,거부" : "체결"; // 체결 여부
            String orderQuantity = stockData[16]; // 주문수량
            String stockName = stockData[18];     // 종목명
            //String orderPrice = stockData[19];    // 주문가격

            // 로그 출력
            logger.info("📊 주문구분: {}, 주문종류: {}, 종목코드: {}, 종목명: {}, 주문수량: {},,체결수량: {}, 체결단가: {}, 체결시간: {}, 체결여부: {}",
                    orderType, orderKind, stockCode, stockName, orderQuantity,executedQuantity, executedPrice, timestamp, executionStatus);

        } catch (Exception e) {
            logger.error("❌ 실시간 데이터 처리 실패: {}", e.getMessage(), e);
        }
    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        logger.info("❌ 실시간 체결가 WebSocket 연결 종료: {}", session.getId());
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
                    logger.info("📍 실시간 체결가를 위한 PING 메시지 전송");
                } else {
                    logger.warn("⚠️ WebSocket 세션이 열려 있지 않음");
                }
            }
//            else {
//                logger.warn("⚠️ WebSocket 세션이 null임");
//            }
        } catch (Exception e) {
            logger.error("❌ PING 메시지 전송 실패", e);
        }
    }

    //AES256 복호화
    public static String decryptAES256(String encryptedText, String key, String iv) throws Exception {
        byte[] keyBytes = key.getBytes("UTF-8");
        byte[] ivBytes = iv.getBytes("UTF-8");

        SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "AES");
        IvParameterSpec ivSpec = new IvParameterSpec(ivBytes);

        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, secretKey, ivSpec);

        byte[] decodedBytes = Base64.getDecoder().decode(encryptedText);
        byte[] decryptedBytes = cipher.doFinal(decodedBytes);

        return new String(decryptedBytes, "UTF-8").trim();
    }
}


