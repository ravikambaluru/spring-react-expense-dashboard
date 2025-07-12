import * as React from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

<<<<<<< HEAD
import { config } from '@/config';
import { AccountDetailsForm } from '@/features/dashboard/account/account-details-form';
import { AccountInfo } from '@/features/dashboard/account/account-info';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;
=======
import BalanceSummary from "@/components/dashboard/account/balance-summary";
>>>>>>> main

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
