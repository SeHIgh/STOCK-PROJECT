package com.example.stockproject.dto.candle;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class MinuteCandleResponseOutput {
    String stck_cntg_hour;
    String stck_hgpr;
    String stck_lwpr;
    String stck_oprc;
    String stck_prpr;
    String cntg_vol;
}
