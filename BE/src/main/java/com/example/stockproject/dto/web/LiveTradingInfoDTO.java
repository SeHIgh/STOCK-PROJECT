package com.example.stockproject.dto.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LiveTradingInfoDTO {
    private String trade_price;         // 체결가
    private String change_rate;         // 전일 대비율
    private String trade_strength;      // 체결강도
    private String trade_volume;        // 체결 거래량
    private String trade_type;          // 체결구분 (1: 매수, 2: 매도)
    private String prev_accum_volumeRate; // 전일 동시간 누적 거래량 비율
    private String high_price;           //최고가
    private String low_price;            //최저가
    private String total_askp_price;    //총 매도호가 잔량 = 판매대기
    private String total_bid_price;     //총 매수호가 잔량 = 구매 대기
}
