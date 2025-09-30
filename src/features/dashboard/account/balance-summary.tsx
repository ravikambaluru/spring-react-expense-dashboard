// BalanceSummary.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
// ✅ Make sure this import is from @mui/material, not @mui/system
import { Box, Button, Grid, IconButton, MenuItem, Select, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ArrowsCounterClockwise, Eye } from "@phosphor-icons/react";

import { BalanceSummaryDTO } from "@/types/user";
import { getBalanceSummary, recalculateSharedExpenses } from "@/lib/api/transactions";
import DataTable from "@/components/core/table";

import TransactionBreakdownModal from "./transaction-breakdown-modal";

const MONTH_OPTIONS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(
	(month) => `2025-${month}`
);

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

	const columns: GridColDef[] = [
		{ field: "user", headerName: "User", flex: 1 },
		{
			field: "paid",
			headerName: "Paid",
			flex: 1,
			renderCell: (p) => <Typography>{p.value.toFixed(2)}</Typography>,
		},
		{
			field: "owed",
			headerName: "Owed",
			flex: 1,
			renderCell: (p) => <Typography>{p.value.toFixed(2)}</Typography>,
		},
		{
			field: "netBalance",
			headerName: "Net",
			flex: 1,
			renderCell: (p) => <Typography color={p.value >= 0 ? "green" : "red"}>₹{p.value.toFixed(2)}</Typography>,
		},
		{
			field: "action",
			headerName: "Details",
			width: 100,
			sortable: false,
			filterable: false,
			renderCell: (params) => {
				const onClick = (e: React.MouseEvent) => {
					e.stopPropagation(); // Prevent the grid from hijacking the click
					setSelectedUser(params.row.user);
				};
				return (
					<IconButton size="small" onClick={onClick}>
						<Eye size={20} />
					</IconButton>
				);
			},
		},
	];

	return (
		<>
			<Grid container spacing={2} sx={{ p: 2 }}>
				<Grid size={{ lg: 12 }}>
					<Box display="flex" alignItems="center" gap={2}>
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
							{loading ? "…" : "Recalculate"}
						</Button>
					</Box>
				</Grid>

				<Grid size={{ lg: 12 }}>
					<Box height={400}>
						<DataTable columns={columns} rows={data} rowHeight={0} />
					</Box>
				</Grid>
			</Grid>
			{selectedUser && (
				<TransactionBreakdownModal
					open={true} // must be a boolean
					onClose={() => setSelectedUser(null)}
					user={selectedUser}
					month={month}
				/>
			)}
		</>
	);
};

export default BalanceSummary;
