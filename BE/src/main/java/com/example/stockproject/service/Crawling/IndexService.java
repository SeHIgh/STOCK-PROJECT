package com.example.stockproject.service.Crawling;

import com.example.stockproject.dto.crawling.IndexDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class IndexService {
    private final OverseasStockService overseasStockService;
    private final DomesticStockService domesticStockService;

    public IndexService(OverseasStockService overseasStockService, DomesticStockService domesticStockService) {
        this.overseasStockService = overseasStockService;
        this.domesticStockService = domesticStockService;
    }

    public List<IndexDTO> getAllStockIndex(){
        List<IndexDTO> overseasStockIndex = overseasStockService.getOverseasStock();
        List<IndexDTO> domesticStockIndex = domesticStockService.getDomesticStock();

        //두 리스트 합치기
        List<IndexDTO> allIndex = new ArrayList<>();
        allIndex.addAll(overseasStockIndex);
        allIndex.addAll(domesticStockIndex);
        return allIndex;
    }
}
