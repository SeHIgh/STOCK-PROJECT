package com.example.stockproject.dto.account;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
// output1: 보유 주식 정보 DTO
public class AccountStockResponseOutput {
    private String pdno;
    private String prdtName;
    private String tradDvsnName;
    private String thdtBuyqty;
    private String thdtSllqty;
}
