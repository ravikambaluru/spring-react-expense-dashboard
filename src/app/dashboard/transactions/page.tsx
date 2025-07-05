"use client";

import * as React from "react";
import { Checkbox, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

import { OverviewResponse, transactions } from "@/types/nav";
import { getCategories } from "@/lib/api/category";
import { getTransactionForGivenRange, updateTransaction } from "@/lib/api/transactions";
import DataTable from "@/components/core/table";
import { Budget } from "@/components/dashboard/overview/budget";

export default function Page(): React.JSX.Element {
	const [overviewResponse, setOverviewResponse] = React.useState<OverviewResponse>();
	const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs());
	const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());
	const [categories, setCategories] = React.useState<string[]>([]);

	React.useEffect(() => {
		getCategories().then(setCategories).catch(console.error);
	}, []);

	React.useEffect(() => {
		if (!startDate || !endDate) return;
		const payload = {
			startDate: startDate.format("YYYY-MM-DD"),
			endDate: endDate.format("YYYY-MM-DD"),
		};
		getTransactionForGivenRange(payload).then(setOverviewResponse).catch(console.error);
	}, [startDate, endDate]);

	const handleIsIncomeChange = (payload: transactions, isChecked: boolean) => {
		const updatedPayload = {
			...payload,
			isIncome: isChecked,
			transactionDate: dayjs(payload.transactionDate).toDate(),
		};
		updateTransaction(updatedPayload)
			.then(() => {
				getTransactionForGivenRange({
					startDate: startDate?.format("YYYY-MM-DD") || "",
					endDate: endDate?.format("YYYY-MM-DD") || "",
				}).then(setOverviewResponse);
			})
			.catch(console.error);
	};
	const handleIsSharedExpense = (payload: transactions, isChecked: boolean) => {
		const updatedPayload = {
			...payload,
			isSharedExpense: isChecked,
			transactionDate: dayjs(payload.transactionDate).toDate(),
		};
		updateTransaction(updatedPayload)
			.then(() => {
				getTransactionForGivenRange({
					startDate: startDate?.format("YYYY-MM-DD") || "",
					endDate: endDate?.format("YYYY-MM-DD") || "",
				}).then(setOverviewResponse);
			})
			.catch(console.error);
	};
	const handleIgnoreTransaction = (payload: transactions, isChecked: boolean) => {
		const updatedPayload = {
			...payload,
			canIgnoreTransaction: isChecked,
			transactionDate: dayjs(payload.transactionDate).toDate(),
		};
		updateTransaction(updatedPayload)
			.then(() => {
				getTransactionForGivenRange({
					startDate: startDate?.format("YYYY-MM-DD") || "",
					endDate: endDate?.format("YYYY-MM-DD") || "",
				}).then(setOverviewResponse);
			})
			.catch(console.error);
	};
	const handleCategoryChange = (payload: transactions, isChecked: string) => {
		const updatedPayload = {
			...payload,
			category: isChecked,
			transactionDate: dayjs(payload.transactionDate).toDate(),
		};
		updateTransaction(updatedPayload)
			.then(() => {
				getTransactionForGivenRange({
					startDate: startDate?.format("YYYY-MM-DD") || "",
					endDate: endDate?.format("YYYY-MM-DD") || "",
				}).then(setOverviewResponse);
			})
			.catch(console.error);
	};

	const transactionColumns: GridColDef[] = [
		{ field: "id", headerName: "ID", flex: 0.1, minWidth: 40 },
		{
			field: "transactionDate",
			headerName: "Date",
			flex: 0.5,
			minWidth: 40,
		},
		{
			field: "transactionMessage",
			headerName: "Message",
			flex: 1,
			minWidth: 200,
		},
		{
			field: "transactionAmount",
			headerName: "Amount",
			flex: 0.25,
			minWidth: 40,
			renderCell: (params) => {
				const isIncome = params.row.isIncome;
				return (
					<span style={{ color: isIncome ? "green" : "red", fontWeight: 600, fontSize: 18 }}>
						₹ {params.row.transactionAmount}
					</span>
				);
			},
		},
		{
			field: "isIncome",
			headerName: "Is Income",
			flex: 0.25,
			minWidth: 40,
			renderCell: (params) => (
				<Checkbox
					checked={params.row.isIncome}
					onChange={(event) => handleIsIncomeChange(params.row, event.target.checked)}
				/>
			),
		},
		{
			field: "isSharedExpense",
			headerName: "Shared",
			flex: 0.25,
			minWidth: 40,
			renderCell: (params) => (
				<Checkbox
					checked={params.row.isSharedExpense}
					onChange={(event) => handleIsSharedExpense(params.row, event.target.checked)}
				/>
			),
		},
		{
			field: "canIgnoreTransaction",
			headerName: "ignore",
			flex: 0.25,
			minWidth: 40,
			renderCell: (params) => (
				<Checkbox
					checked={params.row.isSharedExpense}
					onChange={(event) => handleIgnoreTransaction(params.row, event.target.checked)}
				/>
			),
		},
		{
			field: "category",
			headerName: "Category",
			flex: 0.25,
			minWidth: 200,
			align: "center",
			renderCell: (params) => (
				<FormControl size="medium" style={{ marginTop: "10px" }}>
					<InputLabel>Category</InputLabel>
					<Select
						value={params.row?.category?.category}
						label="Category"
						onChange={(event) => handleCategoryChange(params.row, event.target.value)}
					>
						{categories.map((cat) => (
							<MenuItem key={cat} value={cat}>
								{cat}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			),
		},
	];

	return (
		<Grid container spacing={3}>
			<Grid size={{ xs: 12, sm: 12, lg: 12 }}>
				<Typography variant="h4">Monthly Transactions</Typography>
			</Grid>

			{["income", "expenses", "remaining"].map((type, i) => (
				<Grid size={{ xs: 12, sm: 12, lg: 4 }} key={type}>
					<Budget
						title={type.toUpperCase()}
						sx={{ height: "100%" }}
						value={(overviewResponse?.[type as keyof OverviewResponse] ?? 0).toLocaleString()}
					/>
				</Grid>
			))}

			<Grid size={{ xs: 12, sm: 12, lg: 5 }}>
				<DatePicker
					label="Start Date"
					value={startDate}
					onChange={setStartDate}
					slotProps={{ textField: { fullWidth: true } }}
				/>
			</Grid>

			<Grid size={{ xs: 12, sm: 12, lg: 2 }} />

			<Grid size={{ xs: 12, sm: 12, lg: 5 }}>
				<DatePicker
					label="End Date"
					value={endDate}
					onChange={setEndDate}
					slotProps={{ textField: { fullWidth: true } }}
				/>
			</Grid>

			<Grid size={{ xs: 12, sm: 12, lg: 12 }}>
				<DataTable columns={transactionColumns} rows={overviewResponse?.transactions || []} />
			</Grid>
		</Grid>
	);
}
