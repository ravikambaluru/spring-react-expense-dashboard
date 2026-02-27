"use client";

import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, Stack, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { XIcon } from "@phosphor-icons/react/dist/ssr/X";

import { TransactionDTO } from "@/types/user";
import { getTransactionBreakdown, settleUpTransaction } from "@/lib/api/transactions";
import DataTable from "@/components/core/table";

interface Props {
	open: boolean;
	onClose: () => void;
	user: string;
	month: string;
}

const TransactionBreakdownModal: React.FC<Props> = ({ open, onClose, user, month }) => {
	const [rows, setRows] = useState<TransactionDTO[]>([]);
	const [settlingTransactionId, setSettlingTransactionId] = useState<number | null>(null);

	useEffect(() => {
		if (!open) return;
		getTransactionBreakdown(user, month).then(setRows).catch(console.error);
	}, [open, user, month]);

	const handleSettle = async (txn: TransactionDTO) => {
		setSettlingTransactionId(txn.id);
		try {
			await settleUpTransaction({
				fromUserId: txn.paidBy === "Ravi" ? 2 : 1,
				toUserId: txn.paidBy === "Ravi" ? 1 : 2,
				transactionId: txn.id,
				amount: txn.netImpact,
			});
			onClose();
		} finally {
			setSettlingTransactionId(null);
		}
	};

	const columns: GridColDef[] = [
		{ field: "id", headerName: "ID", minWidth: 70, flex: 0.4 },
		{ field: "description", headerName: "Description", minWidth: 220, flex: 1.2 },
		{ field: "category", headerName: "Category", minWidth: 140, flex: 0.8 },
		{
			field: "amount",
			headerName: "Amount",
			minWidth: 120,
			flex: 0.7,
			renderCell: ({ value }) => `₹ ${Number(value ?? 0).toFixed(2)}`,
		},
		{ field: "paidBy", headerName: "Paid By", minWidth: 120, flex: 0.7 },
		{
			field: "splitPercentage",
			headerName: "Split %",
			minWidth: 90,
			flex: 0.5,
			renderCell: ({ value }) => `${value}%`,
		},
		{
			field: "netImpact",
			headerName: "Net Impact",
			minWidth: 130,
			flex: 0.8,
			renderCell: ({ value }) => `₹ ${Number(value ?? 0).toFixed(2)}`,
		},
		{
			field: "action",
			headerName: "Settle",
			minWidth: 130,
			flex: 0.7,
			renderCell: ({ row }) => (
				<Button
					size="small"
					variant="contained"
					startIcon={<CheckCircleIcon />}
					onClick={() => handleSettle(row)}
					disabled={settlingTransactionId === row.id}
				>
					{settlingTransactionId === row.id ? "Settling..." : "Settle"}
				</Button>
			),
		},
	];

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
			<DialogTitle>
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<Stack>
						<Typography variant="h6">Shared Transactions - {user}</Typography>
						<Typography variant="body2" color="text.secondary">
							Month: {month}
						</Typography>
					</Stack>
					<IconButton onClick={onClose}>
						<XIcon />
					</IconButton>
				</Stack>
			</DialogTitle>
			<Divider />
			<DialogContent sx={{ pt: 2.5 }}>
				<Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
					These transactions are contributing to the current settlement balance.
				</Typography>
				<DataTable columns={columns} rows={rows} rowHeight={56} />
			</DialogContent>
		</Dialog>
	);
};

export default TransactionBreakdownModal;
