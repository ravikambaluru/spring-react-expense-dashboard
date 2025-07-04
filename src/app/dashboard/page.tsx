'use client'
import * as React from 'react';
import Grid from '@mui/material/Grid';

import { Budget } from '@/components/dashboard/overview/budget';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { getOverviewData, OverviewResponse, transactions } from '@/lib/api/overview';
import DataTable from '@/components/core/table';
import { flex, height, minWidth, width } from '@mui/system';



export default function Page(): React.JSX.Element {
  const [overviewResponse,setOverviewResponse]=React.useState<OverviewResponse>();
  React.useEffect(()=>{
    getOverviewData().then(setOverviewResponse).catch(console.error);
  },[]);

const transactionColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex:0.1,minWidth:40
   },
  {
    field: 'transactionDate',
    headerName: 'Date',
    flex: 0.5,
    minWidth:40,
  },
  {
    field: 'transactionMessage',
    headerName: 'Message',
    flex: 1,
    minWidth:200
  },
  {
    field: 'transactionAmount',
    headerName: 'Amount',
    flex: 0.25,
    minWidth:40,
    renderCell: (params) => {
      const isIncome = params.row.isIncome;
      const amount=params.row.transactionAmount.toString();
      amount.split("/")
      return (
        <span style={{ color: isIncome ? 'green' : 'red', fontWeight: 600, fontSize:18 }}>
          ₹ {params.row.transactionAmount}
        </span>
        
      );
    },
  },
];

  return (
    <Grid container spacing={3}>
      <Grid
        size={{
          lg: 4,
          sm: 6,
          xs: 12,
        }}
      >
        <Budget title={"income".toUpperCase()} sx={{ height: '100%' }} value={(overviewResponse?.income ?? 0).toLocaleString()} />
      </Grid>
      <Grid
        size={{
          lg: 4,
          sm: 6,
          xs: 12,
        }}
      >
        <Budget title={"expenses".toUpperCase()} sx={{ height: '100%' }} value={(overviewResponse?.expenses ?? 0).toLocaleString()} />
      </Grid>
      <Grid
        size={{
          lg: 4,
          sm: 6,
          xs: 12,
        }}
      >
        <Budget title={"remaining".toUpperCase()} sx={{ height: '100%' }} value={(overviewResponse?.remaining ?? 0).toLocaleString()} />
      </Grid>

      <Grid
        size={{
          lg: 12,
          xs: 12,
        }}
      >
        <DataTable columns={transactionColumns} rows={overviewResponse?.transactions} />

      </Grid>
    </Grid>
  );
}
