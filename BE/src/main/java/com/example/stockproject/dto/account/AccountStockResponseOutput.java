package com.example.stockproject.dto.account;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
// output1: 보유 주식 정보 DTO
public class AccountStockResponseOutput {
    private String pdno;
    private String prdtName;
    private String tradDvsnName;
    private String thdtBuyqty;
    private String thdtSllqty;
    private String hldg_qty;    //보유수량
    private String pchs_avg_pric;   //매입평균가
    private String prpr;    //현재가
    private String evlu_amt;    //평가금액
    private String evlu_pfls_amt;   //평가손익금액
    private String evlu_pfls_rt;    //평가손익률
}
