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
    private String ordDvsn;     // 주문구분     //00: 지정가, 01:시장가
    private String ordQty;      // 주문수량
    private String ordUnpr;     // 주문단가     //지정가일때 희망가격, 시장가일때 0
}
