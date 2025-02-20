import { useEffect, useState } from "react";

// type FetchState<T> = {
//     data: T | null;
//     loading: boolean;
//     error: string | null;
// };

type FetchState<T> = {
    data: T;
    loading: boolean;
    error: string | null;
};

const useFetchData = <T>(apiCall: () => Promise<T>) => {
    const [state, setState] = useState<FetchState<T>>({
        data: [] as T,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setState({ data: [] as T, loading: true, error: null });
            try {
                const data = await apiCall();
                if (isMounted) {
                    setState({ data, loading: false, error: null });
                }
            } catch (error: any) {
                if (isMounted) {
                    setState({
                        data: [] as T,
                        loading: false,
                        error: error.message || "데이터 요청 실패",
                    });
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [apiCall]);

    return state;
};

export default useFetchData;