import * as React from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import BalanceSummary from "@/components/dashboard/account/balance-summary";

export default function Page(): React.JSX.Element {
	return (
		<Stack spacing={3}>
			<div>
				<Typography variant="h4">Share & SettleUp !!</Typography>
			</div>
			<Grid container size={{ lg: 12 }}>
				<BalanceSummary />
			</Grid>
		</Stack>
	);
}
