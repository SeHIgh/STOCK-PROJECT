package com.example.stockproject.dto.order;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class OrderRequest {
    private String cano;        // 계좌번호
    private String acntPrdtCd;  // 계좌상품코드
    private String pdno;        // 종목코드
    private String ordDvsn;     // 주문구분
    private String ordQty;      // 주문수량
    private String ordUnpr;     // 주문단가
}
