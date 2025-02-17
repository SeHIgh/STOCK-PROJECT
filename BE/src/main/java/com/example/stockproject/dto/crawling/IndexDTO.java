package com.example.stockproject.dto.crawling;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class IndexDTO {
    String id;
    String label;
    String index_name;
    String index;
    String change_rate;
    String change_sign;
    String change_value;
}
