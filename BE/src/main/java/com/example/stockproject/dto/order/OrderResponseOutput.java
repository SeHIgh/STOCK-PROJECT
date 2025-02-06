package com.example.stockproject.dto.order;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class OrderResponseOutput
{
    private String ODNO;        //주문번호
    private String ORD_TMD;     //주문시각 HHMMSS
}
