"use client";

import * as React from "react";
import { Card, Checkbox, FormControlLabel, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

import { DashboardAnalyticsResponse } from "@/types/nav";
import { getDashboardAnalytics } from "@/lib/api/overview";
import { CategoryBreakDownChart } from "@/components/core/chart";
import { Budget } from "@/features/dashboard/overview/budget";
import { DailyExpenseChart } from "@/features/dashboard/overview/daily-expense-breakdown";
import { IncomeExpenseChart } from "@/features/dashboard/overview/income-expense-chart";
import { SharedPersonalChart } from "@/features/dashboard/overview/shared-personal-breakdown";

export default function Page(): React.JSX.Element {
	const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs().startOf("month"));
	const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs().endOf("month"));
	const [isShared, setIsShared] = React.useState<boolean>(false);
	const [data, setData] = React.useState<DashboardAnalyticsResponse | null>(null);

	React.useEffect(() => {
		if (!startDate || !endDate) return;
		getDashboardAnalytics(
			startDate.format("YYYY-MM-DD"),
			endDate.format("YYYY-MM-DD"),
			new Date(startDate.toString()).getFullYear().toString(),
			isShared
		)
			.then(setData)
			.catch(console.error);
	}, [startDate, endDate, isShared]);
	// Safely extract values
	const income = data?.summary?.income ?? 0;
	const shared = data?.sharedVsPersonal?.shared ?? 0;
	const personal = data?.sharedVsPersonal?.personal ?? 0;
	const totalExpense = shared + personal;
	const savings = income - totalExpense;
	return (
		<Grid container spacing={3}>
			<Grid size={{ xs: 12, sm: 12, lg: 12 }}>
				<Typography variant="h4">Overview </Typography>
			</Grid>

			<Grid size={{ xs: 12, sm: 12, lg: 3 }}>
				<Budget title="Income" value={` ${income.toFixed(1)}`} />
			</Grid>

			<Grid size={{ xs: 12, sm: 12, lg: 3 }}>
				<Budget title="Shared Expense" value={` ${shared.toFixed(1)}`} />
			</Grid>
			<Grid size={{ xs: 12, sm: 12, lg: 3 }}>
				<Budget title="Personal Expenses" value={` ${personal.toFixed(1)}`} />
			</Grid>
			<Grid size={{ xs: 12, sm: 12, lg: 3 }}>
				<Budget title="Savings" value={` ${savings.toFixed(1)}`} />
			</Grid>

			<Grid size={{ xs: 12, sm: 12, lg: 5 }}>
				<Card style={{ padding: "20px" }}>
					<Typography variant="h6">Expenses By Category</Typography>
					<CategoryBreakDownChart key={JSON.stringify(data?.categoryBreakdown)} data={data?.categoryBreakdown ?? {}} />
				</Card>
			</Grid>
			<Grid size={{ xs: 12, sm: 12, lg: 5 }}>
				<Card style={{ padding: "20px" }}>
					<Typography variant="h6">Daily Expense Distribution</Typography>
					<DailyExpenseChart key={JSON.stringify(data?.categoryBreakdown)} data={data?.dailyTrend ?? {}} />
				</Card>
			</Grid>

			<Grid size={{ xs: 12, sm: 12, lg: 2 }}>
				<Card style={{ padding: "20px" }}>
					<Typography variant="h6">Filters</Typography>
					<DatePicker
						label="From Date"
						value={startDate}
						onChange={setStartDate}
						sx={{ marginTop: "20px", marginBottom: "20px" }}
					/>
					<DatePicker
						label="End Date"
						value={endDate}
						onChange={setEndDate}
						sx={{ marginTop: "20px", marginBottom: "20px" }}
					/>
                                        <FormControlLabel
                                                control={<Checkbox checked={isShared} onChange={(event) => setIsShared(event.target.checked)} />}
                                                label="Shared"
                                        ></FormControlLabel>
				</Card>
			</Grid>

			<Grid size={{ xs: 12, sm: 12, lg: 5 }}>
				<Card style={{ padding: "20px" }}>
					<Typography variant="h6">Income Vs Expenses</Typography>
					<IncomeExpenseChart data={data?.monthlySummary ?? []} />
				</Card>
			</Grid>
			<Grid size={{ xs: 12, sm: 12, lg: 5 }}>
				<Card style={{ padding: "20px" }}>
					<Typography variant="h6">Expenses Shared Distribution</Typography>
					<SharedPersonalChart key={JSON.stringify(data?.categoryBreakdown)} data={data?.sharedVsPersonal ?? {}} />
				</Card>
			</Grid>
		</Grid>
	);
}
