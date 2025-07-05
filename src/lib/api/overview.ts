// src/api/transactionApi.ts
import { OverviewResponse } from "@/types/nav";

import axiosInstance from "./axios";

// Define a type for transaction

// GET: fetch all transactions
export const getOverviewData = async (): Promise<OverviewResponse> => {
	const response = await axiosInstance.get("api/home/overviewData");
	return response.data;
};
