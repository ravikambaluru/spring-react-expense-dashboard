export interface User {
	id: string;
	name?: string;
	avatar?: string;
	email?: string;

	[key: string]: unknown;
}
export interface TransactionRequestDTO {
	description: string;
	amount: number;
	paidByUserId: number;
	category: string; // category name
	isShared: boolean;
	isSettlement: boolean;
	isSplitOverridden?: boolean;
	customSplit?: Record<number, number>; // userId -> percent
}

export interface TransactionResponseDTO {
	transactionId: number;
	description: string;
	amount: number;
	shares: Record<string, number>; // userName -> amount
}

export interface BalanceSummaryDTO {
	user: string;
	paid: number;
	owed: number;
	netBalance: number;
}

export interface SettleUpRequest {
	fromUserId: number;
	toUserId: number;
	transactionId: number;
	amount: number;
}
export interface TransactionDTO {
	id: number;
	description: string;
	category: string;
	amount: number;
	paidBy: string;
	splitPercentage: number;
	netImpact: number;
}
