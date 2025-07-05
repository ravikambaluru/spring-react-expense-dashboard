import axiosInstance from "./axios";

export const getCategories = async (): Promise<string[]> => {
	const response = await axiosInstance.get("api/category/getAll");
	return response.data;
};
