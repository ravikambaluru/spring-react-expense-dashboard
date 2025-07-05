import type { NavItemConfig } from "@/types/nav";
import { paths } from "@/paths";

export const navItems = [
	{ key: "monthlyExpenses", title: "Home", href: paths.dashboard.overview, icon: "home" },
	{ key: "monthlyTransactions", title: "Monthly Transactions", href: paths.dashboard.transactions, icon: "currency" },
	// { key: 'share', title: 'Share With Raghu', href: paths.dashboard.customers, icon: 'users' },
	{ key: "categories", title: "Categories", href: paths.dashboard.categories, icon: "gear-six" },
	// { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
	// { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
