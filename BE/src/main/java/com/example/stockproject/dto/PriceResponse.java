package com.example.stockproject.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PriceResponse {
    // 성공 실패 여부
    private String rtCd;

    // 응답코드
    private String msgCd;

    // 응답메세지
    private String msg1;

    // 응답상세
    private PriceResponseOutput output;
}
