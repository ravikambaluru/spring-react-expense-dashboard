// src/api/transactionApi.ts
import { DashboardAnalyticsResponse, OverviewResponse } from "@/types/nav";

import axiosInstance from "./axios";

// Define a type for transaction

// GET: fetch all transactions
export const getOverviewData = async (): Promise<OverviewResponse> => {
	const response = await axiosInstance.get("api/home/overviewData");
	return response.data;
};
export const getDashboardAnalytics = async (
	startDate: string,
	endDate: string,
	year: string,
	isShared: boolean
): Promise<DashboardAnalyticsResponse> => {
	const response = await axiosInstance.get("/api/home/overview", {
		params: {
			startDate,
			endDate,
			year,
			isShared,
		},
	});

	return response.data;
};
