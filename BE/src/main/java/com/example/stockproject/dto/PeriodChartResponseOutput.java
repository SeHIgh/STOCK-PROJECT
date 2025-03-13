package com.example.stockproject.dto;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor
@ToString
public class PeriodChartResponseOutput {
    String dt;  //날짜
    String base;    //기준가
    String open;    //시가
    String high;    //고가
    String low;     //저가
    String close;    //종가
    String volume;      //거래량
    String amount;      //거래대금
}
