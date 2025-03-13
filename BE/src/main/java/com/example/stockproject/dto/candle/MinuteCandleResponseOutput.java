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
    String stck_cntg_hour;  //주식체결시간
    String stck_hgpr;       //최고가
    String stck_lwpr;       //최저가
    String stck_oprc;       //시가
    String stck_prpr;       //현재가
    String cntg_vol;        //체결 거래량
}
