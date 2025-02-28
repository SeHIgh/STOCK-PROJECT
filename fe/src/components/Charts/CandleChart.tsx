import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { CandleProps } from "../../types";

const CandleChart: React.FC<{
    data: CandleProps[];
    timeUnit: "minute" | "day" | "week" | "month" | "year";
}> = ({ data, timeUnit }) => {
    // 데이터 변환 함수
    const transformData = (data: CandleProps[], timeUnit: string) => {
        const transformedData = [];
        let currentPeriodData: CandleProps[] = [];
        let currentPeriodStart: number | null = null;

        data.forEach((candle) => {
            const timestamp = new Date(candle.dt).getTime();
            const periodStart = getPeriodStart(timestamp, timeUnit);

            if (currentPeriodStart === null) {
                currentPeriodStart = periodStart;
            }

            if (periodStart === currentPeriodStart) {
                currentPeriodData.push(candle);
            } else {
                transformedData.push(aggregateData(currentPeriodData));
                currentPeriodData = [candle];
                currentPeriodStart = periodStart;
            }
        });

        if (currentPeriodData.length > 0) {
            transformedData.push(aggregateData(currentPeriodData));
        }

        return transformedData;
    };

    // 기간 시작 시간 계산 함수
    const getPeriodStart = (timestamp: number, timeUnit: string) => {
        const date = new Date(timestamp);
        switch (timeUnit) {
            case "minute":
                return new Date(date.setSeconds(0, 0)).getTime();
            case "day":
                date.setHours(0, 0, 0, 0);
                return date.getTime();
            case "week":
                date.setHours(0, 0, 0, 0);
                date.setDate(date.getDate() - date.getDay());
                return date.getTime();
            case "month":
                date.setHours(0, 0, 0, 0);
                date.setDate(1);
                return date.getTime();
            case "year":
                date.setHours(0, 0, 0, 0);
                date.setMonth(0);
                date.setDate(1);
                return date.getTime();
            default:
                return timestamp;
        }
    };

    // 데이터 집계 함수
    const aggregateData = (data: CandleProps[]) => {
        const open = data[0].open;
        const close = data[data.length - 1].close;
        const high = Math.max(...data.map((candle) => candle.high));
        const low = Math.min(...data.map((candle) => candle.low));
        const volume = data.reduce((sum, candle) => sum + candle.volume, 0);
        const amount = data.reduce((sum, candle) => sum + candle.amount, 0);
        return {
            x: data[0].dt,
            y: [open, high, low, close],
            volume,
            amount,
        };
    };

    // 데이터 변환 (timeUnit 적용)
    const seriesData = transformData(data, timeUnit).map((candle) => ({
        x: new Date(candle.x).getTime(),
        y: candle.y,
    }));

    // 데이터 변환 (Basic)
    // const seriesData = data.map((candle) => {
    //     const timestamp = new Date(candle.dt).getTime();
    //     return {
    //         x: timestamp,
    //         y: [candle.open, candle.high, candle.low, candle.close],
    //     };
    // });

    // 각 timeUnit에 따른 xaxis 범위 설정 (초기 화면 크기)
    const getXaxisRange = (timeUnit: string) => {
        const now = new Date().getTime();
        switch (timeUnit) {
            // 데이터 부족으로 인해 임시 주석
            // case "minute":
            //     return {
            //         min: now - 24 * 60 * 60 * 1000, // 1일 범위
            //         max: now,
            //     };
            // case "day":
            //     return {
            //         min: now - 7 * 24 * 60 * 60 * 1000, // 1주일 범위
            //         max: now,
            //     };
            // case "week":
            //     return {
            //         min: now - 30 * 24 * 60 * 60 * 1000, // 1개월 범위
            //         max: now,
            //     };
            // case "month":
            //     return {
            //         min: now - 365 * 24 * 60 * 60 * 1000, // 1년 범위
            //         max: now,
            //     };
            case "minute":
            case "day":
            case "week":
            case "month":
                return {
                    min: now - 365 * 24 * 60 * 60 * 1000, // 1년 범위
                    max: now,
                };
            default:
                return { min: now - 365 * 24 * 60 * 60 * 3000, max: now };
        }
    };

    // xaxis range 계산
    const xaxisRange = getXaxisRange(timeUnit);

    const options: ApexOptions = {
        chart: {
            type: "candlestick",
            height: 30000000,
            zoom: {
                enabled: true,
                type: "x",
                autoScaleYaxis: true,
            },
        },
        title: {
            // text: "주식 캔들스틱 차트",
            // align: "left",
        },
        xaxis: {
            type: "datetime",
            min: xaxisRange.min,
            max: xaxisRange.max,
            labels: {
                datetimeFormatter: {
                    year: "yyyy",
                    month: "MM월",
                    day: "dd일",
                    hour: "HH:mm",
                },
            },
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return `${value.toLocaleString()}원`;
                },
            },
            tooltip: {
                enabled: true,
            },
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: "oklch(0.707 0.165 254.624)",
                    downward: "oklch(0.704 0.191 22.216)",
                },
            },
        },
        tooltip: {
            onDatasetHover: {
                highlightDataSeries: true,
            },
            x: {
                formatter: (value) => {
                    const date = new Date(value);
                    return `${date.getFullYear()}년 ${
                        date.getMonth() + 1
                    }월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
                },
            },
            y: {
                formatter: (value) => {
                    return `${value.toLocaleString()}원`;
                },
            },
        },
    };

    const series = [
        {
            data: seriesData,
        },
    ];

    return (
        <Chart
            options={options}
            series={series}
            type="candlestick"
            height={300}
            style={{ width: "100%" }}
        />
    );
};

export default CandleChart;
