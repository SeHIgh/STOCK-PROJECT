package com.example.stockproject.dto.order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

//매수, 매도 시 필요한 정보
public class TradePossibleDTO {
    String stockName;
    String deposit; //예수금(매수 가능 금액)
    String holdingQuantity; //보유수량

    String stockPrice;
    String prdyCtrt;    //전일대비율
    String prdyVrss;    //전일대비
}
