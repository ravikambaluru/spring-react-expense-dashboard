"use client";

import * as React from "react";
import { Budget } from "@/features/dashboard/overview/budget";
import {
	Box,
	Checkbox,
	Chip,
	FormControl,
	FormControlLabel,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Stack,
	Switch,
	Typography,
} from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

import { OverviewResponse, transactions } from "@/types/nav";
import { getCategories } from "@/lib/api/category";
import { getTransactionForGivenRange, updateTransaction } from "@/lib/api/transactions";
import LoadingScreen from "@/components/core/loading-screen";
import DataTable from "@/components/core/table";

export default function Page(): React.JSX.Element {
	const [overviewResponse, setOverviewResponse] = React.useState<OverviewResponse>();
	const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs().startOf("month"));
	const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs().endOf("day"));
	const [categories, setCategories] = React.useState<string[]>([]);
	const [catFilter, setCatFilter] = React.useState<string>("all");
	const [showIncomeSummary, setShowIncomeSummary] = React.useState(false);
	const [showExpenseSummary, setShowExpenseSummary] = React.useState(false);
	const [triggerReload, setTriggerReload] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState(false);
	const UNCATEGORIZED_VALUE = "__uncategorized__";

	const getAmount = React.useCallback((amount: string) => Number.parseFloat(amount.replaceAll(",", "")) || 0, []);

	const fetchTransactions = React.useCallback(() => {
		if (!startDate || !endDate) return;
		setLoading(true);
		const backendCategoryFilter = catFilter === "all" || catFilter === UNCATEGORIZED_VALUE ? undefined : catFilter;
		getTransactionForGivenRange({
			startDate: startDate.format("YYYY-MM-DD"),
			endDate: endDate.format("YYYY-MM-DD"),
			category: backendCategoryFilter,
		})
			.then(setOverviewResponse)
			.then(() => setTriggerReload(false))
			.catch(console.error)
			.finally(() => setLoading(false));
	}, [startDate, endDate, catFilter, UNCATEGORIZED_VALUE]);

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
		setLoading(true);
		updateTransaction(updatedPayload)
			.then(fetchTransactions)
			.catch(console.error)
			.finally(() => setLoading(false));
		setTriggerReload(true);
	};

	const renderCheckbox = (field: keyof transactions, handler: typeof handleTransactionUpdate) =>
		function Cell({ row }: GridRenderCellParams<transactions>) {
			const value = row[field as keyof transactions] as boolean;
			return <Checkbox checked={value} onChange={(e) => handler(row, { [field]: e.target.checked })} />;
		};

	const categoryValueOptions = React.useMemo(() => [...categories, "Uncategorized"], [categories]);

	const filteredTransactions = React.useMemo(() => {
		const rows = overviewResponse?.transactions || [];

		let categoryFilteredRows = rows;

		if (catFilter === UNCATEGORIZED_VALUE) {
			categoryFilteredRows = rows.filter((row) => !row?.category?.category);
		} else if (catFilter !== "all") {
			categoryFilteredRows = rows.filter((row) => row?.category?.category === catFilter);
		}

		return categoryFilteredRows;
	}, [overviewResponse?.transactions, catFilter, UNCATEGORIZED_VALUE]);

	const summary = React.useMemo(() => {
		const income = filteredTransactions
			.filter((transaction) => transaction.isIncome)
			.reduce((acc, transaction) => acc + getAmount(transaction.transactionAmount), 0);
		const expenses = filteredTransactions
			.filter((transaction) => !transaction.isIncome)
			.reduce((acc, transaction) => acc + getAmount(transaction.transactionAmount), 0);

		return {
			income,
			expenses,
			remaining: income - expenses,
		};
	}, [filteredTransactions, getAmount]);

	const transactionColumns: GridColDef<transactions>[] = [
		{ field: "id", headerName: "ID", flex: 0.1, minWidth: 40 },
		{ field: "transactionDate", headerName: "Date", flex: 0.5, minWidth: 40 },
		{ field: "transactionMessage", headerName: "Message", flex: 1, minWidth: 200 },
		{
			field: "transactionAmount",
			headerName: "Amount",
			flex: 0.25,
			minWidth: 40,
			renderCell: ({ row }) => (
				<Chip
					label={`₹ ${row.transactionAmount}`}
					size="small"
					color={row.isIncome ? "success" : "error"}
					variant={row.isIncome ? "filled" : "outlined"}
					sx={{ fontWeight: 700 }}
				/>
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
			valueGetter: (_value, row) => row?.category?.category || "Uncategorized",
			valueOptions: categoryValueOptions,
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
				<Stack spacing={1}>
					<Typography variant="h4" fontWeight={700}>
						Monthly Transactions
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Track, categorize, and review your transactions with flexible filters.
					</Typography>
				</Stack>
			</Grid>

			{[
				{
					key: "income",
					title: "INCOME",
					isVisible: showIncomeSummary,
					onToggle: () => setShowIncomeSummary((prev) => !prev),
				},
				{
					key: "expenses",
					title: "EXPENSES",
					isVisible: showExpenseSummary,
					onToggle: () => setShowExpenseSummary((prev) => !prev),
				},
				{ key: "remaining", title: "REMAINING", isVisible: true },
			].map((card) => (
				<Grid size={{ xs: 12, sm: 12, lg: 4 }} key={card.key}>
					<Budget
						title={card.title}
						sx={{ height: "100%" }}
						value={summary[card.key as keyof typeof summary].toLocaleString()}
						isValueVisible={card.isVisible}
						onVisibilityToggle={card.onToggle}
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
						<MenuItem value="all">All Categories</MenuItem>
						<MenuItem value={UNCATEGORIZED_VALUE}>Uncategorized (null)</MenuItem>
						{categories.map((cat) => (
							<MenuItem key={cat} value={cat}>
								{cat}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Grid>

			<Grid size={{ xs: 12, sm: 12, lg: 12 }}>
				<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
					<FormControlLabel
						control={<Switch checked={showIncome} onChange={(event) => setShowIncome(event.target.checked)} />}
						label="Show income"
					/>
					<FormControlLabel
						control={<Switch checked={showExpenses} onChange={(event) => setShowExpenses(event.target.checked)} />}
						label="Show expenses"
					/>
				</Stack>
			</Grid>

			<Grid size={{ xs: 12, sm: 12, lg: 12 }}>
				<Paper
					elevation={0}
					sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
				>
					<Box sx={{ mb: 1 }}>
						<Typography variant="subtitle2" color="text.secondary">
							{filteredTransactions.length} transactions found
						</Typography>
					</Box>
					<DataTable
						loading={loading || triggerReload}
						rowHeight={80}
						columns={transactionColumns}
						rows={filteredTransactions}
					/>
				</Paper>
			</Grid>
			<LoadingScreen open={loading} />
		</Grid>
	);
}
