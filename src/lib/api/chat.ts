import axiosInstance from "./axios";
import {AxiosResponse} from "axios";
export type Sender = "ASSISTANT" | "USER";
export interface ChatApiResponse {
  messageRole?: Sender;
	message?: string;
}

export const sendHomeChatMessage: (message: string) => Promise<ChatApiResponse[]> = async (message: string): Promise<ChatApiResponse[]> => {
	const response:AxiosResponse<ChatApiResponse[]> = await axiosInstance.post("/api/home/chat", {message});
	return response.data;
};
