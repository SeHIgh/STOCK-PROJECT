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
    //private String pdno;        //코드번호
    private String prdtName;    //상품명
    //private String evlu_erng_rt;    //평가수익률(=총 수익률) = 평가손익률과 같다고 보면 됨.
    private String evlu_pfls_rt;    //평가손익률
    private String evlu_pfls_amt;   //평가손익금액
    private String pchs_avg_pric;   //매입평균가
    private String prpr;            //현재가
    private String hldg_qty;         //보유수량
    private String evlu_amt;    //평가금액
    private String pchs_amt;        //매입금액  (총 매입금액 = 원금)
    private String daily_profit;      //일간수익
    private String daily_profitRate;    //일간수익금

    //private String ord_psbl_qty;    //주문가능수량

    //종목묭, 총 수익률, 총 수익금, 1주 평균금액, 현재가, 보유수량, 평가금, 원금, 일간수익x, 일간수익금x

    //일간 수익금 = (현재가 - 전일 종가) × 보유수량
    //일간 수익률 = (현재가 - 전일 종가) / 전일 종가 × 100(%)
}
