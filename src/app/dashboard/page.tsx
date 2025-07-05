"use client";

import * as React from "react";
import Grid from "@mui/material/Grid";

import { getOverviewData } from "@/lib/api/overview";
import DataTable from "@/components/core/table";
import { Budget } from "@/components/dashboard/overview/budget";

export default function Page(): React.JSX.Element {
	const [overviewResponse, setOverviewResponse] = React.useState<OverviewResponse>();
	React.useEffect(() => {
		getOverviewData().then(setOverviewResponse).catch(console.error);
	}, []);

	return (
		<Grid container spacing={3}>
			<Grid
				size={{
					lg: 4,
					sm: 6,
					xs: 12,
				}}
			>
				<Budget
					title={"income".toUpperCase()}
					sx={{ height: "100%" }}
					value={(overviewResponse?.income ?? 0).toLocaleString()}
				/>
			</Grid>
			<Grid
				size={{
					lg: 4,
					sm: 6,
					xs: 12,
				}}
			>
				<Budget
					title={"expenses".toUpperCase()}
					sx={{ height: "100%" }}
					value={(overviewResponse?.expenses ?? 0).toLocaleString()}
				/>
			</Grid>
			<Grid
				size={{
					lg: 4,
					sm: 6,
					xs: 12,
				}}
			>
				<Budget
					title={"remaining".toUpperCase()}
					sx={{ height: "100%" }}
					value={(overviewResponse?.remaining ?? 0).toLocaleString()}
				/>
			</Grid>

			<Grid
				size={{
					lg: 12,
					xs: 12,
				}}
			></Grid>
		</Grid>
	);
}
