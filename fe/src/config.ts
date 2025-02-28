// 계좌 정보 불러오기 (.env 파일에 저장된 계좌 정보를 불러옴)
export const ACCOUNT_INFO = {
    cano: import.meta.env.VITE_ACCOUNT_CANO, // 계좌번호
    acntPrdtCd: import.meta.env.VITE_ACCOUNT_PRDT_CD, // 계좌상품코드
};
