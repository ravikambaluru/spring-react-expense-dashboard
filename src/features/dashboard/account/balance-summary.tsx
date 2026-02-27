"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Card, CardContent, Grid, IconButton, MenuItem, Select, Stack, Typography } from "@mui/material";
import { ArrowsCounterClockwise, Eye } from "@phosphor-icons/react";
import type { GridColDef } from "@mui/x-data-grid";

import { BalanceSummaryDTO } from "@/types/user";
import { getBalanceSummary, recalculateSharedExpenses } from "@/lib/api/transactions";
import DataTable from "@/components/core/table";

import TransactionBreakdownModal from "./transaction-breakdown-modal";

const MONTH_OPTIONS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(
	(month) => `2025-${month}`
);

const rupee = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

const BalanceSummary: React.FC = () => {
	const [month, setMonth] = useState(MONTH_OPTIONS[0]);
	const [data, setData] = useState<BalanceSummaryDTO[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedUser, setSelectedUser] = useState<string | null>(null);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const summary = await getBalanceSummary(month);
			setData(summary);
		} finally {
			setLoading(false);
		}
	}, [month]);

	useEffect(() => {
		load();
	}, [load]);

	const handleRecalc = useCallback(async () => {
		setLoading(true);
		try {
			await recalculateSharedExpenses(month);
			await load();
		} finally {
			setLoading(false);
		}
	}, [month, load]);

	const totals = useMemo(
		() => ({
			totalPaid: data.reduce((sum, user) => sum + user.paid, 0),
			totalOwed: data.reduce((sum, user) => sum + user.owed, 0),
			positiveBalances: data.filter((user) => user.netBalance > 0).length,
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
			renderCell: (p: { value: number }) => <Typography fontWeight={600}>₹ {rupee.format(p.value)}</Typography>,
		},
		{
			field: "owed",
			headerName: "Owed",
			flex: 1,
			minWidth: 130,
			renderCell: (p: { value: number }) => <Typography>₹ {rupee.format(p.value)}</Typography>,
		},
		{
			field: "netBalance",
			headerName: "Net Balance",
			flex: 1,
			minWidth: 150,
			renderCell: (p: { value: number }) => (
				<Typography color={p.value >= 0 ? "success.main" : "error.main"} fontWeight={700}>
					₹ {rupee.format(p.value)}
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
								<Select size="small" value={month} onChange={(e) => setMonth(e.target.value as string)}>
									{MONTH_OPTIONS.map((m) => (
										<MenuItem key={m} value={m}>
											{m}
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
										Users to Receive
									</Typography>
									<Typography variant="h5">{totals.positiveBalances}</Typography>
								</Box>
							</Grid>
						</Grid>

						<DataTable loading={loading} columns={columns} rows={data} rowHeight={56} />
					</Stack>
				</CardContent>
			</Card>
			{selectedUser ? <TransactionBreakdownModal open onClose={() => setSelectedUser(null)} user={selectedUser} month={month} /> : null}
		</>
	);
};

export default BalanceSummary;
