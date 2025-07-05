export interface NavItemConfig {
	key: string;
	title?: string;
	disabled?: boolean;
	external?: boolean;
	label?: string;
	icon?: string;
	href?: string;
	items?: NavItemConfig[];
	// Matcher cannot be a function in order
	// to be able to use it on the server.
	// If you need to match multiple paths,
	// can extend it to accept multiple matchers.
	matcher?: { type: "startsWith" | "equals"; href: string };
}
export interface OverviewResponse {
	income: number;
	expenses: number;
	remaining: number;
	transactions: transactions[];
}
export interface Category {
	id: number;
	category: string;
}
export interface transactions {
	id: number;
	transactionDate: Date;
	transactionMessage: string;
	transactionAmount: string;
	category: Category;
	isIncome: boolean;
	isSharedExpense: boolean;
	canIgnoreTransaction: boolean;
}
