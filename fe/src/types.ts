// 주가지수 타입 정의
export interface StockIndexProps {
    id: string;
    label: string;
    index_name: string;
    index: string;
    change_rate: string;
    change_sign: string;
    change_value: string;
}

// 뉴스 타입 정의
export interface NewsProps {
    // newsId: string; // 필요 없음
    title: string;
    // contentText: string; // 필요 없음
    // stockCodes: string[]; // 필요 없음
    // newsType: string; // 필요 없음
    imageUrl: string;
    source: string;
    // agencyName: string; // 필요 없음
    // relatedStocks: string[]; // 필요 없음
    createdAt: string;
    // nation: string; // 필요 없음
    link: string;
}

// 환율 타입 정의
export interface ExchangeRateProps {
    value: string;
}

// 실시간 차트 - 거래량 순위 타입 정의
export interface LiveChartVolProps {
    mksc_shrn_iscd: string; // 종목코드 (필요)

    hts_kor_isnm: string; // 종목명
    data_rank: string; // 순위
    stck_prpr: string; // 현재가
    acml_vol: string; // 누적 거래량

    prdy_vol_value: string; // 거래량 전일대비 수치 (필요 - 필수)
    prdy_vol_sign: string; // 거래량 전일대비 부호 (필요 - 선택)

    vol_inrt: string; // 거래량 증가율 - 등락률 대신 사용
    acml_tr_pbmn: string; // 누적거래대금 (현재가 * 거래량)
}

// 실시간 차트 - 급등락 순위 타입 정의
export interface LiveChartFluctuationProps {
    stck_shrn_iscd: string; // 종목코드
    data_rank: string; // 순위
    hts_kor_isnm: string; // 종목명
    stck_prpr: string; // 현재가
    prdy_vrss: string; // 전일대비 수치
    prdy_vrss_sign: string; // 전일대비 부호
    prdy_ctrt: string; // 전일대비 등락률
    acml_vol: string; // 누적거래량
    acml_tr_pbmn: string; // 누적거래대금 (현재가 * 거래량)
    vol_growth_rate: string | null; // 거래량증가율
}

// (임시) 종목 상세 정보 - 타이틀 (종목 현재가 및 등락률 타입 정의)
export interface StockDetailProps {
    stck_shrn_iscd: string; // 종목코드
    hts_kor_isnm: string; // 종목명
    stck_prpr: string; // 현재가
    prdy_vrss: string; // 전일대비 수치
    prdy_vrss_sign: string; // 전일대비 부호
    prdy_ctrt: string; // 전일대비 등락률
}

// 종목 상세 정보 - 현재가 조회 타입 정의
export interface StockPriceProps {
    stck_shrn_iscd: string; // 종목코드
    hts_kor_isnm: string; // 종목명
    stck_prpr: string; // 현재가
    prdy_vrss: string; // 전일대비 수치
    prdy_vrss_sign: string; // 전일대비 부호
    prdy_ctrt: string; // 전일대비 등락률
    acml_vol: string; // 누적 거래량
    prdy_vrss_vol_rate: string; // 전일 대비 거래량 비율
    stck_oprc: string; // 시가
    stck_hgpr: string; // 최고가
    stck_lwpr: string; // 최저가
    stck_mxpr: string; // 상한가
    stck_llam: string; // 하한가
    stck_sdpr: string; // 기준가
    lstn_stcn: string; // 상장 주수
    per: string; // PER
    pbr: string; // PBR
    eps: string; // EPS
    bps: string; // BPS
}

// 종목 상세 정보 - 실시간 시세 조회 타입 정의
export interface LivePriceProps {
    // 이전 임시 데이터 형식
    // stck_prpr: string; // 체결가
    // stck_qnty: string; // 체결량 (주)
    // prdy_ctrt: string; // 등락률 (%)
    // acml_vol: string; // 거래량 (주)
    // tr_time: string; // 시간 (HH:mm:ss)

    // 웹소켓 데이터 형식
    orderType: string; //주문구분
    orderKind: string; //주문종류
    stockCode: string; //종목코드
    executedQuantity: string; //체결수량
    executedPrice: string; //체결단가
    timestamp: string; //체결시간
    executionStatus: string; //체결여부
}

// 종목 상세 정보 - 일별 시세 조회 타입 정의
export interface DailyPriceProps {
    stck_bsop_date: string; // 일자
    stck_clpr: string; // 종가
    stck_oprc: string; // 시가
    stck_hgpr: string; // 최고가
    stck_lwpr: string; // 최저가
    acml_vol: string; // 거래량
    acml_tr_pbmn: string; // 거래대금
    prdy_ctrt: string; // 등락률
}

// 종목 상세 정보 - 주문 정보 타입 정의
export interface TradeInfoProps {
    stockName: string;
    deposit: string; //예수금(매수 가능 금액)
    holdingQuantity: string; //보유수량
}

// 종목 상세 정보 - 주문 하기 타입 정의
export interface OrderProps {
    cano: string; // 계좌번호
    acntPrdtCd: string; // 계좌상품코드
    pdno: string; // 종목코드
    ordDvsn: string; // 주문구분     //00: 지정가, 01:시장가
    ordQty: string; // 주문수량
    ordUnpr: string; // 주문단가     //지정가일때 희망가격, 시장가일때 0
}
// 종목 상세 정보 - 주문 하기 타입 정의 (예시)
// {
// "cano": "50124326",
// "acntPrdtCd": "01",
// "pdno": "032350",
// "ordDvsn": "01",
// "ordQty": "20",
// "ordUnpr": "0"
// }

// 캔들 차트 데이터 타입 정의
export interface CandleProps {
    dt: string; // 날짜
    base: 62000; // 기준가
    open: 61000; // 시가
    high: 61600; // 고가
    low: 59500; // 저가
    close: 59800; // 종가
    volume: 1099046; // 거래량
    amount: 66148518400; // 거래대금
}

// 호가 창 - 실시간 체결가 데이터 타입 정의
export interface LiveTradingInfoProps {
    trade_price: string; // 체결가
    change_rate: string; // 전일 대비율 : 등락률
    trade_strength: string; // 체결강도
    trade_volume: string; // 체결 거래량
    trade_type: string; // 체결구분 (1: 매수, 2: 매도)
    prev_accum_volumeRate: string; // 전일 동시간 누적 거래량 비율
    high_price: string; //최고가
    low_price: string; //최저가
    total_askp_price: string; //총 매도호가 잔량 = 판매대기
    total_bid_price: string; //총 매수호가 잔량 = 구매 대기
    time: string; // 체결 시간
}

// 실시간 체결가 데이터 타입 정의 (예시)
// {
//     "type":"tradeInfo"
//     "data":
//       {
//         "tradePrice": "72250",
//         "changeRate": "1.8",
//         "tradeStrength": "90.2",
//         "tradeVolume": "1650",
//         "tradeType": "1",
//         "prevAccumVolumeRate": "0.85",
//         "highPrice": "73000",
//         "lowPrice": "71500",
//         "totalAskpPrice": "520000",
//         "totalBidPrice": "495000",
//         "time": "102148"
//       }
// }

// 호가 창 - 실시간 호가 데이터 타입 정의
export interface LiveQuoteInfoProps {
    askPrices: string[]; // 매도호가
    bidPrices: string[]; // 매수호가
    askVolumes: string[]; // 매도호가 잔량
    bidVolumes: string[]; // 매수호가 잔량
}

// 실시간 호가 데이터 타입 정의 (예시)
// {
//     "type":"quoteInfo"
//     "data"
//     {
//       "askPrices": ["71900", "72000", "72100", "72200", "72300", "72400", "72500", "72600", "72700", "72800"],
//       "bidPrices": ["71800", "71700", "71600", "71500", "71400", "71300", "71200", "71100", "71000", "70900"],
//       "askVolumes": ["91918", "117942", "92673", "79708", "106729", "141988", "176192", "113906", "134077", "104229"],
//       "bidVolumes": ["95221", "159371", "220746", "284657", "212742", "195370", "182710", "209747", "376432", "158171"]
//     }
// }

// 실시간 체결 통보 알람 데이터 타입 정의
export interface TradeNotifyProps {
    orderType: string; // 매도매수구분
    orderKind: string; // 주문 종류 - 지정가, 시장가
    stockCode: string; //종목코드
    stockName: string; //종목명
    orderQuantity: string; //주문수량
    executedQuantity: string; //체결수량
    executedPrice: string; //체결단가
    timestamp: string; //체결 시간
    executionStatus: string; //체결여부 - 주문, 체결
}

// 실시간 체결 통보 알람 데이터 타입 정의 (예시)
// {
//     "type":"notifyInfo"
//     "data":
//       {
//         "orderType": "매도",
//         "orderKind": "시장가",
//         "stockCode": "005930",
//         "stockName": "삼성전자",
//         "orderQuantity": "10",
//         "executedQuantity": "3"
//         "executedPrice":"55000"
//         "timestamp":"102148"
//         "executionStatus":"체결"
//       }
// }

// 특정 종목 데이터 (종목명, 종목코드, 현재가, 등락률) 타입 정의
export interface StockDataProps {
    stockName: string; // 종목명
    stockCode: string; // 종목코드
    stockPrice: string; // 현재가
    stockChangeValue: string; // 전일대비 수치
    stockChangeSign: string; // 전일대비 부호
    stockChangeRate: string; // 등락률
}
