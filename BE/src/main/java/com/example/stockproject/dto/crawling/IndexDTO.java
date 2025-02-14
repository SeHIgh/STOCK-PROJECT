package com.example.stockproject.dto.crawling;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class IndexDTO {
    String nasdaqIndex;
    String nasdaqChange;
    String nasdaqChangeSign;
    String nasdaqChangeRate;

}
