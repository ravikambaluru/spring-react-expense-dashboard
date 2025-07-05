import { Category } from "@/types/nav";

import axiosInstance from "./axios";

export const getCategories = async (): Promise<string[]> => {
	const response = await axiosInstance.get("api/category/getAll");
	return response.data;
};
export const getAllCategories = async (): Promise<Category[]> => {
	const response = await axiosInstance.get("/api/category/getAllCategories");
	return response.data;
};
export const createCategory = async (data: string): Promise<boolean> => {
	const response = await axiosInstance.post("/api/category/create", data);
	return response.data;
};
