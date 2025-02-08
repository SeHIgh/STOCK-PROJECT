package com.example.stockproject.dto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "stock_info")
public class StockInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //1열
    @Column(name="stock_code", nullable = false, unique = true)
    private String stockCode;   //종목코드

    //2열
    @Column(name = "stock_name", nullable = false)
    private String StockName;   //종목명

    //6열
    @Column(name = "market_type", nullable = false)
    private String marketType;  //시장구분 : 코스피, 코스닥

    public StockInfo(String stockCode, String stockName, String marketType) {
        this.stockCode = stockCode;
        this.StockName = stockName;
        this.marketType = marketType;
    }
}
