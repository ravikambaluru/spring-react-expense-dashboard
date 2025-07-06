"use client";

import * as React from "react";
import { Card, Checkbox, FormControlLabel, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

import { DashboardAnalyticsResponse } from "@/types/nav";
import { getDashboardAnalytics } from "@/lib/api/overview";
import { CategoryBreakDownChart } from "@/components/core/chart";
import { Budget } from "@/components/dashboard/overview/budget";
import { IncomeExpenseChart } from "@/components/dashboard/overview/income-expense-chart";

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

	return (
		<Grid container spacing={3}>
			<Grid size={{ xs: 12, sm: 12, lg: 12 }}>
				<Typography variant="h4">Overview </Typography>
			</Grid>

			<Grid size={{ xs: 12, sm: 12, lg: 4 }}>
				<Budget title="Income" value={` ${data?.summary?.income.toFixed(1) ?? 0}`} />
			</Grid>
			<Grid size={{ xs: 12, sm: 12, lg: 4 }}>
				<Budget title="Expense" value={` ${data?.summary?.expense.toFixed(1) ?? 0}`} />
			</Grid>
			<Grid size={{ xs: 12, sm: 12, lg: 4 }}>
				<Budget title="Ultimate Savings" value={` ${data?.summary?.remaining.toFixed(1) ?? 0}`} />
			</Grid>
			<Grid size={{ xs: 12, sm: 12, lg: 5 }}>
				<Card style={{ padding: "20px" }}>
					<Typography variant="h6">Expenses By Category</Typography>
					<CategoryBreakDownChart key={JSON.stringify(data?.categoryBreakdown)} data={data?.categoryBreakdown ?? {}} />
				</Card>
			</Grid>
			<Grid size={{ xs: 12, sm: 12, lg: 5 }}>
				<Card style={{ padding: "20px" }}>
					<Typography variant="h6">Income Vs Expenses</Typography>
					<IncomeExpenseChart data={data?.monthlySummary ?? []} />
				</Card>
			</Grid>
			<Grid size={{ xs: 12, sm: 12, lg: 2 }}>
				<Card style={{ padding: "20px", minHeight: "500px" }}>
					<Typography variant="h6">Filters</Typography>
					<DatePicker
						label="From Date"
						value={startDate}
						sx={{ marginTop: "20px", marginBottom: "20px" }}
						onChange={setStartDate}
					/>
					<DatePicker
						label="End Date"
						value={endDate}
						sx={{ marginTop: "20px", marginBottom: "20px" }}
						onChange={setEndDate}
					/>
					<FormControlLabel
						control={<Checkbox value={isShared} onChange={(event) => setIsShared(event.target.checked)} />}
						label="Shared"
					/>
				</Card>
			</Grid>
		</Grid>
	);
}
