// src/api/newsApi.ts
import axiosInstance from "../utils/axiosInstance";
import {
    DailyPriceProps,
    ExchangeRateProps,
    LiveChartFluctuationProps,
    LiveChartVolProps,
    LivePriceProps,
    OrderProps,
    StockIndexProps,
    StockPriceProps,
} from "../types";
import { NewsProps } from "../types";
import { isLocalMode } from "../utils/\bglobalFunc";
import { ACCOUNT_INFO } from "../\bconfig";

// 주가지수 API
export const fetchIndexList = async (): Promise<StockIndexProps[]> => {
    try {
        const response = await axiosInstance.get<StockIndexProps[]>(
            "/stockindex"
        );
        return response.data;
    } catch (error) {
        console.error("⛔️ 주가지수 API 데이터 요청 실패", error);
        throw error;
    }
};

// 환율 API
export const fetchExchangeRate = async (): Promise<ExchangeRateProps> => {
    try {
        const response = await axiosInstance.get<ExchangeRateProps>(
            "/exchangerate"
        );
        return response.data;
    } catch (error) {
        console.error("⛔️ 환율 API 데이터 요청 실패", error);
        throw error;
    }
};

// * 참고 : 네이버 환율 검색 API
// https://m.search.naver.com/p/csearch/content/qapirender.nhn?key=calculator&pkid=141&q=%ED%99%98%EC%9C%A8&where=m&u1=keb&u6=standardUnit&u7=0&u3=USD&u4=KRW&u8=down&u2=1

// 뉴스 API
export const fetchNewsList = async (): Promise<NewsProps[]> => {
    try {
        const response = await axiosInstance.get<NewsProps[]>("/news");
        return response.data;
    } catch (error) {
        console.error("⛔️ 뉴스 API 데이터 요청 실패", error);
        throw error;
    }
};

// 실시간 차트 API - 거래량 상위 10개
export const fetchLiveChartTopVol10 = async (): Promise<
    LiveChartVolProps[]
> => {
    try {
        const response = await axiosInstance.get<LiveChartVolProps[]>(
            "/volume-rank"
        );
        return response.data;
    } catch (error) {
        console.error("⛔️ 실시간 차트 (거래량) - API 데이터 요청 실패", error);
        throw error;
    }
};

// 실시간 차트 API - 급상승 상위 10개
export const fetchLiveChartTopIncr10 = async (): Promise<
    LiveChartFluctuationProps[]
> => {
    try {
        const response = await axiosInstance.get<LiveChartFluctuationProps[]>(
            "/top10-fluctuation"
        );
        return response.data;
    } catch (error) {
        console.error("⛔️ 실시간 차트 (급상승) - API 데이터 요청 실패", error);
        throw error;
    }
};

// 실시간 차트 API - 급하락 상위 10개
export const fetchLiveChartTopDecr10 = async (): Promise<
    LiveChartFluctuationProps[]
> => {
    try {
        const response = await axiosInstance.get<LiveChartFluctuationProps[]>(
            "/bottom10-fluctuation"
        );
        return response.data;
    } catch (error) {
        console.error("⛔️ 실시간 차트 (급하락) - API 데이터 요청 실패", error);
        throw error;
    }
};

// 종목 상세 정보 - 타이틀 (종목 현재가 및 등락률 타입 정의) API
export const fetchStockDetail = async (
    stockName: string
): Promise<StockPriceProps> => {
    if (isLocalMode) {
        try {
            const response = await axiosInstance.get<StockPriceProps>("/price");
            return response.data;
        } catch (error) {
            console.error(
                "⛔️ 종목 상세 정보 (로컬 모드) - API 데이터 요청 실패",
                error
            );
            throw error;
        }
    }
    try {
        const response = await axiosInstance.get<StockPriceProps>("/price", {
            params: { name: stockName },
        });
        return response.data;
    } catch (error) {
        console.error("⛔️ 종목 상세 정보 - API 데이터 요청 실패", error);
        throw error;
    }
};

// 종목 상세 정보 - 실시간 시세 API
export const fetchStockLivePrice = async (
    stockName: string
): Promise<LivePriceProps[]> => {
    if (isLocalMode) {
        try {
            const response = await axiosInstance.get<LivePriceProps[]>(
                "/liveprice"
            );
            return response.data;
        } catch (error) {
            console.error(
                "⛔️ 종목 상세 정보 (로컬 모드) - 실시간 시세 API 데이터 요청 실패",
                error
            );
            throw error;
        }
    }
    try {
        const response = await axiosInstance.get<LivePriceProps[]>(
            "/liveprice",
            {
                params: { name: stockName },
            }
        );
        return response.data;
    } catch (error) {
        console.error(
            "⛔️ 종목 상세 정보 - 실시간 시세 API 데이터 요청 실패",
            error
        );
        throw error;
    }
};

// 종목 상세 정보 - 일별 시세 API
export const fetchStockDailyPrice = async (
    stockName: string
): Promise<DailyPriceProps[]> => {
    if (isLocalMode) {
        try {
            const response = await axiosInstance.get<DailyPriceProps[]>(
                "/dailyprice"
            );
            return response.data;
        } catch (error) {
            console.error(
                "⛔️ 종목 상세 정보 (로컬 모드) - 일별 시세 API 데이터 요청 실패",
                error
            );
            throw error;
        }
    }
    try {
        const response = await axiosInstance.get<DailyPriceProps[]>(
            "/dailyprice",
            {
                params: { name: stockName },
            }
        );
        return response.data;
    } catch (error) {
        console.error(
            "⛔️ 종목 상세 정보 - 일별 시세 API 데이터 요청 실패",
            error
        );
        throw error;
    }
};

// 종목 상세 정보 - 주문 하기 API - 매수
export const fetchStockOrderBuy = async (
    productCode: string,
    orderDivision: string, // 주문구분: '00' - 지정가, '01' - 시장가
    orderQuantity: string, // 주문수량
    orderPrice: string // 주문단가: 지정가일 때 희망가격, 시장가일 때 0
): Promise<OrderProps> => {
    const orderData = {
        ...ACCOUNT_INFO,
        pdno: productCode,
        ordDvsn: orderDivision,
        ordQty: orderQuantity,
        ordUnpr: orderPrice,
    };
    if (isLocalMode) {
        try {
            const response = await axiosInstance.post<OrderProps>(
                "/trading/buy",
                orderData
            );
            return response.data;
        } catch (error) {
            console.error(
                "⛔️ 종목 상세 정보 (로컬 모드) - 주문 하기(매수) API 데이터 요청 실패",
                error
            );
            throw error;
        }
    }
    try {
        const response = await axiosInstance.post<OrderProps>(
            "/trading/buy",
            orderData
        );
        return response.data;
    } catch (error) {
        console.error(
            "⛔️ 종목 상세 정보 - 주문 하기(매수) API 데이터 요청 실패",
            error
        );
        throw error;
    }
};

// 종목 상세 정보 - 주문 하기 API - 매도
export const fetchStockOrderSell = async (
    productCode: string,
    orderDivision: string, // 주문구분: '00' - 지정가, '01' - 시장가
    orderQuantity: string, // 주문수량
    orderPrice: string // 주문단가: 지정가일 때 희망가격, 시장가일 때 0
): Promise<OrderProps> => {
    const orderData = {
        ...ACCOUNT_INFO,
        pdno: productCode,
        ordDvsn: orderDivision,
        ordQty: orderQuantity,
        ordUnpr: orderPrice,
    };
    if (isLocalMode) {
        try {
            const response = await axiosInstance.post<OrderProps>(
                "/trading/sell",
                orderData
            );
            return response.data;
        } catch (error) {
            console.error(
                "⛔️ 종목 상세 정보 (로컬 모드) - 주문 하기(매도) API 데이터 요청 실패",
                error
            );
            throw error;
        }
    }
    try {
        const response = await axiosInstance.post<OrderProps>(
            "/trading/sell",
            orderData
        );
        return response.data;
    } catch (error) {
        console.error(
            "⛔️ 종목 상세 정보 - 주문 하기(매도) API 데이터 요청 실패",
            error
        );
        throw error;
    }
};

// 주문하기 API
export const fetchOrder = async ({
    isBuy,
    orderDvsn,
    quantity,
    price,
    productCode,
}: {
    isBuy: boolean;
    orderDvsn: string;
    quantity: number;
    price: string;
    productCode: string;
}) => {
    try {
        const endpoint = isLocalMode
            ? isBuy
                ? "/buy"
                : "/sell"
            : isBuy
            ? "/trading/buy"
            : "/trading/sell";
        const response = await axiosInstance.post(endpoint, {
            ...ACCOUNT_INFO,
            pdno: productCode,
            ordDvsn: orderDvsn,
            ordQty: quantity,
            ordUnpr: price,
        });

        return response.data;
    } catch (error) {
        isLocalMode
            ? isBuy
                ? console.error(
                      "⛔ 종목 상세 정보 (로컬 모드) - 주문 하기(매수) API 데이터 전송 실패",
                      error
                  )
                : console.error(
                      "⛔ 종목 상세 정보 (로컬 모드) - 주문 하기(매도) API 데이터 전송 실패",
                      error
                  )
            : isBuy
            ? console.error(
                  "⛔ 종목 상세 정보 - 주문 하기(매수) API 데이터 전송 실패",
                  error
              )
            : console.error(
                  "⛔ 종목 상세 정보 - 주문 하기(매도) API 데이터 전송 실패",
                  error
              );
        throw error;
    }
};
