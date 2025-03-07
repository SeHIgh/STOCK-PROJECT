import { atom } from "recoil";
import { LiveTradingInfoProps } from "../../types";

export const liveTradeDataState = atom<LiveTradingInfoProps[]>({
    key: "liveTradeDataState",
    default: [], // 초기값: 빈 배열
});