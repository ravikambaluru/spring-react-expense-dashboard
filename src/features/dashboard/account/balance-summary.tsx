"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, MenuItem, Select, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { EyeIcon } from "@phosphor-icons/react";

import { BalanceSummaryDTO } from "@/types/user";
import { getBalanceSummary } from "@/lib/api/transactions";

import TransactionBreakdownModal from "./transaction-breakdown-modal";

const months = ["2025-07", "2025-06", "2025-05"];

const BalanceSummary = () => {
	const [month, setMonth] = useState("2025-07");
	const [data, setData] = useState<BalanceSummaryDTO[]>([]);
	const [selectedUser, setSelectedUser] = useState<string | null>(null);

	useEffect(() => {
		getBalanceSummary(month).then(setData);
	}, [month]);

	const columns: GridColDef[] = [
		{
			field: "user",
			headerName: "User",
			flex: 1,
			renderCell: (params) => <Typography variant="h5">{params.value}</Typography>,
		},
		{
			field: "paid",
			headerName: "Total Paid",
			flex: 1,
			renderCell: (params) => <Typography variant="h5">{params.value.toFixed(1)}</Typography>,
		},
		{
			field: "owed",
			headerName: "Total Owed",
			flex: 1,
			renderCell: (params) => <Typography variant="h5">{params.value.toFixed(1)}</Typography>,
		},
		{
			field: "netBalance",
			headerName: "Net Balance",
			flex: 1,
			renderCell: (params) => (
				<Typography variant="h5" style={{ color: params.value >= 0 ? "green" : "red" }}>
					₹{params.value.toFixed(1)}
				</Typography>
			),
		},
		{
			field: "action",
			headerName: "Action",
			flex: 1,
			renderCell: (params) => (
				<IconButton onClick={() => setSelectedUser(params.row.user)}>
					<EyeIcon />
				</IconButton>
			),
		},
	];

	return (
		<Grid size={{ lg: 12 }}>
			<Box sx={{ my: 2 }}>
				<Select value={month} onChange={(e) => setMonth(e.target.value)} size="small">
					{months.map((m) => (
						<MenuItem value={m} key={m}>
							{m}
						</MenuItem>
					))}
				</Select>
			</Box>
			<DataGrid autoHeight rows={data} columns={columns} getRowId={(r) => r.user} />
			{selectedUser && (
				<TransactionBreakdownModal
					open={true}
					onClose={() => setSelectedUser(null)}
					user={selectedUser}
					month={month}
				/>
			)}
		</Grid>
	);
};

export default BalanceSummary;
