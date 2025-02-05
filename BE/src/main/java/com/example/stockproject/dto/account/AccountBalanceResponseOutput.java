package com.example.stockproject.dto.account;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
// output2: 잔고 정보 DTO
public class AccountBalanceResponseOutput {
    private String dncaTotAmt;  // 예수금 총 금액
    private String thdtBuyAmt;  // 금일 매수 금액
    private String thdtSllAmt;  // 금일 매도 금액
    private String nassAmt;     // 순자산 금액
}
