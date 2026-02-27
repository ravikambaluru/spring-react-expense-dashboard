import * as React from "react";
import { SparkleIcon } from "@phosphor-icons/react/dist/ssr/Sparkle";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import BalanceSummary from "@/features/dashboard/account/balance-summary";

export default function Page(): React.JSX.Element {
	return (
		<Stack spacing={3}>
			<Paper
				elevation={0}
				sx={{
					p: { xs: 2, md: 3 },
					borderRadius: 3,
					background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #38bdf8 100%)",
					color: "common.white",
				}}
			>
				<Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
					<SparkleIcon size={22} weight="fill" />
					<Typography variant="overline" sx={{ opacity: 0.95, letterSpacing: 1 }}>
						Share Calculators
					</Typography>
				</Stack>
				<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
					Smart Share & Settle-Up
				</Typography>
				<Typography variant="body1" sx={{ opacity: 0.95, maxWidth: 740 }}>
					Track who paid, who owes, and settle faster with a cleaner monthly overview of shared expenses.
				</Typography>
			</Paper>

			<Grid container>
				<Grid size={{ xs: 12 }}>
					<BalanceSummary />
				</Grid>
			</Grid>
		</Stack>
	);
}
