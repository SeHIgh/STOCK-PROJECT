package com.example.stockproject.dto.order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

//매수, 매도 시 필요한 정보
public class TradePossibleDTO {
    private String stockName;
    private String deposit; //예수금(매수 가능 금액)
    private String holdingQuantity; //보유수량
}
