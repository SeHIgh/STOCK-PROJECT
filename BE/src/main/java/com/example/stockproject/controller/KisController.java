package com.example.stockproject.controller;

import com.example.stockproject.dto.FluctResponseOutput;
import com.example.stockproject.dto.VolumeResponseOutput;
import com.example.stockproject.service.ApiFluctService;
import com.example.stockproject.service.ApiVolumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
public class KisController {

    private ApiVolumeService apiVolumeService;
    private ApiFluctService apiFluctService;

    @Autowired
    public KisController(ApiVolumeService apiVolumeService,
                         ApiFluctService apiFluctService) {
        this.apiVolumeService = apiVolumeService;
        this.apiFluctService = apiFluctService;
    }

    //거래량 순위를 위한 controller
    @GetMapping("/volume-rank")
    public Mono<List<VolumeResponseOutput>> getVolumeRank() {
        return apiVolumeService.getVolumeRank();
    }

    //등락률 순위
    @GetMapping("/fluctuation")
    public Mono<List<FluctResponseOutput>> getFluctuation(){
        return apiFluctService.getFluctuation();
    }
}
