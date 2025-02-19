// 숫자 포맷팅 함수
export function formatCurrency(value: string | number): string {
    const number = Number(value);
    if (isNaN(number)) return String(value);
    return number.toLocaleString("ko-KR");
}

// 거래 대금 포맷팅 함수
export function formatTradeAmount(value: string | number): string {
    const number = Number(value);
    if (isNaN(number)) return String(value);

    if (number >= 1_0000_0000) {
        const converted = number / 1_0000_0000;
        return (converted >= 10 
            ? Math.floor(converted).toLocaleString("ko-KR") 
            : converted.toLocaleString("ko-KR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
        ) + "억 원";
    } else if (number >= 1_0000) {
        const converted = number / 1_0000;
        return (converted >= 10 
            ? Math.floor(converted).toLocaleString("ko-KR") 
            : converted.toLocaleString("ko-KR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
        ) + "만 원";
    }

    return number.toLocaleString("ko-KR") + "원"; // 기본 원 단위
}

// 출력예시 : 거래 대금 포맷팅 함수
// console.log(formatTradeAmount(324441630800));  // "3,244억 원"
// console.log(formatTradeAmount(40931115330));   // "40.9억 원"
// console.log(formatTradeAmount(2463894318));    // "2.5억 원"
// console.log(formatTradeAmount(588450775));     // "5.9억 원"
// console.log(formatTradeAmount(167466190));     // "1.7억 원"
// console.log(formatTradeAmount(90000000));      // "9.0억 원"
// console.log(formatTradeAmount(50000000));      // "5.0억 원"
// console.log(formatTradeAmount(1100000));       // "110만 원"
// console.log(formatTradeAmount(900000));        // "90.0만 원"
// console.log(formatTradeAmount(50000));         // "5.0만 원"
// console.log(formatTradeAmount(10000));         // "1.0만 원"
// console.log(formatTradeAmount(5000));          // "5,000원"