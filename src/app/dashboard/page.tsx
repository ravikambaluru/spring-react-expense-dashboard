"use client";

import * as React from "react";
import { Budget } from "@/features/dashboard/overview/budget";
import { DailyExpenseChart } from "@/features/dashboard/overview/daily-expense-breakdown";
import { IncomeExpenseChart } from "@/features/dashboard/overview/income-expense-chart";
import { SharedPersonalChart } from "@/features/dashboard/overview/shared-personal-breakdown";
import { Card, Checkbox, FormControlLabel, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

import { DashboardAnalyticsResponse } from "@/types/nav";
import { getDashboardAnalytics } from "@/lib/api/overview";
import { CategoryBreakDownChart } from "@/components/core/chart";
import LoadingScreen from "@/components/core/loading-screen";

export default function Page(): React.JSX.Element {
	const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs().startOf("month"));
	const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs().endOf("month"));
	const [isShared, setIsShared] = React.useState<boolean>(false);
	const [data, setData] = React.useState<DashboardAnalyticsResponse | null>(null);
	const [loading, setLoading] = React.useState(false);

	React.useEffect(() => {
		if (!startDate || !endDate) return;
		setLoading(true);
		getDashboardAnalytics(
			startDate.format("YYYY-MM-DD"),
			endDate.format("YYYY-MM-DD"),
			new Date(startDate.toString()).getFullYear().toString(),
			isShared
		)
			.then(setData)
			.catch(console.error)
			.finally(() => setLoading(false));
	}, [startDate, endDate, isShared]);
	// Safely extract values
	const income = data?.summary?.income ?? 0;
	const shared = data?.sharedVsPersonal?.shared ?? 0;
	const personal = data?.sharedVsPersonal?.personal ?? 0;
	const totalExpense = shared + personal;
	const savings = income - totalExpense;
	return (
		<>
			<Grid container spacing={3}>
				<Grid size={{ xs: 12, sm: 12, lg: 12 }}>
					<Typography variant="h4">Overview </Typography>
				</Grid>

				<Grid size={{ xs: 12, sm: 12, lg: 4 }}>
					<Budget title="Income" value={` ${income.toFixed(1)}`} />
				</Grid>

				<Grid size={{ xs: 12, sm: 12, lg: 4 }}>
					<Budget title="Shared Expense" value={` ${shared.toFixed(1)}`} />
				</Grid>
				<Grid size={{ xs: 12, sm: 12, lg: 4 }}>
					<Budget title="Personal Expenses" value={` ${personal.toFixed(1)}`} />
				</Grid>
				<Grid size={{ xs: 12, sm: 12, lg: 4 }}>
					<Budget title="Savings" value={` ${savings.toFixed(1)}`} />
				</Grid>
				<Grid size={{ xs: 12, sm: 12, lg: 8 }}>
					<Card style={{ padding: "20px" }}>
						<Typography variant="h6">Filters</Typography>
						<DatePicker label="From Date" value={startDate} onChange={setStartDate} sx={{ margin: "10px" }} />
						<DatePicker label="End Date" value={endDate} onChange={setEndDate} sx={{ margin: "10px" }} />
						<FormControlLabel
							control={<Checkbox checked={isShared} onChange={(event) => setIsShared(event.target.checked)} />}
							label="Shared"
							sx={{ margin: "10px" }}
						></FormControlLabel>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, sm: 12, lg: 6 }}>
					<Card style={{ padding: "20px" }}>
						<Typography variant="h6">Expenses By Category</Typography>
						<CategoryBreakDownChart
							key={JSON.stringify(data?.categoryBreakdown)}
							data={data?.categoryBreakdown ?? {}}
						/>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, sm: 12, lg: 6 }}>
					<Card style={{ padding: "20px" }}>
						<Typography variant="h6">Daily Expense Distribution</Typography>
						<DailyExpenseChart key={JSON.stringify(data?.categoryBreakdown)} data={data?.dailyTrend ?? {}} />
					</Card>
				</Grid>

				<Grid size={{ xs: 12, sm: 12, lg: 6 }}>
					<Card style={{ padding: "20px" }}>
						<Typography variant="h6">Income Vs Expenses</Typography>
						<IncomeExpenseChart data={data?.monthlySummary ?? []} />
					</Card>
				</Grid>
				<Grid size={{ xs: 12, sm: 12, lg: 6 }}>
					<Card style={{ padding: "20px" }}>
						<Typography variant="h6">Expenses Shared Distribution</Typography>
						<SharedPersonalChart
							key={JSON.stringify(data?.categoryBreakdown)}
							data={data?.sharedVsPersonal ?? { shared: 0, personal: 0 }}
						/>
					</Card>
				</Grid>
			</Grid>
			<LoadingScreen open={loading} />
		</>
	);
}
