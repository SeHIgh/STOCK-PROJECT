package com.example.stockproject.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class AccountResponseOutput {
    //output1
    private String pdno;
    private String prdtName;
    private String tradDvsnName;
    private String thdtBuyqty;
    private String thdtSllqty;;

    //output2
    private String dncaTotAmt;  //예수금총금액
    private String thdtBuyAmt;  //금일매수금액
    private String thdtSllAmt;    //금일매도금액
    private String nassAmt; //순자산금액
}

/*  output1(Array)과 output2(Array)개의 결과로 이루어져 있음.

       pdno": "009150",
      "prdt_name": "삼성전기",
      "trad_dvsn_name": "현금",
      "bfdy_buy_qty": "12",
      "bfdy_sll_qty": "0",
      "thdt_buyqty": "1686",
      "thdt_sll_qty": "41",
      "hldg_qty": "1657",
      "ord_psbl_qty": "1611",
      "pchs_avg_pric": "135440.2517",
      "pchs_amt": "224424497",
      "prpr": "0",
      "evlu_amt": "0",
      "evlu_pfls_amt": "0",
      "evlu_pfls_rt": "0.00",
      "evlu_erng_rt": "0.00000000",
      "loan_dt": "",
      "loan_amt": "0",
      "stln_slng_chgs": "0",
      "expd_dt": "",
      "fltt_rt": "-100.00000000",
      "bfdy_cprs_icdc": "-184500",
      "item_mgna_rt_name": "",
      "grta_rt_name": "",
      "sbst_pric": "140220",
      "stck_loan_unpr": "0.0000"
 */