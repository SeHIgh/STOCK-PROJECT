import { ChangeEvent, FormEvent, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import axios from "axios";

// 폼 데이터 타입 정의
interface FormData {
    name: string;
    email: string;
    userId: string;
}

// 이벤트 핸들러 타입 정의
type InputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
type FormSubmitHandler = (
    e: FormEvent<HTMLFormElement>,
    type: "id" | "password"
) => void;

const FindAccount: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        userId: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange: InputChangeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit: FormSubmitHandler = async (e, type) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // 입력값 검증
        if (type === "id" && !formData.name) {
            setError("이름을 입력해 주세요.");
            return;
        }
        if (type === "password" && (!formData.name || !formData.email)) {
            setError("이름과 이메일을 입력해 주세요.");
            return;
        }

        try {
            if (type === "id") {
                // 아이디 찾기 API 요청
                const response = await axios.post(
                    "https://your-api-endpoint.com/find-id",
                    { name: formData.name }
                );
                setSuccessMessage(`아이디 찾기 성공: ${response.data.userId}`);
            } else {
                // 비밀번호 찾기 API 요청
                const response = await axios.post(
                    "https://your-api-endpoint.com/find-password",
                    { userId: formData.userId, email: formData.email }
                );
                setSuccessMessage(
                    `비밀번호 찾기 성공: ${response.data.message}`
                );
            }
        } catch (error: any) {
            setError(
                error.response?.data?.message || "서버 연결이 불안정 합니다."
            );
        }
    };

    return (
        <div className="flex flex-col w-dvw h-dvh py-4 justify-between">
            <div className="h-10 flex justify-center items-center">
                <a href="/" className="-m-1.5 p-1.5">
                    <img alt="" src="/monitoring.svg" className="h-8 w-auto" />
                </a>
            </div>
            <div className="w-100 min-h-104 mx-auto bg-white/20 backdrop-blur-xs p-8 rounded-lg shadow-md max-w-md flex flex-col justify-between">
                <h2 className="text-2xl font-bold mb-4">
                    아이디∙비밀번호 찾기
                </h2>
                <TabGroup className="flex-auto flex flex-col justify-between">
                    <TabList className="px-4 flex justify-between gap-2">
                        <Tab className="flex-1 py-2 px-4 text-sm font-semibold border-b-2 border-gray-300 data-[selected]:border-indigo-400 hover:border-indigo-200">
                            아이디 찾기
                        </Tab>
                        <Tab className="flex-1 py-2 px-4 text-sm font-semibold border-b-2 border-gray-300 data-[selected]:border-indigo-400 hover:border-indigo-200">
                            비밀번호 찾기
                        </Tab>
                    </TabList>
                    <TabPanels className="mt-1 flex-auto flex flex-col justify-between">
                        <TabPanel className="p-4 flex-auto">
                            <form
                                onSubmit={(e) => handleSubmit(e, "id")}
                                className="flex flex-col justify-between h-full"
                            >
                                <div className="mb-2 flex-auto">
                                    <label className="block text-sm font-medium text-gray-700">
                                        이름
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-400 focus:border-indigo-400 text-sm"
                                        required
                                    />
                                </div>
                                {/* 계정찾기 에러 메세지 */}
                                {!(error || successMessage) && (
                                    <p className="text-transparent text-sm">
                                        good
                                    </p>
                                )}
                                {error && (
                                    <p className="text-red-500 text-sm">
                                        {error}
                                    </p>
                                )}
                                {successMessage && (
                                    <p className="text-green-500 text-sm">
                                        {successMessage}
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    className="w-full mt-2 bg-indigo-400 py-2 px-4 rounded-lg text-white hover:bg-indigo-300"
                                >
                                    아이디 찾기
                                </button>
                            </form>
                        </TabPanel>
                        <TabPanel className="p-4 flex-auto">
                            <form
                                onSubmit={(e) => handleSubmit(e, "password")}
                                className="flex flex-col justify-between h-full"
                            >
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        이름
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-400 focus:border-indigo-400 text-sm"
                                        required
                                    />
                                </div>
                                <div className="mb-2 flex-auto">
                                    <label className="block text-sm font-medium text-gray-700">
                                        이메일
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="stock@stock.com"
                                        className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-400 focus:border-indigo-400 text-sm"
                                        required
                                    />
                                </div>
                                {/* 계정찾기 에러 메세지 */}
                                {!(error || successMessage) && (
                                    <p className="text-transparent text-sm">
                                        good
                                    </p>
                                )}
                                {error && (
                                    <p className="text-red-500 text-sm">
                                        {error}
                                    </p>
                                )}
                                {successMessage && (
                                    <p className="text-green-500 text-sm">
                                        {successMessage}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full mt-2 bg-indigo-400 py-2 px-4 rounded-lg text-white hover:bg-indigo-300"
                                >
                                    비밀번호 찾기
                                </button>
                            </form>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
            <div className="h-20"></div>
        </div>
    );
};

export default FindAccount;
