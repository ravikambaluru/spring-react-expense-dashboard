"use client";

import * as React from "react";
import { Box, Button, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { DownloadIcon, UploadIcon } from "@phosphor-icons/react/dist/ssr";

import { Category, CategorySplitSettingResponse } from "@/types/nav";
import { getAllCategories } from "@/lib/api/category";
import {
        addCategorySetting,
        getAllCategorySettings,
        getAllUsers,
} from "@/lib/api/category-split";
import DataTable from "@/components/core/table";
import LoadingScreen from "@/components/core/loading-screen";

export default function Page(): React.JSX.Element {
        const [categories, setCategories] = React.useState<Category[]>([]);
        const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
        const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
        const [settings, setSettings] = React.useState<CategorySplitSettingResponse[]>([]);
        const [users, setUsers] = React.useState<string[]>([]);
        const [percentage, setPercentage] = React.useState("");
        const [loading, setLoading] = React.useState(false);

        const fetchSettings = React.useCallback(async () => {
                try {
                        setLoading(true);
                        const [allCategories, allSettings, allUsers] = await Promise.all([
                                getAllCategories(),
                                getAllCategorySettings(),
                                getAllUsers(),
                        ]);

                        setCategories(allCategories ?? []);
                        setSettings(allSettings ?? []);
                        setUsers(Array.isArray(allUsers) ? allUsers : []);
                } catch (error) {
                        console.error("Error fetching settings:", error);
                } finally {
                        setLoading(false);
                }
        }, []);

	React.useEffect(() => {
		fetchSettings();
	}, [fetchSettings]);
	React.useEffect(() => {
		console.log("Users loaded:", users);
	}, [users]);

        const handleAdd = async () => {
                if (!selectedCategory || !selectedUser || !percentage) return;

                setLoading(true);
                await addCategorySetting({
                        category: selectedCategory,
                        user: selectedUser,
                        percentage: Number(percentage),
                });

                setSelectedCategory(null);
                setSelectedUser(null);
                setPercentage("");
                fetchSettings();
                setLoading(false);
        };

	const columns: GridColDef[] = [
		{ field: "id", headerName: "ID", flex: 1 },
		{ field: "category", headerName: "Category", flex: 1 },
		{ field: "user", headerName: "User", flex: 1 },
		{
			field: "percentage",
			headerName: "Percentage",
			flex: 1,
			renderCell: ({ row }) => {
				return `${row?.percentage} %`;
			},
		},
	];

	return (
		<>
			<Stack spacing={3}>
				<Stack direction="row" spacing={3}>
					<Stack spacing={1} sx={{ flex: "1 1 auto" }}>
						<Typography variant="h4">Category Split Settings</Typography>
						<Stack direction="row" spacing={1}>
							<Button color="inherit" startIcon={<UploadIcon />}>
								Import
							</Button>
							<Button color="inherit" startIcon={<DownloadIcon />}>
								Export
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</Stack>

                        <Box sx={{ p: 3 }}>
				<Typography variant="h5" mb={2}>
					Add New Split
				</Typography>

				<Grid container spacing={2} alignItems="center" mb={2}>
					<Grid size={{ lg: 4 }}>
						<TextField
							fullWidth
							select
							label="Category"
							value={selectedCategory ?? ""}
							onChange={(e) => {
								setSelectedCategory(e.target.value ?? null);
							}}
						>
							{categories.map((cat) => (
								<MenuItem key={cat.id} value={cat.category}>
									{cat.category}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid size={{ lg: 4 }}>
						<TextField
							fullWidth
							select
							label="User"
							value={selectedUser ?? ""}
							onChange={(e) => setSelectedUser(e.target.value)}
						>
							{users.map((user) => (
								<MenuItem key={user} value={user}>
									{user}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid size={{ lg: 3 }}>
						<TextField
							fullWidth
							label="Percentage"
							type="number"
							value={percentage}
							onChange={(e) => setPercentage(e.target.value)}
						/>
					</Grid>
					<Grid size={{ lg: 1 }}>
						<Button
							variant="contained"
							onClick={handleAdd}
							disabled={!selectedCategory || !selectedUser || !percentage}
						>
							Add
						</Button>
					</Grid>
				</Grid>

                                <DataTable columns={columns} rows={settings} rowHeight={60} />
                        </Box>
                        <LoadingScreen open={loading} />
                </>
        );
}
