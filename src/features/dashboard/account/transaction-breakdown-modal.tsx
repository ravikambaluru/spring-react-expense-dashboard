"use client";

import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { XIcon } from "@phosphor-icons/react/dist/ssr";

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

	useEffect(() => {
		if (open) {
			getTransactionBreakdown(user, month).then(setRows);
		}
	}, [open, user, month]);

	const handleSettle = async (txn: TransactionDTO) => {
		await settleUpTransaction({
			fromUserId: txn.paidBy === "Ravi" ? 2 : 1,
			toUserId: txn.paidBy === "Ravi" ? 1 : 2,
			transactionId: txn.id,
			amount: txn.netImpact,
		});
		onClose(); // Optionally refresh parent
	};
	// rows: Array<{ amount: number; … }>

	const columns: GridColDef[] = [
		{ field: "id", headerName: "ID", flex: 1 },
		{ field: "description", headerName: "Description", flex: 1 },
		{ field: "category", headerName: "Category", flex: 1 },
		{ field: "amount", headerName: "Amount", flex: 1 },
		{ field: "paidBy", headerName: "Paid By", flex: 1 },
		{ field: "splitPercentage", headerName: "Split %", flex: 1 },
		{ field: "netImpact", headerName: "Net Impact", flex: 1 },
		{
			field: "action",
			headerName: "Settle",
			renderCell: (params) => <Button onClick={() => handleSettle(params.row)}>Settle</Button>,
			flex: 1,
		},
	];

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
			<DialogTitle>
				Transactions with {user}
				<IconButton onClick={onClose} sx={{ float: "right" }}>
					<XIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<Typography variant="body2" sx={{ mb: 2 }}>
					These are shared expenses contributing to the balance with {user}.
				</Typography>
				<DataTable columns={columns} rows={rows} rowHeight={0} />
			</DialogContent>
		</Dialog>
	);
};

export default TransactionBreakdownModal;
