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
    String nasdaq_index;
    String nasdaq_change_rate;
    String nasdaq_change_sign;
}
