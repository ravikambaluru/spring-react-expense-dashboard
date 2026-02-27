import { CategoryRuleRequest, CategoryRuleResponse } from "@/types/nav";

import axiosInstance from "./axios";

export const getAllCategoryRules = async (): Promise<CategoryRuleResponse[]> => {
	const response = await axiosInstance.get("/api/category-rules");
	return response.data;
};

export const getActiveCategoryRules = async (): Promise<CategoryRuleResponse[]> => {
	const response = await axiosInstance.get("/api/category-rules/active");
	return response.data;
};

export const createCategoryRule = async (payload: CategoryRuleRequest): Promise<CategoryRuleResponse> => {
	const response = await axiosInstance.post("/api/category-rules", payload);
	return response.data;
};

export const updateCategoryRule = async (id: number, payload: CategoryRuleRequest): Promise<CategoryRuleResponse> => {
	const response = await axiosInstance.put(`/api/category-rules/${id}`, payload);
	return response.data;
};

export const deleteCategoryRule = async (id: number): Promise<void> => {
	await axiosInstance.delete(`/api/category-rules/${id}`);
};
