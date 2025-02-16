package com.example.stockproject.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class VolumeResponseOutput {
    // HTS 한글 종목명
    private String hts_kor_isnm;

    // 유가증권 단축 종목코드
    //private String mkscShrnIscd;

    // 데이터 순위
    private String data_rank;

    // 주식 현재가
    private String stck_prpr;

    // 전일 대비 부호
    //private String prdyVrssSign;

    // 전일 대비
    //private String prdyVrss;

    // 전일 대비율
    //private String prdy_ctrt;

    // 누적 거래량
    private String acml_vol;

    // 전일 거래량
    //private String prdyVol;

    // 상장 수주
    //private String lstnStcn;

    // 평균 거래량
    //private String avrgVol;

    // N일전종가대비현재가대비율
    //private String nBefrClprVrssPrprRate;

    // 거래량 증가율
    private String vol_inrt;

    // 거래량 회전율
    //private String volTnrt;

    // N일 거래량 회전율
    //private String ndayVolTnrt;

    // 평균 거래 대액
    //private String avrgTrPbmn;

    // 거래대금회전률
    //private String trPbmnTnrt;

    // N일 거래대금 회전율
    //private String ndayTrPbmnTnrt;

    // 누적 거래 대금
    private String acml_tr_pbmn;
}