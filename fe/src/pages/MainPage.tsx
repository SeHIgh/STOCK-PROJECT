import ExchangeRate from "../components/Main/ExchangeRate";
import StockIndex from "../components/Main/StockIndex";
import MainLayout from "../components/MainLayout";
import LiveCharts from "../components/Main/LiveCharts";
import News from "../components/Main/News";

const MainPage = () => {
    return (
        <MainLayout>
            <div className="max-w-[1280px] h-full px-10 py-6 grid grid-flow-row grid-cols-[minmax(400px,_1fr)_300px] grid-rows-[200px_324px_1fr] gap-4">
                {/* 주가지수 (코스피, 코스닥, 나스닥, S&P 500) 섹션 */}
                <div id="stock-index" className="block-main col-span-1">
                    <StockIndex />
                </div>
                {/* 실시간 환율 (달러 - 원화) 섹션 */}
                <div id="live-exchange-rates" className="block-main col-span-1">
                    <ExchangeRate />
                </div>
                {/* 주요 뉴스 */}
                <div
                    id="latest-news"
                    className="block-main col-span-2"
                >
                    <News />
                </div>
                {/* 실시간 차트 (급상승, 급하락 종목) 섹션 */}
                <div
                    id="live-charts"
                    className="block-main col-span-2"
                >
                    <LiveCharts />
                </div>
            </div>
        </MainLayout>
    );
};

export default MainPage;
