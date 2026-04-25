"use client";

import * as React from "react";
import Grid from "@mui/material/Grid";
import { Box, Typography } from "@mui/material";

import { ChatWindow } from "@/features/dashboard/overview/chat-window";

export default function Page(): React.JSX.Element {
	return (
		<Grid container spacing={3}>
			<Grid size={{ xs: 12 }}>
				<Box>
					<Typography variant="h4">AI Financial Assistant</Typography>
					<Typography color="text.secondary" sx={{ mt: 1 }}>
						Ask about spending trends, savings ideas, unusual transactions, or category insights.
					</Typography>
				</Box>
			</Grid>
			<Grid size={{ xs: 12 }}>
				<ChatWindow />
			</Grid>
		</Grid>
	);
}
