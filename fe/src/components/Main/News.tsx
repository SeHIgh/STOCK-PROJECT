import { Link } from "react-router-dom";

const newsList = [
    {
        title: "[코스닥 마감] 美 고용지표 경계감 속 소폭 상승…대왕고래 관련주 ‘뚝’",
        time: "2시간 전",
        source: "이데일리",
        category: "증권",
        link: "*",
    },
    {
        title: "매출 10조 처음 넘긴 韓 인터넷기업은 네이버",
        time: "54분 전",
        source: "매일경제",
        category: "경제",
        link: "*",
    },
    {
        title: "테슬라, Model X 가격인상 발표",
        time: "1시간 전",
        source: "연합인포맥스",
        category: "자동차",
        link: "*",
    },
    {
        title: "엔화, G10 통화 중 ‘독보적 강세’···미일 정상회담 내용에 시장 촉각",
        time: "56분 전",
        source: "서울경제",
        category: "외환",
        link: "*",
    },
];

const News = () => {
    return (
        <>
            <div className="flex flex-row justify-between items-center">
                <h1 className="section-title-main">주요 뉴스</h1>
                <Link to="/news" className="text-lg text-gray-500  mr-3">더 보기</Link>
            </div>
            <ul className="w-full flex flex-row justify-between gap-3 overflow-x-scroll pb-2 px-1">
                {newsList.map((news) => (
                    <li className="flex-1 card-main bg-white/30 gray-hover">
                        <a
                            href={news.link}
                            className="w-full h-full p-4 flex flex-col gap-1"
                        >
                            <div className="w-full h-40 bg-linear-to-r from-indigo-300/30 to-[#4a69bd]/30 rounded-xl">
                                {/* <img src="#" alt="#" /> */}
                            </div>
                            <h4 className="text-base">{news.title}</h4>
                            <div className="text-sm text-gray-500">
                                <span>{news.time}</span>
                                <span>∙</span>
                                <span>{news.source}</span>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default News;
