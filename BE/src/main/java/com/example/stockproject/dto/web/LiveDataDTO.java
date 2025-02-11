package com.example.stockproject.dto.web;

import lombok.Getter;

//주가 지수 DTO
//KOSPI, KOSDAQ
@Getter
public class LiveDataDTO {
    private String trId;
    private String stockCode;
    private String timestamp;
    private String price;
    private String change;

    public LiveDataDTO(String trId, String stockCode, String timestamp, String price, String change) {
        this.trId = trId;
        this.stockCode = stockCode;
        this.timestamp = timestamp;
        this.price = price;
        this.change = change;
    }
}
