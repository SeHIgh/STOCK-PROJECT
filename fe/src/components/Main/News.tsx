import { Link } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import { fetchNewsList } from "../../api/api";

// 시간을 상대적인 시간으로 표시하는 함수
const formatRelativeTime = (date: string) => {
    const now = new Date();
    const createdAt = new Date(date);

    const seconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const rtf = new Intl.RelativeTimeFormat("ko", { numeric: "auto" });

    if (seconds < 60) {
        return rtf.format(-seconds, "seconds");
    } else if (minutes < 60) {
        return rtf.format(-minutes, "minutes");
    } else if (hours < 24) {
        return rtf.format(-hours, "hours");
    } else {
        return rtf.format(-days, "days");
    }
};

const News = () => {
    // 뉴스 데이터 api 호출
    const { data: newsList, loading, error } = useFetchData(fetchNewsList);

    // 로딩 및 에러 화면
    if (loading || error)
        return (
            <>
                <div className="flex flex-row justify-between items-center">
                    <h1 className="section-title-main">주요 뉴스</h1>
                    <Link to="/news" className="text-lg text-gray-500  mr-3">
                        더 보기
                    </Link>
                </div>
                <ul className="w-full overflow-x-scroll pb-2 px-1 grid grid-flow-row grid-cols-[minmax(260px,_1fr)_minmax(260px,_1fr)_minmax(260px,_1fr)_minmax(260px,_1fr)] gap-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <li key={index} className="flex-1 card-main gray-hover">
                            <div className="w-full h-full p-4 flex flex-col gap-1 skeleton">
                                <div className="w-full h-40 overflow-hidden flex items-center skeleton-box"></div>
                                <h4 className="w-full h-6 text-base overflow-hidden whitespace-nowrap text-ellipsis skeleton-text"></h4>
                                <div className="w-25 h-5 text-sm text-gray-500 skeleton-text"></div>
                            </div>
                        </li>
                    ))}
                </ul>
            </>
        );

    return (
        <>
            <div className="flex flex-row justify-between items-center">
                <h1 className="section-title-main">주요 뉴스</h1>
                <Link to="/news" className="text-lg text-gray-500  mr-3">
                    더 보기
                </Link>
            </div>
            <ul className="w-full overflow-x-scroll pb-2 px-1 grid grid-flow-row grid-cols-[minmax(260px,_1fr)_minmax(260px,_1fr)_minmax(260px,_1fr)_minmax(260px,_1fr)] gap-3">
                {newsList?.slice(0, 4).map((news, index) => (
                    <li key={index} className="flex-1 card-main gray-hover">
                        <a
                            href="*"
                            className="w-full h-full p-4 flex flex-col gap-1"
                        >
                            <div className="w-full h-40 bg-linear-to-r from-neutral-300/30 to-[#4a69bd]/30 rounded-xl overflow-hidden flex items-center">
                                <img
                                    src={news.imageUrl}
                                    alt={news.newsId}
                                    className="transition duration-400 ease-in-out w-full h-full  hover:scale-105"
                                />
                            </div>
                            <h4 className="text-base overflow-hidden whitespace-nowrap text-ellipsis">
                                {news.title}
                            </h4>
                            <div className="text-sm text-gray-500">
                                <span>
                                    {formatRelativeTime(news.createdAt)}
                                </span>
                                <span>∙</span>
                                <span>{news.agencyName}</span>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default News;
