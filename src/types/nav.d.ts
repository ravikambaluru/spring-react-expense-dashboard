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
export interface Summary {
	income: number;
	expenses: number;
	remaining: number;
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
export interface DashboardAnalyticsResponse {
	summary: Summary;
	categoryBreakdown: CategoryBreakdown;
	dailyTrend: DailyTrend;
	sharedVsPersonal: SharedVsPersonal;
	monthlySummary: MonthlySummaryItem[];
}


export interface CategoryBreakdown {
	[category: string]: number; // e.g., "EMI": 12534.84
}

export interface DailyTrend {
	[date: string]: number; // e.g., "2025-07-01": -2866.84
}

export interface SharedVsPersonal {
	shared: number;
	personal: number;
}

export interface MonthlySummaryItem {
	month: string; // e.g., "JANUARY"
	income: number;
	expense: number;
}
export interface CategorySplitSettingRequest {
	category: string; // e.g., "GROCERIES"
	user: string;
	percentage: number;
}

export interface CategorySplitSettingResponse {
	id: number;
	category: string;
	user: string;
	percentage: number;
	createdAt: string;
}

export type CategoryRulePatternType = "EXACT" | "CONTAINS" | "STARTS_WITH" | "REGEX";

export interface CategoryRuleResponse {
	id: number;
	patternType: CategoryRulePatternType;
	patternValue: string;
	categoryId: number;
	categoryName: string;
	priority: number;
	confidence: number;
	active: boolean;
}

export interface CategoryRuleRequest {
	patternType: CategoryRulePatternType;
	patternValue: string;
	categoryId: number;
	priority: number;
	confidence: number;
	active: boolean;
}
