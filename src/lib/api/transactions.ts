import { OverviewResponse, transactions } from "@/types/nav";

import axiosInstance from "./axios";

export interface TransactionPayload {
	startDate: string;
	endDate: string;
	category: string;
}
export const getTransactionForGivenRange = async ({
	startDate,
	endDate,
	category = "no-cat-filter",
}): Promise<OverviewResponse> => {
	const response = await axiosInstance.get("api/expenses/getExpenses/" + startDate + "/" + endDate + "/" + category);
	return response.data;
};
export const updateTransaction = async (payload: transactions): Promise<boolean> => {
	const response = await axiosInstance.put("/api/expenses/updateExpense", payload);
	return response.data;
};
