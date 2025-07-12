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
import { Budget } from "@/features/dashboard/overview/budget";

export default function Page(): React.JSX.Element {
	const [overviewResponse, setOverviewResponse] = React.useState<OverviewResponse>();
	const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs().startOf("month"));
	const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs().endOf("day"));
	const [categories, setCategories] = React.useState<string[]>([]);
	const [catFilter, setCatFilter] = React.useState<string>();
	const [triggerReload, setTriggerReload] = React.useState<boolean>(false);

	const fetchTransactions = React.useCallback(() => {
		if (!startDate || !endDate) return;
		getTransactionForGivenRange({
			startDate: startDate.format("YYYY-MM-DD"),
			endDate: endDate.format("YYYY-MM-DD"),
			category: catFilter,
		})
			.then(setOverviewResponse)
			.then(() => setTriggerReload(false))
			.catch(console.error);
	}, [startDate, endDate, catFilter]);

	React.useEffect(() => {
		getCategories().then(setCategories).catch(console.error);
	}, []);

	React.useEffect(() => {
		fetchTransactions();
	}, [fetchTransactions, triggerReload]);

	const handleTransactionUpdate = (payload: transactions, changes: Partial<transactions>) => {
		const updatedPayload = {
			...payload,
			...changes,
		};
		updateTransaction(updatedPayload).then(fetchTransactions).catch(console.error);
		setTriggerReload(true);
	};

	const renderCheckbox = (field: keyof transactions, handler: typeof handleTransactionUpdate) =>
		function Cell({ row }: any) {
			return <Checkbox checked={row[field]} onChange={(e) => handler(row, { [field]: e.target.checked })} />;
		};

	const transactionColumns: GridColDef[] = [
		{ field: "id", headerName: "ID", flex: 0.1, minWidth: 40 },
		{ field: "transactionDate", headerName: "Date", flex: 0.5, minWidth: 40 },
		{ field: "transactionMessage", headerName: "Message", flex: 1, minWidth: 200 },
		{
			field: "transactionAmount",
			headerName: "Amount",
			flex: 0.25,
			minWidth: 40,
			renderCell: ({ row }) => (
				<span style={{ color: row.isIncome ? "green" : "red", fontWeight: 600, fontSize: 18 }}>
					₹ {row.transactionAmount}
				</span>
			),
		},
		{
			field: "isIncome",
			headerName: "Is Income",
			flex: 0.25,
			minWidth: 40,
			renderCell: renderCheckbox("isIncome", handleTransactionUpdate),
		},
		{
			field: "isSharedExpense",
			headerName: "Shared",
			flex: 0.25,
			minWidth: 40,
			renderCell: renderCheckbox("isSharedExpense", handleTransactionUpdate),
		},
		{
			field: "canIgnoreTransaction",
			headerName: "Ignore",
			flex: 0.25,
			minWidth: 40,
			renderCell: renderCheckbox("canIgnoreTransaction", handleTransactionUpdate),
		},
		{
			field: "category",
			headerName: "Category",
			flex: 0.25,
			minWidth: 200,
			align: "center",
			type: "singleSelect",
			filterable: true,
			valueOptions: ["Groceries", "Health", "Shopping", "EMI"],
			renderCell: ({ row }) => (
				<FormControl size="medium" style={{ marginTop: 10 }}>
					<InputLabel>Category</InputLabel>
					<Select
						value={row?.category?.category || ""}
						sx={{ width: 125 }}
						label="Category"
						onChange={(e) => handleTransactionUpdate(row, { category: { ...row.category, category: e.target.value } })}
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

			<Grid size={{ xs: 12, sm: 12, lg: 4 }}>
				<DatePicker
					label="Start Date"
					value={startDate}
					onChange={setStartDate}
					slotProps={{ textField: { fullWidth: true } }}
				/>
			</Grid>

			<Grid size={{ xs: 12, sm: 12, lg: 4 }}>
				<DatePicker
					label="End Date"
					value={endDate}
					onChange={setEndDate}
					slotProps={{ textField: { fullWidth: true } }}
				/>
			</Grid>
			<Grid size={{ xs: 12, sm: 12, lg: 4 }}>
				<FormControl fullWidth>
					<InputLabel>Category</InputLabel>
					<Select label="Category" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
						{categories.map((cat) => (
							<MenuItem key={cat} value={cat}>
								{cat}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Grid>

			<Grid size={{ xs: 12, sm: 12, lg: 12 }}>
				<DataTable
					loading={triggerReload}
					rowHeight={80}
					columns={transactionColumns}
					rows={overviewResponse?.transactions || []}
				/>
			</Grid>
		</Grid>
	);
}
