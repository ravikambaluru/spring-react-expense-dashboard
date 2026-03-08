import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import type { SxProps } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { CurrencyDollarIcon } from "@phosphor-icons/react/dist/ssr/CurrencyDollar";
import { EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";

export interface BudgetProps {
	sx?: SxProps;
	value: string;
	title: string;
	isValueVisible?: boolean;
	onVisibilityToggle?: () => void;
}

export function Budget({
	title,
	sx,
	value,
	isValueVisible = true,
	onVisibilityToggle,
}: BudgetProps): React.JSX.Element {
	return (
		<Card sx={sx}>
			<CardContent>
				<Stack spacing={3}>
					<Stack direction="row" sx={{ alignItems: "flex-start", justifyContent: "space-between" }} spacing={3}>
						<Stack spacing={1}>
							<Typography color="text.secondary" variant="overline">
								{title}
							</Typography>
							<Typography variant="h4">{isValueVisible ? `₹ ${value}` : "••••"}</Typography>
						</Stack>
						<Stack spacing={1} sx={{ alignItems: "flex-end" }}>
							{onVisibilityToggle ? (
								<Tooltip title={isValueVisible ? "Hide amount" : "Show amount"}>
									<IconButton
										aria-label={isValueVisible ? "Hide amount" : "Show amount"}
										size="small"
										onClick={onVisibilityToggle}
									>
										{isValueVisible ? (
											<EyeSlashIcon fontSize="var(--icon-fontSize-md)" />
										) : (
											<EyeIcon fontSize="var(--icon-fontSize-md)" />
										)}
									</IconButton>
								</Tooltip>
							) : null}
							<Avatar sx={{ backgroundColor: "var(--mui-palette-primary-main)", height: "56px", width: "56px" }}>
								<CurrencyDollarIcon fontSize="var(--icon-fontSize-lg)" />
							</Avatar>
						</Stack>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
}
