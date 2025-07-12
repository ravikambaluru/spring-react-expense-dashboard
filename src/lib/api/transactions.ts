import { OverviewResponse, transactions } from "@/types/nav";
import {
  BalanceSummaryDTO,
  SettleUpRequest,
  TransactionDTO,
  TransactionRequestDTO,
  TransactionResponseDTO,
} from "@/types/user";
import axiosInstance from "./axios";

export interface TransactionPayload {
        startDate: string;
        endDate: string;
        category?: string;
}
export const getTransactionForGivenRange = async ({
        startDate,
        endDate,
        category = "no-cat-filter",
}: TransactionPayload): Promise<OverviewResponse> => {
	const response = await axiosInstance.get("api/expenses/getExpenses/" + startDate + "/" + endDate + "/" + category);
	return response.data;
};
export const updateTransaction = async (payload: transactions): Promise<boolean> => {
	const response = await axiosInstance.put("/api/expenses/updateExpense", payload);
	return response.data;
};

const BASE_URL = "/api/transactions";

export const createTransaction = async (request: TransactionRequestDTO): Promise<TransactionResponseDTO> => {
	const response = await axiosInstance.post<TransactionResponseDTO>(BASE_URL, request);
	return response.data;
};

export const getBalanceSummary = async (month: string): Promise<BalanceSummaryDTO[]> => {
	const response = await axiosInstance.get<BalanceSummaryDTO[]>(`${BASE_URL}/summary`, { params: { month } });
	return response.data;
};

export const settleUpTransaction = async (request: SettleUpRequest): Promise<TransactionResponseDTO> => {
	const response = await axiosInstance.post<TransactionResponseDTO>(`${BASE_URL}/settle-up`, request);
	return response.data;
};
export const getTransactionBreakdown = async (user: string, month: string): Promise<TransactionDTO[]> => {
	const res = await axiosInstance.get(`${BASE_URL}/breakdown`, { params: { user, month } });
	return res.data;
};
