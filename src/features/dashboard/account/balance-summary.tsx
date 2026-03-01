"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Card, CardContent, Grid, IconButton, MenuItem, Select, Stack, Typography } from "@mui/material";
import { ArrowsCounterClockwise, Eye } from "@phosphor-icons/react";
import type { GridColDef } from "@mui/x-data-grid";

import { BalanceSummaryDTO } from "@/types/user";
import { getBalanceSummary, recalculateSharedExpenses } from "@/lib/api/transactions";
import DataTable from "@/components/core/table";

import TransactionBreakdownModal from "./transaction-breakdown-modal";

const MONTH_OPTIONS = [
	{ value: "01", label: "January" },
	{ value: "02", label: "February" },
	{ value: "03", label: "March" },
	{ value: "04", label: "April" },
	{ value: "05", label: "May" },
	{ value: "06", label: "June" },
	{ value: "07", label: "July" },
	{ value: "08", label: "August" },
	{ value: "09", label: "September" },
	{ value: "10", label: "October" },
	{ value: "11", label: "November" },
	{ value: "12", label: "December" },
];

const AVAILABLE_YEARS = Array.from({ length: 5 }, (_, i) => `${new Date().getFullYear() - 2 + i}`);

const buildMonthParam = (year: string, month: string): string => `${year}-${month}`;

const rupee = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

const BalanceSummary: React.FC = () => {
	const [year, setYear] = useState(`${new Date().getFullYear()}`);
	const [month, setMonth] = useState(`${new Date().getMonth() + 1}`.padStart(2, "0"));
	const [data, setData] = useState<BalanceSummaryDTO[]>([]);
	const [loading, setLoading] = useState(false);
	const [ytdDue, setYtdDue] = useState(0);
	const [ytdLoading, setYtdLoading] = useState(false);
	const [selectedUser, setSelectedUser] = useState<string | null>(null);
	const monthParam = useMemo(() => buildMonthParam(year, month), [year, month]);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const summary = await getBalanceSummary(monthParam);
			setData(summary);
		} finally {
			setLoading(false);
		}
	}, [monthParam]);

	const loadYtdDue = useCallback(async () => {
		setYtdLoading(true);
		try {
			const targetMonth = Number(month);
			const allMonths = MONTH_OPTIONS.slice(0, targetMonth).map(({ value }) => buildMonthParam(year, value));
			const summaries = await Promise.all(allMonths.map(async (m) => getBalanceSummary(m)));
			const due = summaries.reduce((sum, summary) => {
				const unsettledForMonth = summary.reduce((monthSum, user) => monthSum + Math.max(user.owed - user.paid, 0), 0);
				return sum + unsettledForMonth;
			}, 0);
			setYtdDue(due);
		} finally {
			setYtdLoading(false);
		}
	}, [month, year]);

	useEffect(() => {
		load();
	}, [load]);

	useEffect(() => {
		loadYtdDue();
	}, [loadYtdDue]);

	const handleRecalc = useCallback(async () => {
		setLoading(true);
		try {
			await recalculateSharedExpenses(monthParam);
			await load();
			await loadYtdDue();
		} finally {
			setLoading(false);
		}
	}, [monthParam, load, loadYtdDue]);

	const totals = useMemo(
		() => ({
			totalPaid: data.reduce((sum, user) => sum + user.paid, 0),
			totalOwed: data.reduce((sum, user) => sum + user.owed, 0),
			unsettledUsers: data.filter((user) => Math.abs(user.netBalance) > 0.01).length,
			unsettledAmount: data.reduce((sum, user) => sum + Math.max(user.owed - user.paid, 0), 0),
		}),
		[data]
	);

	const columns: GridColDef[] = [
		{ field: "user", headerName: "User", flex: 1, minWidth: 120 },
		{
			field: "paid",
			headerName: "Paid",
			flex: 1,
			minWidth: 130,
			renderCell: (p) => <Typography fontWeight={600}>₹ {rupee.format(Number(p.value ?? 0))}</Typography>,
		},
		{
			field: "owed",
			headerName: "Owed",
			flex: 1,
			minWidth: 130,
			renderCell: (p) => <Typography>₹ {rupee.format(Number(p.value ?? 0))}</Typography>,
		},
		{
			field: "netBalance",
			headerName: "Net Balance",
			flex: 1,
			minWidth: 150,
			renderCell: (p) => (
				<Typography color={Number(p.value ?? 0) >= 0 ? "success.main" : "error.main"} fontWeight={700}>
					₹ {rupee.format(Number(p.value ?? 0))}
				</Typography>
			),
		},
		{
			field: "action",
			headerName: "Details",
			width: 110,
			sortable: false,
			filterable: false,
			renderCell: (params: { row: BalanceSummaryDTO }) => (
				<IconButton size="small" onClick={() => setSelectedUser(params.row.user)}>
					<Eye size={20} />
				</IconButton>
			),
		},
	];

	return (
		<>
			<Card sx={{ borderRadius: 3 }}>
				<CardContent>
					<Stack spacing={3}>
						<Stack
							direction={{ xs: "column", md: "row" }}
							justifyContent="space-between"
							alignItems={{ xs: "flex-start", md: "center" }}
							gap={2}
						>
							<Stack spacing={0.75}>
								<Typography variant="h5">Monthly Settlement Summary</Typography>
								<Typography variant="body2" color="text.secondary">
									View shared contribution details and settle balances user-wise.
								</Typography>
							</Stack>
							<Stack direction="row" spacing={1.5}>
								<Select size="small" value={year} onChange={(e) => setYear(e.target.value as string)}>
									{AVAILABLE_YEARS.map((y) => (
										<MenuItem key={y} value={y}>
											{y}
										</MenuItem>
									))}
								</Select>
								<Select size="small" value={month} onChange={(e) => setMonth(e.target.value as string)}>
									{MONTH_OPTIONS.map((m) => (
										<MenuItem key={m.value} value={m.value}>
											{m.label}
										</MenuItem>
									))}
								</Select>
								<Button
									startIcon={<ArrowsCounterClockwise size={20} />}
									variant="contained"
									onClick={handleRecalc}
									disabled={loading}
								>
									{loading ? "Refreshing..." : "Recalculate"}
								</Button>
							</Stack>
						</Stack>

						<Grid container spacing={2}>
							<Grid size={{ xs: 12, md: 4 }}>
								<Box sx={{ p: 2, borderRadius: 2, bgcolor: "var(--mui-palette-background-level1)" }}>
									<Typography variant="overline" color="text.secondary">
										Total Paid
									</Typography>
									<Typography variant="h5">₹ {rupee.format(totals.totalPaid)}</Typography>
								</Box>
							</Grid>
							<Grid size={{ xs: 12, md: 4 }}>
								<Box sx={{ p: 2, borderRadius: 2, bgcolor: "var(--mui-palette-background-level1)" }}>
									<Typography variant="overline" color="text.secondary">
										Total Owed
									</Typography>
									<Typography variant="h5">₹ {rupee.format(totals.totalOwed)}</Typography>
								</Box>
							</Grid>
							<Grid size={{ xs: 12, md: 4 }}>
								<Box sx={{ p: 2, borderRadius: 2, bgcolor: "var(--mui-palette-background-level1)" }}>
									<Typography variant="overline" color="text.secondary">
										Unsettled Participants
									</Typography>
									<Typography variant="h5">{totals.unsettledUsers}</Typography>
									<Typography variant="body2" color="text.secondary">
										Pending to settle: ₹ {rupee.format(totals.unsettledAmount)}
									</Typography>
								</Box>
							</Grid>
							<Grid size={{ xs: 12, md: 4 }}>
								<Box sx={{ p: 2, borderRadius: 2, bgcolor: "var(--mui-palette-background-level1)" }}>
									<Typography variant="overline" color="text.secondary">
										Due from start of year
									</Typography>
									<Typography variant="h5">
										{ytdLoading ? "Calculating..." : `₹ ${rupee.format(ytdDue)}`}
									</Typography>
								</Box>
							</Grid>
						</Grid>

						<DataTable loading={loading} columns={columns} rows={data} rowHeight={56} />
					</Stack>
				</CardContent>
			</Card>
			{selectedUser ? (
				<TransactionBreakdownModal open onClose={() => setSelectedUser(null)} user={selectedUser} month={monthParam} />
			) : null}
		</>
	);
};

export default BalanceSummary;
