// src/api/newsApi.ts
import axiosInstance from "../utils/axiosInstance";
import { ExchangeRateProps, StockIndexProps, StockPriceProps} from "../types";
import { NewsProps } from "../types";

// 주가지수 API
export const fetchIndexList = async (): Promise<StockIndexProps[]> => {
    const response = await axiosInstance.get<StockIndexProps[]>("/stockindex");
    return response.data;
};

// 환율 API
export const fetchExchangeRate = async (): Promise<ExchangeRateProps> => {
    const response = await axiosInstance.get<ExchangeRateProps>("/exchangerate");
    return response.data;
};

// * 참고 : 네이버 환율 검색 API
// https://m.search.naver.com/p/csearch/content/qapirender.nhn?key=calculator&pkid=141&q=%ED%99%98%EC%9C%A8&where=m&u1=keb&u6=standardUnit&u7=0&u3=USD&u4=KRW&u8=down&u2=1

// 뉴스 API
export const fetchNewsList = async (): Promise<NewsProps[]> => {
    const response = await axiosInstance.get<NewsProps[]>("/news");
    return response.data;
};

// 실시간 차트 API - 거래량 상위 10개
export const fetchLiveChartTopVol10 = async (): Promise<StockPriceProps[]> => {
    const response = await axiosInstance.get<StockPriceProps[]>("/livechartvol10");
    return response.data;
};

// 실시간 차트 API - 급상승 상위 10개
export const fetchLiveChartTopIncr10 = async (): Promise<StockPriceProps[]> => {
    const response = await axiosInstance.get<StockPriceProps[]>("/livechartincr10");
    return response.data;
};

// 실시간 차트 API - 급하락 상위 10개
export const fetchLiveChartTopDecr10 = async (): Promise<StockPriceProps[]> => {
    const response = await axiosInstance.get<StockPriceProps[]>("/livechartdecr10");
    return response.data;
};