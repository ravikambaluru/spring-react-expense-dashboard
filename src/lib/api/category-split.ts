import { CategorySplitSettingRequest, CategorySplitSettingResponse } from "@/types/nav";

import axiosInstance from "./axios";

const BASE_URL = "/api/category-split";

export const getCategorySettings = async (category: string): Promise<CategorySplitSettingResponse[]> => {
	const res = await axiosInstance.get(`${BASE_URL}/${category}`);
	return res.data;
};
export const getAllCategorySettings = async (): Promise<CategorySplitSettingResponse[]> => {
	const res = await axiosInstance.get(`${BASE_URL}/getAllSplitSettings`);
	return res.data;
};

export const addCategorySetting = async (data: CategorySplitSettingRequest): Promise<void> => {
	await axiosInstance.post(BASE_URL, data);
};

export const deleteCategorySetting = async (id: number): Promise<void> => {
	await axiosInstance.delete(`${BASE_URL}/${id}`);
};
export const getAllUsers = async (): Promise<string[]> => {
	const data = await axiosInstance.get(`${BASE_URL}/getAllUsers`);
	return data.data;
};
