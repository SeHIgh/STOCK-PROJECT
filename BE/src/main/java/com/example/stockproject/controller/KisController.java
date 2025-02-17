package com.example.stockproject.controller;

import com.example.stockproject.dto.DailyChartResponseOutput;
import com.example.stockproject.dto.FluctResponseOutput;
import com.example.stockproject.dto.PriceResponseOutput;
import com.example.stockproject.dto.VolumeResponseOutput;
import com.example.stockproject.service.ApiDailychartService;
import com.example.stockproject.service.ApiFluctService;
import com.example.stockproject.service.ApiVolumeService;
import com.example.stockproject.service.ApiPriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
public class KisController {

    private ApiPriceService apiPriceService;
    private ApiVolumeService apiVolumeService;
    private ApiFluctService apiFluctService;
    private ApiDailychartService apiDailychartService;

    @Autowired
    public KisController(ApiVolumeService apiVolumeService,
                         ApiFluctService apiFluctService,
                         ApiPriceService apiPriceService,
                         ApiDailychartService apiDailychartService) {
        this.apiVolumeService = apiVolumeService;
        this.apiFluctService = apiFluctService;
        this.apiPriceService = apiPriceService;
        this.apiDailychartService = apiDailychartService;
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
    //쿼리파라미터로 넘어온 종목이름으로 검색가능
    //http://localhost:8090/price?stockName=삼성전자
    @GetMapping("/price")
    public Mono<PriceResponseOutput> getPrice(@RequestParam String stockName){
        return apiPriceService.getPriceByStockName(stockName);
    }

    //http://localhost:8090/dailychart?stockName=삼성전자
    @GetMapping("/dailychart")
    public Mono<List<DailyChartResponseOutput>> getDailyChart(@RequestParam String stockName){
        return apiDailychartService.getDailyChartByStockName(stockName);
    }
}
