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
    newsId: string;
    title: string;
    contentText: string;
    stockCodes: string[];
    newsType: string;
    imageUrl: string;
    source: string;
    agencyName: string;
    relatedStocks: string[];
    createdAt: string;
    nation: string;
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
    stck_prpr: string; // 체결가
    stck_qnty: string; // 체결량 (주)
    prdy_ctrt: string; // 등락률 (%)
    acml_vol: string; // 거래량 (주)
    tr_time: string; // 시간 (HH:mm:ss)
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
