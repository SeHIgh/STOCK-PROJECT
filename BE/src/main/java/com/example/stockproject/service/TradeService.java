package com.example.stockproject.service;

import com.example.stockproject.dto.account.AccountBalanceResponseOutput;
import com.example.stockproject.dto.account.AccountStockResponseOutput;
import com.example.stockproject.dto.order.TradePossibleDTO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
//매수, 매도 버튼 클릭시 필요 정보 반환 => 그냥 종목 하나에 들어갔을 때, 이 정보를 받아오게 하자.
public class TradeService {

    private static final Logger logger = LoggerFactory.getLogger(TradeService.class);
    private final AccountService accountService;

    public Mono<TradePossibleDTO> getTradeInfo(String stockName){
        logger.info("🔍 {} 매수 정보 조회", stockName);

        return accountService.getAccountInformation()
//                .doOnNext(accountData -> {
//                    logger.info("📌 accountData 타입: {}", accountData.getClass().getName());
//                    for (Object obj : accountData) {
//                        logger.info("📌 내부 요소 타입: {}", obj.getClass().getName());
//                    }
//                    logger.info("📌 accountData 내용: {}", accountData);
//                })
                .map(accountData -> {
                    String deposit="0";
                    String holdingQuantity="0";

                    for (Object obj : accountData) {
                        if (obj instanceof AccountStockResponseOutput stock) {
                            //logger.info("🔍 보유 종목명: '{}', stockName: '{}'", stock.getPrdtName(), stockName);

                            if (stock.getPrdtName().trim().equalsIgnoreCase(stockName.trim())) {
                                logger.info("✅ 종목 확인: {}", stock.getPrdtName());
                                holdingQuantity = stock.getHldg_qty();
                                //break;
                            }
                        } else if (obj instanceof AccountBalanceResponseOutput balance) {
                            deposit = balance.getDncaTotAmt();  // 예수금 정보 저장
                        }
                    }

                    logger.info("🔖예수금: {}, 보유 수량: {}", deposit, holdingQuantity);
                    return new TradePossibleDTO(stockName, deposit, holdingQuantity);
                });
    }
}
