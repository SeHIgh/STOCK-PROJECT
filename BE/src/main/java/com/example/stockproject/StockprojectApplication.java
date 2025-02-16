package com.example.stockproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

//"개미상회"
//모의투자 사이트 프로젝트
@SpringBootApplication
@EnableScheduling
public class StockprojectApplication {
	public static void main(String[] args) {
		SpringApplication.run(StockprojectApplication.class, args);
	}
}
