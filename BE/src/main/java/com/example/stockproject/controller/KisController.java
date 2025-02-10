package com.example.stockproject.controller;

import com.example.stockproject.dto.FluctResponseOutput;
import com.example.stockproject.dto.PriceResponseOutput;
import com.example.stockproject.dto.VolumeResponseOutput;
import com.example.stockproject.service.ApiFluctService;
import com.example.stockproject.service.ApiVolumeService;
import com.example.stockproject.service.ApiPriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
public class KisController {

    private ApiPriceService apiPriceService;
    private ApiVolumeService apiVolumeService;
    private ApiFluctService apiFluctService;

    @Autowired
    public KisController(ApiVolumeService apiVolumeService,
                         ApiFluctService apiFluctService,
                         ApiPriceService apiPriceService) {
        this.apiVolumeService = apiVolumeService;
        this.apiFluctService = apiFluctService;
        this.apiPriceService = apiPriceService;
    }

    //거래량 순위를 위한 controller
    @GetMapping("/volume-rank")
    public Mono<List<VolumeResponseOutput>> getVolumeRank() {
        return apiVolumeService.getVolumeRank();
    }

    //등락률 순위
    @GetMapping("/top10-fluctuation")
    public Mono<List<FluctResponseOutput>> getTop10Fluctuation(){
        return apiFluctService.getTop10Fluctuation();
    }

    @GetMapping("/bottom10-fluctuation")
    public Mono<List<FluctResponseOutput>> getBottom10Fluctuation(){
        return apiFluctService.getBottom10Fluctuation();
    }

    //주식 현재가 조회
    @GetMapping("/price")
    public Mono<PriceResponseOutput> getPrice(){
        return apiPriceService.getPrice();
    }
}
