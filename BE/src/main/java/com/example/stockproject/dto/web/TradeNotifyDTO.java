package com.example.stockproject.dto.web;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TradeNotifyDTO {
    private String orderType;   // 매도매수구분
    private String orderKind;   // 주문 종류 - 지정가, 시장가
    private String stockCode;   //종목코드
    private String stockName;   //종목명
    private String orderQuantity;   //주문수량
    private String executedQuantity;    //체결수량
    private String executedPrice;   //체결단가
    private String timestamp;       //체결 시간
    private String executionStatus; //체결여부 - 주문, 체결
}
