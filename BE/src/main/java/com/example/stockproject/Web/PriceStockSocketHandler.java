package com.example.stockproject.Web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.Map;

public class PriceStockSocketHandler extends TextWebSocketHandler {

    private WebSocketSession session;
    private final String approvalKey;
    private final String trKey;

    private ObjectMapper objectMapper = new ObjectMapper();

    public PriceStockSocketHandler(String approvalKey, String trKey) {
        this.approvalKey = approvalKey;
        this.trKey = trKey;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        this.session = session;
        super.afterConnectionEstablished(session);

        //요청메시지 생성 및 전송
        buildRequest();
    }

    @Override
    //response값 받아옴.
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        //서버로부터 메시지를 받았을 때 실행되는 코드
//        String stockInfo[] = message.getPayload().split("\\^");
//        if(stockInfo.length >1) {
//            System.out.println("현재 주식 현재 가격 : "+ stockInfo[1]);
//        }

        //한국투자증권 서버에서 JSON으로 request를 만들기 위해
        Map<String, String> header = new HashMap<>();
        header.put("approval_key", approvalKey);
        header.put("tr_type", "1");
        header.put("custtype","P");
        header.put("content-type","utf-8");

        Map<String,Map<String, String>> body = new HashMap<>();
        Map<String, String> input = new HashMap<>();
        input.put("tr_id", "HOSTASPO");
        input.put("tr_id", trKey);
        body.put("input", input);

        //위의 두개를 합침
        Map<String, Object> requset = new HashMap<>();
        requset.put("header", header);
        requset.put("body", body);
        System.out.println(requset);
        String jsonRequest = objectMapper.writeValueAsString(requset);

        session.sendMessage(new TextMessage(jsonRequest));
    }

    protected void buildRequest() {
    }
}
