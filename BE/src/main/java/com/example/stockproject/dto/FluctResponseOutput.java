package com.example.stockproject.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class FluctResponseOutput {
    //private String stckShrnIscd;  //주식 단축 종목코드
    private String data_rank;       //데이터 순위 o
    private String hts_kor_isnm;    //HTS한글 종목명 o
    private String stck_prpr;       //주식 현재가 o
    //private String prdy_vrss;       //전일대비
    //private String prdy_vrss_sign;  //전일대비 부호
    private String prdy_ctrt;       //전일 대비율 o
    private String acml_vol;         //누적 거래량
    private String acml_tr_pbmn;    //거래대금(현재가 * 거래량)
    //private String stckHgpr;
    //private String hgprHour;
    //private String acmlHgprDate;
    //private String stckLwpr;
    //private String lwprHour;
    //private String acmlLwprDate;
    //private String lwprVrssPrprRate;
    //private String dsgtDateClprVrssPrprRate;
    //private String cnntAscnDynu;
    //private String hgprVrssPrprRate;
    //private String cnntDownDynu;
    //private String oprcVrssPrprSign;
    //private String oprcVrssPrpr;
    //private String oprcVrssPrprRate;
    //private String prdRsfl;
    //private String prdRsflRate;

}


/*
            "stck_shrn_iscd": "000040",
            "data_rank": "1",
            "hts_kor_isnm": "KR모터스",
            "stck_prpr": "1821",
            "prdy_vrss": "197",
            "prdy_vrss_sign": "2",
            "prdy_ctrt": "12.13",
            "acml_vol": "2267183",
            "stck_hgpr": "1861",
            "hgpr_hour": "100214",
            "acml_hgpr_date": "20240318",
            "stck_lwpr": "1301",
            "lwpr_hour": "090239",
            "acml_lwpr_date": "20240318",
            "lwpr_vrss_prpr_rate": "39.97",
            "dsgt_date_clpr_vrss_prpr_rate": "12.13",
            "cnnt_ascn_dynu": "1",
            "hgpr_vrss_prpr_rate": "-2.15",
            "cnnt_down_dynu": "0",
            "oprc_vrss_prpr_sign": "2",
            "oprc_vrss_prpr": "0",
            "oprc_vrss_prpr_rate": "0.00",
            "prd_rsfl": "0",
            "prd_rsfl_rate": "0.00"
*/