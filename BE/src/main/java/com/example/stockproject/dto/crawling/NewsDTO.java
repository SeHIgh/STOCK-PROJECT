package com.example.stockproject.dto.crawling;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class NewsDTO {
    String title;
    String createdAt;
    String source;
    String category;
    String link;
    String imageUrl;
}
/*
title: "[코스닥 마감] 美 고용지표 경계감 속 소폭 상승…대왕고래 관련주 ‘뚝’",
        time: "2시간 전",
        source: "이데일리",
        category: "증권",
        link: "*",
 */