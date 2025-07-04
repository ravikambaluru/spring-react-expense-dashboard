// src/api/transactionApi.ts
import axiosInstance from './axios';

// Define a type for transaction
export interface OverviewResponse {
    income:number,
    expenses: number,
    remaining: number,
    transactions: transactions[]
}
export interface transactions {
    id: number,
    transactionDate: Date,
    transactionMessage: string
    transactionAmount: string,
    category: number,
    isIncome: boolean,
    isSharedExpense: boolean
}

// GET: fetch all transactions
export const getOverviewData = async (): Promise<OverviewResponse> => {
  const response = await axiosInstance.get('api/home/overviewData');
  return response.data;
};


