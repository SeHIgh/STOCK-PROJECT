import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";
import {
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from "@headlessui/react";
import {
    BuildingOffice2Icon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

interface StockData {
    표준코드: string;
    단축코드: string;
    "한글 종목명": string;
    "한글 종목약명": string;
    "영문 종목명": string;
    상장일: string;
    시장구분: string;
    증권구분: string;
    소속부: string;
    주식종류: string;
    액면가: string;
    상장주식수: string;
}

// Memoize ComboboxOption to prevent unnecessary re-renders
const MemoizedComboboxOption = React.memo(({ value }: { value: StockData }) => {
    return (
        <ComboboxOption
            value={value}
            className="group flex items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-neutral-600/10"
        >
            <div className="w-full text-sm/6 flex flex-row justify-start gap-2 px-1 items-center cursor-pointer">
                <BuildingOffice2Icon className="size-4 fill-neutral-900" />
                {value["한글 종목약명"]}
            </div>
        </ComboboxOption>
    );
});

const Search = () => {
    const [stockData, setStockData] = useState<StockData[]>([]);
    const [query, setQuery] = useState("");
    const [filteredStocks, setFilteredStocks] = useState<StockData[]>([]);
    const [selectedStock, setSelectedStock] = useState<StockData | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // 한 페이지에 표시할 아이템 수

    const navigate = useNavigate();

    // 디바운스를 이용한 검색어 설정 함수
    const debouncedSetQuery = useCallback(
        debounce((value: string) => {
            setQuery(value);
        }, 300),
        []
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSetQuery(event.target.value);
    };

    // 데이터 요청 함수
    const getData = useCallback(async () => {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        try {
            const response = await axios.get<StockData[]>(
                `${apiUrl}/kospi_list`
            );
            setStockData(response.data);
        } catch (error) {
            console.error("⛔️ 검색 - 데이터 요청 실패:", error);
        }
    }, []);

    // 최초 1회 데이터 요청 후 다시 요청하지 않도록 처리
    useEffect(() => {
        if (stockData.length === 0) {
            getData();
        }
    }, [getData, stockData.length]);

    // 필터링된 종목 목록을 useMemo로 최적화
    const filteredStocksMemo = useMemo(() => {
        if (query === "") {
            return stockData; // query가 비었을 때는 stockData 그대로 반환
        }
        return stockData.filter((stock) =>
            stock["한글 종목약명"].toLowerCase().includes(query.toLowerCase())
        );
    }, [query, stockData]);

    useEffect(() => {
        setFilteredStocks(filteredStocksMemo);
    }, [filteredStocksMemo]);

    // 페이지네이션 처리 (현재 페이지에 맞는 아이템만 필터링)
    const currentPageData = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredStocks.slice(indexOfFirstItem, indexOfLastItem);
    }, [currentPage, filteredStocks, itemsPerPage]);

    // 페이지 변경 함수
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // 검색 결과 선택 시 상세 페이지로 이동
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (selectedStock) {
            navigate(`/stocks/${selectedStock["한글 종목약명"]}`);
        }
    };

    return (
        <form
            data-testid="search-form"
            onSubmit={handleSubmit}
            className={`hidden lg:flex ${
                stockData.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
            <Combobox
                value={selectedStock}
                onChange={setSelectedStock}
                onClose={() => setQuery("")}
                disabled={stockData.length === 0}
            >
                <div className="relative cursor-pointer">
                    <ComboboxInput
                        placeholder="종목을 검색하세요"
                        displayValue={(stock: StockData | null) =>
                            stock ? stock["한글 종목약명"] : ""
                        }
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-2 border-neutral-400 bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                    />
                </div>
                {/* filteredStocks가 없거나 query가 비어있으면 목록을 렌더링하지 않음 */}
                {filteredStocks.length > 0 && query !== "" && (
                    <ComboboxOptions
                        anchor="bottom"
                        transition
                        className="z-100 w-[var(--input-width)] rounded-xl border-2 border-neutral-400 bg-white/5 p-1 mt-1 [--anchor-gap:var(--spacing-1)] empty:invisible transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 backdrop-blur-xs"
                    >
                        {currentPageData.map((stock) => (
                            <MemoizedComboboxOption
                                key={stock.단축코드}
                                value={stock}
                            />
                        ))}
                        {/* 페이지네이션 */}
                        <div className="mt-4 flex justify-center items-center gap-2">
                            {Array.from({
                                length: Math.ceil(
                                    filteredStocks.length / itemsPerPage
                                ),
                            }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    disabled={currentPage === index + 1}
                                    className={`${
                                        currentPage === index + 1
                                            ? "text-neutral-700"
                                            : "text-neutral-400"
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </ComboboxOptions>
                )}
            </Combobox>
            <button
                type="submit"
                disabled={stockData.length === 0}
                className="w-8 h-8 p-1 items-center"
            >
                <MagnifyingGlassIcon className="w-7 h-7 fill-neutral-900 hover:fill-neutral-500" />
            </button>
        </form>
    );
};

export default Search;
