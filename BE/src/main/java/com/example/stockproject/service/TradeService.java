package com.example.stockproject.service;

import com.example.stockproject.dto.PriceResponseOutput;
import com.example.stockproject.dto.account.AccountBalanceResponseOutput;
import com.example.stockproject.dto.account.AccountStockResponseOutput;
import com.example.stockproject.dto.order.TradePossibleDTO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;

import java.util.List;

@Service
@RequiredArgsConstructor
//매수, 매도 버튼 클릭시 필요 정보 반환 => 그냥 종목 하나에 들어갔을 때, 이 정보를 받아오게 하자.
public class TradeService {

    private static final Logger logger = LoggerFactory.getLogger(TradeService.class);
    private final AccountService accountService;
    private final ApiPriceService apiPriceService;

//    public Mono<TradePossibleDTO> getTradeInfo(String stockName){
//        logger.info("🔍 {} 매수 정보 조회", stockName);
//
//        return accountService.getAccountInformation()
//                .map(accountData -> {
//                    String deposit="0";
//                    String holdingQuantity="0";
//
//                    for (Object obj : accountData) {
//                        if (obj instanceof AccountStockResponseOutput stock) {
//                            //logger.info("🔍 보유 종목명: '{}', stockName: '{}'", stock.getPrdtName(), stockName);
//
//                            if (stock.getPrdtName().trim().equalsIgnoreCase(stockName.trim())) {
//                                logger.info("✅ 종목 확인: {}", stock.getPrdtName());
//                                holdingQuantity = stock.getHldg_qty();
//                                //break;
//                            }
//                        } else if (obj instanceof AccountBalanceResponseOutput balance) {
//                            deposit = balance.getDncaTotAmt();  // 예수금 정보 저장
//                        }
//                    }
//
//                    logger.info("🔖예수금: {}, 보유 수량: {}", deposit, holdingQuantity);
//                    return new TradePossibleDTO(stockName, deposit, holdingQuantity);
//                });
//    }

    public Mono<TradePossibleDTO> getTradeInfo(String stockName) {
        logger.info("🔍 {} 매수 정보 조회", stockName);

        // 두 서비스를 병렬로 실행하여 결과를 함께 받아옴
        return Mono.zip(
                        accountService.getAccountInformation(),  // 예수금과 보유 종목 정보
                        apiPriceService.getPriceByStockName(stockName)  // 종목 가격 정보
                )
                .map(tuple -> {
                    // 첫 번째 서비스의 결과 처리: 계좌 정보
                    String deposit = "0";
                    String holdingQuantity = "0";
                    for (Object obj : tuple.getT1()) {
                        if (obj instanceof AccountStockResponseOutput stock) {
                            if (stock.getPrdtName().trim().equalsIgnoreCase(stockName.trim())) {
                                logger.info("✅ 종목 확인: {}", stock.getPrdtName());
                                holdingQuantity = stock.getHldg_qty();
                            }
                        } else if (obj instanceof AccountBalanceResponseOutput balance) {
                            deposit = balance.getDncaTotAmt(); // 예수금 정보 저장
                        }
                    }

                    // 두 번째 서비스의 결과 처리: 종목 가격 정보
                    PriceResponseOutput priceResponse = tuple.getT2();
                    String stockPrice = priceResponse.getStckPrpr();  // 현재가
                    String prdyCtrt = priceResponse.getPrdyCtrt();
                    String prdyVrss = priceResponse.getPrdyVrss();

                    logger.info("🔖 예수금: {}, 보유 수량: {}, 현재가: {}, 전일대비율: {}, 전일대비: {}", deposit, holdingQuantity, stockPrice, prdyCtrt, prdyVrss);

                    // TradePossibleDTO 객체 생성하여 반환
                    return new TradePossibleDTO(stockName, deposit, holdingQuantity, stockPrice, prdyCtrt, prdyVrss);
                });
    }


}
