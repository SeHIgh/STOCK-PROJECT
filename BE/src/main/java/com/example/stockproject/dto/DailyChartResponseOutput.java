package com.example.stockproject.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor
@ToString
public class DailyChartResponseOutput {
    private String stck_bsop_date;
    private String stck_clpr;
    private String stck_hgpr;
}


/*

"output2": [
            {
                "acml_tr_pbmn": "237914727500",
                "acml_vol": "2203472",
                "flng_cls_code": "00",
                "mod_yn": "N",
                "prdy_vrss": "0",
                "prdy_vrss_sign": "3",
                "prtt_rate": "0.00",
                "revl_issu_reas": "",
                "stck_bsop_date": "20220509",
                "stck_clpr": "107500",
                "stck_hgpr": "109000",
                "stck_lwpr": "106500",
                "stck_oprc": "107000"
            },

 */