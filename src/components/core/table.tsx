import React from "react";
import { DataGrid, GridColDef, GridPaginationModel, GridRowsProp, GridToolbar } from "@mui/x-data-grid";

import { Category } from "@/types/nav";

type DataTableProps = {
	columns: GridColDef[];
	rows: GridRowsProp;
	loading?: boolean;
	rowHeight: number;
};

const DataTable: React.FC<DataTableProps> = ({ columns, rows, loading = false, rowHeight }) => {
	return (
		<div style={{ width: "100%" }}>
			<DataGrid
				rows={rows}
				columns={columns}
				loading={loading}
				pagination
				getRowId={(row) => {
					// 1) if the API gave us an `id`, use it
					if (row.id != null) return row.id;
					// 2) else if there's a transactionId, use that
					if ((row as any).transactionId != null) {
						return (row as any).transactionId;
					}
					// 3) otherwise fall back to a stable index-based key
					//    (you could also compose a string from other fields)
					return `${row.user}-${row.transactionDate}-${row.amount}`;
				}}
				pageSizeOptions={[5, 10, 25, 50, 100]}
				initialState={{
					pagination: {
						paginationModel: { pageSize: 10, page: 0 },
					},
				}}
				showToolbar
				disableRowSelectionOnClick
				rowHeight={rowHeight}
				slots={{ toolbar: GridToolbar }}
				filterMode="client"
				slotProps={{
					toolbar: {
						showQuickFilter: true,
						quickFilterProps: { debounceMs: 500 },
					},
				}}
			/>
		</div>
	);
};

export default DataTable;
