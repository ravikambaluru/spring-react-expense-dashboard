import axiosInstance from "./axios";

interface ChatApiResponse {
	response?: string;
	message?: string;
	answer?: string;
	content?: string;
	data?: string;
}

const normalizeChatReply = (payload: ChatApiResponse | string): string => {
	if (typeof payload === "string") {
		return payload;
	}

	return payload.response ?? payload.answer ?? payload.message ?? payload.content ?? payload.data ?? "";
};

export const sendHomeChatMessage = async (message: string): Promise<string> => {
	const response = await axiosInstance.post("/api/home/chat", { message });
	return normalizeChatReply(response.data).trim();
};
