"use client";

import * as React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/system";
import { GridColDef } from "@mui/x-data-grid";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";

import { Category } from "@/types/nav";
import { createCategory, getAllCategories } from "@/lib/api/category";
import DataTable from "@/components/core/table";

const categoriesColumns: GridColDef[] = [
	{ field: "id", headerName: "ID", flex: 0.1, minWidth: 40 },
	{
		field: "category",
		headerName: "Category",
		flex: 1,
		minWidth: 40,
	},
];

export default function Page(): React.JSX.Element {
	const [categories, setCategories] = React.useState<Category[]>();
	const [open, setOpen] = React.useState(false);
	React.useEffect(() => {
		getAllCategories().then(setCategories).catch(console.error);
	}, []);
	const handleSubmit = (input: unknown) => {
		input.preventDefault();
		const value = input.target[0].value;
		createCategory(value)
			.then(getAllCategories().then(setCategories))
			.then(() => setOpen(false))
			.catch(console.error);
	};
	return (
		<>
			<Stack spacing={3}>
				<Stack direction="row" spacing={3}>
					<Stack spacing={1} sx={{ flex: "1 1 auto" }}>
						<Typography variant="h4">Categories</Typography>
					</Stack>
					<div>
						<Button
							startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
							variant="contained"
							onClick={() => setOpen(true)}
						>
							Add
						</Button>
					</div>
				</Stack>
				<Grid size={{ xs: 12, sm: 12, lg: 12 }}>
					<DataTable rowHeight={40} columns={categoriesColumns} rows={categories || []} />
				</Grid>
			</Stack>
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>Add New Category</DialogTitle>
				<DialogContent sx={{ paddingBottom: 0 }}>
					<form onSubmit={handleSubmit}>
						<TextField
							autoFocus
							required
							margin="dense"
							id="category"
							name="category"
							label="Category Name"
							fullWidth
							variant="standard"
						/>
						<DialogActions>
							<Button onClick={() => setOpen(false)}>Cancel</Button>
							<Button type="submit">Create</Button>
						</DialogActions>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
