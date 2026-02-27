export const paths = {
	home: "/",
	auth: { signIn: "/auth/sign-in", signUp: "/auth/sign-up", resetPassword: "/auth/reset-password" },
	dashboard: {
		overview: "/dashboard",
		transactions: "/dashboard/transactions",
		shareCalculator: "/dashboard/account",
		categories: "/dashboard/categories",
		categorySplitSettings: "/dashboard/integrations",
		autoCategorization: "/dashboard/auto-categorization",
		settings: "/dashboard/settings",
	},
	errors: { notFound: "/errors/not-found" },
} as const;
