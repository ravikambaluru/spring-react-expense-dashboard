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
				columns={columns}
				rows={rows}
				loading={loading}
				pagination
				pageSizeOptions={[5, 10, 25, 50, 100]}
				paginationModel={paginationModel}
				onPaginationModelChange={(model) => {
					setPaginationModel(model);
				}}
				showToolbar
				sortModel={[{ field: "transactionDate", sort: "asc" }]}
				disableRowSelectionOnClick
				rowHeight={rowHeight}
				slots={{ toolbar: GridToolbar }}
			/>
		</div>
	);
};

export default DataTable;
