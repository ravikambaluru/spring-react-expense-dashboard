import type { NavItemConfig } from "@/types/nav";
import { paths } from "@/paths";

export const navItems = [
	{ key: "monthlyExpenses", title: "Home", href: paths.dashboard.overview, icon: "home" },
	{ key: "monthlyTransactions", title: "Monthly Transactions", href: paths.dashboard.transactions, icon: "currency" },
	{ key: "share", title: "Share Calculators", href: paths.dashboard.shareCalculator, icon: "users" },
	{ key: "categories", title: "Categories", href: paths.dashboard.categories, icon: "gear-six" },
	{
		key: "autoCategorization",
		title: "Auto Categorization",
		href: paths.dashboard.autoCategorization,
		icon: "chart-pie",
	},
	{
		key: "categorySplitSettings",
		title: "Category Split Settings",
		href: paths.dashboard.categorySplitSettings,
		icon: "gear-six",
	},
	// { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
