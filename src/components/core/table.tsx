import React from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';

type DataTableProps = {
  columns: GridColDef[];
  rows: any[];
  loading?: boolean;
  
};


const DataTable: React.FC<DataTableProps> = ({ columns, rows, loading = false}) => {
    const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
      });
    return (
    <div style={{  width: '100%' }}>
      <DataGrid
        columns={columns}
        rows={rows}
        loading={loading}
        pagination
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        disableRowSelectionOnClick
        showToolbar
      />
    </div>
  );
};

export default DataTable;
