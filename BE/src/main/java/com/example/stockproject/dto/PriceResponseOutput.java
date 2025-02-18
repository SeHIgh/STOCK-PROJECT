package com.example.stockproject.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class PriceResponseOutput {
    private String stckPrpr;                     // 주식 현재가
    //private String iscdStatClsCode;               // 종목 상태 구분
    private String rprsMrktKorName;              // 대표시장한글명
    private String bstpKorIsnm;                  // 업종 한글 종목
    private String prdyVrss;                     // 전일 대비
    private String prdyVrssSign;                 // 전일 대비 부호
    private String prdyCtrt;                     // 전일 대비율
    private String acmlVol;                      // 누적 거래량
    private String prdyVrssVolRate;              // 전일 대비 거래량 비율
    private String stckOprc;                     // 시가
    //종가 = 현재가  - 전일대비
    private String stckHgpr;                     // 최고가
    private String stckLwpr;                     // 최저가
    private String stckMxpr;                     // 상한가
    private String stckLlam;                     // 하한가
    private String stckSdpr;                     // 기준가
    private String lstnStcn;                     // 상장 주수
    private String per;                          // PER
    private String pbr;                          // PBR
    private String eps;                          // EPS
    private String bps;                          // BPS

//    private String d250Hgpr;                    //250일 최고가
//    private String d250HgprDate;                //250일 최고가 일자
//    private String d250HgprVrssPrprRate;        //250일 최고가 대비 현재 비율
//    private String d250Lwpr;                    //250일 최저가
//    private String d250LwprDate;
//    private String d250LwprVrssPrprRate;
//    private String stckDryyHgpr;                //연중 최고가
//    private String dryyHgprVrssPrprRate;        //연중 최고가 대비 현재가 비율
//    private String dryyHgprDate;              //연중 최고가 일자
//    private String stckDryyLwpr;               //연중 최저자
//    private String dryyLwprVrssPrprRate;
//    private String dryyLwprDate;
//    private String w52Hgpr;                     //52일 최고가
//    private String w52HgprVrssPrprCtrt;
//    private String w52HgprDate;
//    private String w52Lwpr;
//    private String w52LwprVrssPrprCtrt;
//    private String w52LwprDate;
//    private String frgnHldnQty;             //외국인 보유 수량
//    private String lastSstsCntgQty;       //최종공매도 체결수량
//    private String mrktWarnClsCode;         //시장경고코드
}

/*  sk하이닉스
    "iscd_stat_cls_code": "55",                //종목 상태 구분
    "marg_rate": "20.00",
    "rprs_mrkt_kor_name": "KOSPI200",       //대표시장한글명
    "bstp_kor_isnm": "전기.전자",              //업종 한글 종목
    "temp_stop_yn": "N",
    "oprc_rang_cont_yn": "N",
    "clpr_rang_cont_yn": "N",
    "crdt_able_yn": "Y",
    "grmn_rate_cls_code": "40",
    "elw_pblc_yn": "Y",
    "stck_prpr": "128500",                  //주식 현재가
    "prdy_vrss": "0",                       //전일 대비
    "prdy_vrss_sign": "3",                  //전일 대비 부호
    "prdy_ctrt": "0.00",                    //전일 대비율
    "acml_tr_pbmn": "344570137500",
    "acml_vol": "2669075",                  //누적 거래량
    "prdy_vrss_vol_rate": "75.14",          //전일 대비 거래량 비율
    "stck_oprc": "128500",                  //시가
    "stck_hgpr": "130000",                  //최고가
    "stck_lwpr": "128500",                  //최저가
    "stck_mxpr": "167000",                  //상한가
    "stck_llam": "90000",                   //하한가
    "stck_sdpr": "128500",                  //기준가
    "wghn_avrg_stck_prc": "129097.23",      //가중평균 주식가격
    "hts_frgn_ehrt": "49.48",
    "frgn_ntby_qty": "0",
    "pgtr_ntby_qty": "287715",
    "pvt_scnd_dmrs_prc": "131833",
    "pvt_frst_dmrs_prc": "130166",
    "pvt_pont_val": "128333",
    "pvt_frst_dmsp_prc": "126666",
    "pvt_scnd_dmsp_prc": "124833",
    "dmrs_val": "129250",
    "dmsp_val": "125750",
    "cpfn": "36577",
    "rstc_wdth_prc": "38500",
    "stck_fcam": "5000",
    "stck_sspr": "97660",
    "aspr_unit": "500",
    "hts_deal_qty_unit_val": "1",
    "lstn_stcn": "728002365",           //상장 주수
    "hts_avls": "935483",
    "per": "19.67",                     //per
    "pbr": "1.72",                      //pbr
    "stac_month": "12",
    "vol_tnrt": "0.37",
    "eps": "6532.00",                   //eps
    "bps": "74721.00",                  //bps
    "d250_hgpr": "149500",
    "d250_hgpr_date": "20210225",
    "d250_hgpr_vrss_prpr_rate": "-14.05",
    "d250_lwpr": "90500",
    "d250_lwpr_date": "20211013",
    "d250_lwpr_vrss_prpr_rate": "41.99",
    "stck_dryy_hgpr": "132500",
    "dryy_hgpr_vrss_prpr_rate": "-3.02",
    "dryy_hgpr_date": "20220103",
    "stck_dryy_lwpr": "121500",
    "dryy_lwpr_vrss_prpr_rate": "5.76",
    "dryy_lwpr_date": "20220105",
    "w52_hgpr": "149500",
    "w52_hgpr_vrss_prpr_ctrt": "-14.05",
    "w52_hgpr_date": "20210225",
    "w52_lwpr": "90500",
    "w52_lwpr_vrss_prpr_ctrt": "41.99",
    "w52_lwpr_date": "20211013",
    "whol_loan_rmnd_rate": "0.22",
    "ssts_yn": "Y",
    "stck_shrn_iscd": "000660",
    "fcam_cnnm": "5,000",
    "cpfn_cnnm": "36,576 억",
    "frgn_hldn_qty": "360220601",
    "vi_cls_code": "N",
    "ovtm_vi_cls_code": "N",
    "last_ssts_cntg_qty": "43916",
    "invt_caful_yn": "N",
    "mrkt_warn_cls_code": "00",
    "short_over_yn": "N",
    "sltr_yn": "N"
*/