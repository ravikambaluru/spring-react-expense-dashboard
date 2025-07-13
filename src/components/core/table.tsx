import React from "react";
import { DataGrid, GridColDef, GridPaginationModel, GridRowsProp, GridToolbar } from "@mui/x-data-grid";

type DataTableProps = {
	columns: GridColDef[];
	rows: GridRowsProp;
	loading?: boolean;
	rowHeight: number;
};

const DataTable: React.FC<DataTableProps> = ({ columns, rows, loading = false, rowHeight }) => {
	const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
		page: 0,
		pageSize: 10,
	});

	// 🔁 Reset page when rows change (especially due to filtering, etc.)
	React.useEffect(() => {
		setPaginationModel((prev) => ({
			...prev,
			page: 0,
		}));
	}, [rows]);

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
				paginationModel={paginationModel}
				onPaginationModelChange={setPaginationModel}
				showToolbar
				sortModel={[{ field: "transactionDate", sort: "asc" }]}
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
