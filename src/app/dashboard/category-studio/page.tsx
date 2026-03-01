"use client";

import * as React from "react";
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	InputLabel,
	LinearProgress,
	MenuItem,
	Paper,
	Select,
	Stack,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { PlusIcon, SparkleIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr";

import {
	Category,
	CategoryRulePatternType,
	CategoryRuleRequest,
	CategoryRuleResponse,
	CategorySplitSettingResponse,
} from "@/types/nav";
import { createCategory, getAllCategories } from "@/lib/api/category";
import {
	createCategoryRule,
	deleteCategoryRule,
	getActiveCategoryRules,
	getAllCategoryRules,
	updateCategoryRule,
} from "@/lib/api/category-rules";
import {
	addCategorySetting,
	deleteCategorySetting,
	getAllCategorySettings,
	getAllUsers,
} from "@/lib/api/category-split";
import LoadingScreen from "@/components/core/loading-screen";
import DataTable from "@/components/core/table";

const patternTypeOptions: CategoryRulePatternType[] = ["CONTAINS", "STARTS_WITH", "EXACT", "REGEX"];

const getEmptyRuleForm = (): CategoryRuleRequest => ({
	patternType: "CONTAINS",
	patternValue: "",
	categoryId: 0,
	priority: 0,
	confidence: 1,
	active: true,
});

export default function Page(): React.JSX.Element {
	const [categories, setCategories] = React.useState<Category[]>([]);
	const [settings, setSettings] = React.useState<CategorySplitSettingResponse[]>([]);
	const [users, setUsers] = React.useState<string[]>([]);
	const [rules, setRules] = React.useState<CategoryRuleResponse[]>([]);
	const [activeRules, setActiveRules] = React.useState<CategoryRuleResponse[]>([]);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [success, setSuccess] = React.useState<string | null>(null);
	const [categoryName, setCategoryName] = React.useState("");
	const [selectedCategory, setSelectedCategory] = React.useState("");
	const [selectedUser, setSelectedUser] = React.useState("");
	const [percentage, setPercentage] = React.useState("");
	const [openRuleDialog, setOpenRuleDialog] = React.useState(false);
	const [editingRule, setEditingRule] = React.useState<CategoryRuleResponse | null>(null);
	const [ruleFormData, setRuleFormData] = React.useState<CategoryRuleRequest>(getEmptyRuleForm());

	const loadData = React.useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [allCategories, allSettings, allUsers, allRules, allActiveRules] = await Promise.all([
				getAllCategories(),
				getAllCategorySettings(),
				getAllUsers(),
				getAllCategoryRules(),
				getActiveCategoryRules(),
			]);
			setCategories(allCategories ?? []);
			setSettings(allSettings ?? []);
			setUsers(Array.isArray(allUsers) ? allUsers : []);
			setRules(allRules ?? []);
			setActiveRules(allActiveRules ?? []);
		} catch (error_) {
			console.error(error_);
			setError("Unable to load category studio data. Please refresh and retry.");
		} finally {
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		loadData();
	}, [loadData]);

	const clearAlerts = () => {
		setError(null);
		setSuccess(null);
	};

	const handleAddCategory = async () => {
		if (!categoryName.trim()) return;
		clearAlerts();
		setLoading(true);
		try {
			await createCategory(categoryName.trim());
			setCategoryName("");
			setSuccess("Category created successfully.");
			await loadData();
		} catch (error_) {
			console.error(error_);
			setError("Could not create category.");
			setLoading(false);
		}
	};

	const handleAddSplit = async () => {
		if (!selectedCategory || !selectedUser || !percentage) return;
		clearAlerts();
		setLoading(true);
		try {
			await addCategorySetting({
				category: selectedCategory,
				user: selectedUser,
				percentage: Number(percentage),
			});
			setSelectedCategory("");
			setSelectedUser("");
			setPercentage("");
			setSuccess("Category split setting saved.");
			await loadData();
		} catch (error_) {
			console.error(error_);
			setError("Unable to save split setting.");
			setLoading(false);
		}
	};

	const handleDeleteSplit = async (id: number) => {
		clearAlerts();
		setLoading(true);
		try {
			await deleteCategorySetting(id);
			setSuccess("Category split setting deleted.");
			await loadData();
		} catch (error_) {
			console.error(error_);
			setError("Unable to delete split setting.");
			setLoading(false);
		}
	};

	const openCreateRuleDialog = () => {
		setEditingRule(null);
		setRuleFormData(getEmptyRuleForm());
		setOpenRuleDialog(true);
	};

	const openEditRuleDialog = (rule: CategoryRuleResponse) => {
		setEditingRule(rule);
		setRuleFormData({
			patternType: rule.patternType,
			patternValue: rule.patternValue,
			categoryId: rule.categoryId,
			priority: rule.priority,
			confidence: rule.confidence,
			active: rule.active,
		});
		setOpenRuleDialog(true);
	};

	const handleSaveRule = async () => {
		if (!ruleFormData.patternValue || !ruleFormData.categoryId) return;
		clearAlerts();
		setLoading(true);
		try {
			await (editingRule ? updateCategoryRule(editingRule.id, ruleFormData) : createCategoryRule(ruleFormData));
			setOpenRuleDialog(false);
			setSuccess(editingRule ? "Category rule updated." : "Category rule created.");
			await loadData();
		} catch (error_) {
			console.error(error_);
			setError("Unable to save category rule.");
			setLoading(false);
		}
	};

	const handleToggleRule = async (rule: CategoryRuleResponse, active: boolean) => {
		clearAlerts();
		setLoading(true);
		try {
			await updateCategoryRule(rule.id, {
				patternType: rule.patternType,
				patternValue: rule.patternValue,
				categoryId: rule.categoryId,
				priority: rule.priority,
				confidence: rule.confidence,
				active,
			});
			setSuccess("Rule status updated.");
			await loadData();
		} catch (error_) {
			console.error(error_);
			setError("Unable to change rule status.");
			setLoading(false);
		}
	};

	const handleDeleteRule = async (id: number) => {
		clearAlerts();
		setLoading(true);
		try {
			await deleteCategoryRule(id);
			setSuccess("Category rule deleted.");
			await loadData();
		} catch (error_) {
			console.error(error_);
			setError("Unable to delete category rule.");
			setLoading(false);
		}
	};

	const categoriesColumns: GridColDef[] = [
		{ field: "id", headerName: "ID", flex: 0.2, minWidth: 50 },
		{ field: "category", headerName: "Category", flex: 1, minWidth: 180 },
	];

	const splitColumns: GridColDef[] = [
		{ field: "id", headerName: "ID", flex: 0.2, minWidth: 50 },
		{ field: "category", headerName: "Category", flex: 0.8, minWidth: 140 },
		{ field: "user", headerName: "User", flex: 0.8, minWidth: 140 },
		{
			field: "percentage",
			headerName: "Percentage",
			flex: 0.5,
			minWidth: 120,
			renderCell: ({ row }) => `${row.percentage}%`,
		},
		{
			field: "actions",
			headerName: "Actions",
			flex: 0.6,
			minWidth: 130,
			sortable: false,
			filterable: false,
			renderCell: ({ row }) => (
				<Button
					size="small"
					color="error"
					variant="outlined"
					startIcon={<TrashIcon />}
					onClick={() => handleDeleteSplit(row.id)}
				>
					Remove
				</Button>
			),
		},
	];

	const ruleColumns: GridColDef[] = [
		{ field: "id", headerName: "ID", minWidth: 55, flex: 0.2 },
		{
			field: "patternType",
			headerName: "Pattern",
			minWidth: 120,
			flex: 0.6,
			renderCell: ({ row }) => <Chip size="small" label={row.patternType} variant="outlined" />,
		},
		{ field: "patternValue", headerName: "Pattern Value", minWidth: 180, flex: 1 },
		{ field: "categoryName", headerName: "Category", minWidth: 140, flex: 0.7 },
		{ field: "priority", headerName: "Priority", minWidth: 90, flex: 0.4 },
		{ field: "confidence", headerName: "Confidence", minWidth: 110, flex: 0.4 },
		{
			field: "active",
			headerName: "Active",
			minWidth: 100,
			flex: 0.4,
			renderCell: ({ row }) => (
				<Switch checked={row.active} onChange={(event) => handleToggleRule(row, event.target.checked)} />
			),
		},
		{
			field: "actions",
			headerName: "Actions",
			minWidth: 220,
			flex: 0.9,
			sortable: false,
			filterable: false,
			renderCell: ({ row }) => (
				<Stack direction="row" spacing={1}>
					<Button size="small" variant="outlined" onClick={() => openEditRuleDialog(row)}>
						Edit
					</Button>
					<Button size="small" color="error" variant="outlined" onClick={() => handleDeleteRule(row.id)}>
						Delete
					</Button>
				</Stack>
			),
		},
	];

	const ruleActivation = rules.length > 0 ? Math.round((activeRules.length / rules.length) * 100) : 0;

	return (
		<>
			<Stack spacing={3}>
				<Paper
					elevation={0}
					sx={{
						p: 3,
						borderRadius: 3,
						color: "common.white",
						background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 55%, #ec4899 100%)",
					}}
				>
					<Stack
						direction={{ xs: "column", md: "row" }}
						spacing={2}
						justifyContent="space-between"
						alignItems={{ md: "center" }}
					>
						<Box>
							<Typography variant="h4">Category Studio</Typography>
							<Typography variant="body2" sx={{ opacity: 0.85 }}>
								One workspace to create categories, split settings, and smart auto-categorization rules.
							</Typography>
						</Box>
						<Button startIcon={<SparkleIcon />} variant="contained" color="inherit" onClick={openCreateRuleDialog}>
							New Auto Rule
						</Button>
					</Stack>
				</Paper>

				{error ? <Alert severity="error">{error}</Alert> : null}
				{success ? <Alert severity="success">{success}</Alert> : null}

				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 4 }}>
						<Card>
							<CardContent>
								<Typography variant="overline" color="text.secondary">
									Total Categories
								</Typography>
								<Typography variant="h4">{categories.length}</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid size={{ xs: 12, md: 4 }}>
						<Card>
							<CardContent>
								<Typography variant="overline" color="text.secondary">
									Split Settings
								</Typography>
								<Typography variant="h4">{settings.length}</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid size={{ xs: 12, md: 4 }}>
						<Card>
							<CardContent>
								<Typography variant="overline" color="text.secondary">
									Active Auto Rules
								</Typography>
								<Typography variant="h4">{activeRules.length}</Typography>
								<LinearProgress variant="determinate" value={ruleActivation} sx={{ mt: 1, borderRadius: 5 }} />
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				<Grid container spacing={2}>
					<Grid size={{ xs: 12, lg: 4 }}>
						<Card sx={{ height: "100%" }}>
							<CardContent>
								<Typography variant="h6" mb={2}>
									Create Category
								</Typography>
								<Stack direction="row" spacing={1}>
									<TextField
										fullWidth
										label="Category name"
										value={categoryName}
										onChange={(event) => setCategoryName(event.target.value)}
									/>
									<Button
										variant="contained"
										startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
										onClick={handleAddCategory}
										disabled={!categoryName.trim()}
									>
										Add
									</Button>
								</Stack>
							</CardContent>
						</Card>
					</Grid>

					<Grid size={{ xs: 12, lg: 8 }}>
						<Card sx={{ height: "100%" }}>
							<CardContent>
								<Typography variant="h6" mb={2}>
									Add Split Setting
								</Typography>
								<Grid container spacing={1.5}>
									<Grid size={{ xs: 12, md: 4 }}>
										<TextField
											fullWidth
											select
											label="Category"
											value={selectedCategory}
											onChange={(event) => setSelectedCategory(event.target.value)}
										>
											{categories.map((category) => (
												<MenuItem key={category.id} value={category.category}>
													{category.category}
												</MenuItem>
											))}
										</TextField>
									</Grid>
									<Grid size={{ xs: 12, md: 4 }}>
										<TextField
											fullWidth
											select
											label="User"
											value={selectedUser}
											onChange={(event) => setSelectedUser(event.target.value)}
										>
											{users.map((user) => (
												<MenuItem key={user} value={user}>
													{user}
												</MenuItem>
											))}
										</TextField>
									</Grid>
									<Grid size={{ xs: 12, md: 2.5 }}>
										<TextField
											fullWidth
											type="number"
											label="Percent"
											inputProps={{ min: 0, max: 100 }}
											value={percentage}
											onChange={(event) => setPercentage(event.target.value)}
										/>
									</Grid>
									<Grid size={{ xs: 12, md: 1.5 }}>
										<Button
											fullWidth
											variant="contained"
											sx={{ height: "100%" }}
											onClick={handleAddSplit}
											disabled={!selectedCategory || !selectedUser || !percentage}
										>
											Save
										</Button>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				<Card>
					<CardContent>
						<Typography variant="h6" mb={2}>
							Categories
						</Typography>
						<DataTable columns={categoriesColumns} rows={categories} rowHeight={48} />
					</CardContent>
				</Card>

				<Card>
					<CardContent>
						<Typography variant="h6" mb={2}>
							Category Split Settings
						</Typography>
						<DataTable columns={splitColumns} rows={settings} rowHeight={60} />
					</CardContent>
				</Card>

				<Card>
					<CardContent>
						<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
							<Typography variant="h6">Auto Categorization Rules</Typography>
							<Button variant="contained" startIcon={<PlusIcon />} onClick={openCreateRuleDialog}>
								Add Rule
							</Button>
						</Stack>
						<DataTable columns={ruleColumns} rows={rules} rowHeight={66} />
					</CardContent>
				</Card>
			</Stack>

			<Dialog fullWidth maxWidth="sm" open={openRuleDialog} onClose={() => setOpenRuleDialog(false)}>
				<DialogTitle>{editingRule ? "Edit Category Rule" : "Create Category Rule"}</DialogTitle>
				<DialogContent>
					<Stack spacing={2} mt={1}>
						<FormControl fullWidth>
							<InputLabel>Pattern Type</InputLabel>
							<Select
								label="Pattern Type"
								value={ruleFormData.patternType}
								onChange={(event) =>
									setRuleFormData((previous) => ({
										...previous,
										patternType: event.target.value as CategoryRulePatternType,
									}))
								}
							>
								{patternTypeOptions.map((patternType) => (
									<MenuItem key={patternType} value={patternType}>
										{patternType}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<TextField
							fullWidth
							required
							label="Pattern Value"
							value={ruleFormData.patternValue}
							onChange={(event) => setRuleFormData((previous) => ({ ...previous, patternValue: event.target.value }))}
							helperText="Examples: contains UBER, starts with UPI, exact NETFLIX"
						/>
						<FormControl fullWidth>
							<InputLabel>Category</InputLabel>
							<Select
								label="Category"
								value={ruleFormData.categoryId || ""}
								onChange={(event) =>
									setRuleFormData((previous) => ({ ...previous, categoryId: Number(event.target.value) }))
								}
							>
								{categories.map((category) => (
									<MenuItem key={category.id} value={category.id}>
										{category.category}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<Stack direction="row" spacing={2}>
							<TextField
								fullWidth
								type="number"
								label="Priority"
								value={ruleFormData.priority}
								onChange={(event) =>
									setRuleFormData((previous) => ({ ...previous, priority: Number(event.target.value) }))
								}
							/>
							<TextField
								fullWidth
								type="number"
								label="Confidence"
								inputProps={{ min: 0, max: 1, step: 0.01 }}
								value={ruleFormData.confidence}
								onChange={(event) =>
									setRuleFormData((previous) => ({ ...previous, confidence: Number(event.target.value) }))
								}
							/>
						</Stack>
						<Stack direction="row" justifyContent="space-between" alignItems="center">
							<Typography variant="body2">Rule Active</Typography>
							<Switch
								checked={ruleFormData.active}
								onChange={(event) => setRuleFormData((previous) => ({ ...previous, active: event.target.checked }))}
							/>
						</Stack>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenRuleDialog(false)}>Cancel</Button>
					<Button
						variant="contained"
						onClick={handleSaveRule}
						disabled={!ruleFormData.patternValue || !ruleFormData.categoryId}
					>
						{editingRule ? "Save Changes" : "Create Rule"}
					</Button>
				</DialogActions>
			</Dialog>
			<LoadingScreen open={loading} />
		</>
	);
}
