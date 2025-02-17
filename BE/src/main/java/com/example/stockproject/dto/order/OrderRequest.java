package com.example.stockproject.dto.order;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class OrderRequest {
    private String CANO;        // 계좌번호
    private String ACNT_PRDT_CD;  // 계좌상품코드
    private String PDNO;        // 종목코드
    private String ORD_DVSN;     // 주문구분
    private String ORD_QTY;      // 주문수량
    private String ORD_UNPR;     // 주문단가
}
