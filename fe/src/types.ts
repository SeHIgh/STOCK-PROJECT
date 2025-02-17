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

// 실시간 차트 타입 정의
export interface StockPriceProps {
    data_rank: string;
    hts_kor_isnm: string;
    stck_prpr: string;
    prdy_ctrt: string;
    acml_vol: string;
    acml_tr_pbmn: string;
    vol_growth_rate: string | null;
}

export interface StockProps {
    productCode: string;
    name: string;
    logoImageUrl: string;
    price: StockPriceProps;
}
