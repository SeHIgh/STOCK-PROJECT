package com.example.stockproject.dto.account;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
// output2: 잔고 정보 DTO
public class AccountBalanceResponseOutput {
    private String totEvluAmt;  //총평가금액 = 유가증권 평가금액 합계금액 + D+2 예수금

    private String principal;   //원금    계산필요
    private String dncaTotAmt;  // 예수금 총 금액
    private String evluPflsSmtlAmt; //평가손익합계금액

    //private String thdtBuyAmt;  // 금일 매수 금액
    //private String thdtSllAmt;  // 금일 매도 금액
    //private String nassAmt;     // 순자산 금액
    private String asstIcdcAmt; //자산증감액 (총 수익)

    //private String bfdy_tot_asst_evlu_amt;  //전일 총 자산평가금액
    private String daily_tot_profit;        //일간 수익
}

/*
토스증권 내투자 종목
내 투자 = 총 평가금액 tot_evlu_amt
원금 = 투자 + 총 수익
총 수익 = 평가손익합계금액 evlu_pfls_smtl_amt
일간 수익 = 전일평가금액 - 금일 평가 금액 = tot_evlu_amt - bfdy_tot_asst_evlu_amt
*/