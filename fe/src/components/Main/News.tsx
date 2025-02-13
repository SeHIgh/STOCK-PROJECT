import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// const newsList = [
//     {
//         title: "[코스닥 마감] 美 고용지표 경계감 속 소폭 상승…대왕고래 관련주 ‘뚝’",
//         time: "2시간 전",
//         source: "이데일리",
//         category: "증권",
//         link: "*",
//     },
//     {
//         title: "매출 10조 처음 넘긴 韓 인터넷기업은 네이버",
//         time: "54분 전",
//         source: "매일경제",
//         category: "경제",
//         link: "*",
//     },
//     {
//         title: "테슬라, Model X 가격인상 발표",
//         time: "1시간 전",
//         source: "연합인포맥스",
//         category: "자동차",
//         link: "*",
//     },
//     {
//         title: "엔화, G10 통화 중 ‘독보적 강세’···미일 정상회담 내용에 시장 촉각",
//         time: "56분 전",
//         source: "서울경제",
//         category: "외환",
//         link: "*",
//     },
// ];

interface NewsProps {
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
    const [newsList, setNewsList] = useState<NewsProps[]>([]);

    const getData = useCallback(async () => {
        try {
            const response = await axios.get<NewsProps[]>(
                "http://localhost:3000/news"
            );
            setNewsList(response.data);
        } catch (error) {
            console.error("데이터 요청 실패:", error);
        }
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <>
            <div className="flex flex-row justify-between items-center">
                <h1 className="section-title-main">주요 뉴스</h1>
                <Link to="/news" className="text-lg text-gray-500  mr-3">
                    더 보기
                </Link>
            </div>
            <ul className="w-full overflow-x-scroll pb-2 px-1 grid grid-flow-row grid-cols-[minmax(260px,_1fr)_minmax(260px,_1fr)_minmax(260px,_1fr)_minmax(260px,_1fr)] gap-3">
                {newsList.slice(0, 4).map((news, index) => (
                    <li
                        key={index}
                        className="flex-1 card-main bg-white/30 gray-hover"
                    >
                        <a
                            href="*"
                            className="w-full h-full p-4 flex flex-col gap-1"
                        >
                            <div className="w-full h-40 bg-linear-to-r from-indigo-300/30 to-[#4a69bd]/30 rounded-xl overflow-hidden flex items-center">
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
