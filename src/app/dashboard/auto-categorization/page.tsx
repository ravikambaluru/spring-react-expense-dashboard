"use client";

import * as React from "react";
import {
	Alert,
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Stack,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";

import { Category, CategoryRulePatternType, CategoryRuleRequest, CategoryRuleResponse } from "@/types/nav";
import { getAllCategories } from "@/lib/api/category";
import {
	createCategoryRule,
	deleteCategoryRule,
	getAllCategoryRules,
	getActiveCategoryRules,
	updateCategoryRule,
} from "@/lib/api/category-rules";
import DataTable from "@/components/core/table";
import LoadingScreen from "@/components/core/loading-screen";

const patternTypeOptions: CategoryRulePatternType[] = ["CONTAINS", "STARTS_WITH", "EXACT", "REGEX"];

const getEmptyForm = (): CategoryRuleRequest => ({
	patternType: "CONTAINS",
	patternValue: "",
	categoryId: 0,
	priority: 0,
	confidence: 1,
	active: true,
});

export default function Page(): React.JSX.Element {
	const [rules, setRules] = React.useState<CategoryRuleResponse[]>([]);
	const [activeRules, setActiveRules] = React.useState<CategoryRuleResponse[]>([]);
	const [categories, setCategories] = React.useState<Category[]>([]);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [open, setOpen] = React.useState(false);
	const [editingRule, setEditingRule] = React.useState<CategoryRuleResponse | null>(null);
	const [formData, setFormData] = React.useState<CategoryRuleRequest>(getEmptyForm());

	const loadData = React.useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [allRules, allActiveRules, allCategories] = await Promise.all([
				getAllCategoryRules(),
				getActiveCategoryRules(),
				getAllCategories(),
			]);
			setRules(allRules ?? []);
			setActiveRules(allActiveRules ?? []);
			setCategories(allCategories ?? []);
		} catch (error_) {
			console.error(error_);
			setError("Unable to load category rules. Please refresh and try again.");
		} finally {
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		loadData();
	}, [loadData]);

	const openCreateDialog = () => {
		setEditingRule(null);
		setFormData(getEmptyForm());
		setOpen(true);
	};

	const openEditDialog = (rule: CategoryRuleResponse) => {
		setEditingRule(rule);
		setFormData({
			patternType: rule.patternType,
			patternValue: rule.patternValue,
			categoryId: rule.categoryId,
			priority: rule.priority,
			confidence: rule.confidence,
			active: rule.active,
		});
		setOpen(true);
	};

	const handleSave = async () => {
		if (!formData.patternValue || !formData.categoryId) return;
		setLoading(true);
		try {
			await (editingRule ? updateCategoryRule(editingRule.id, formData) : createCategoryRule(formData));
			setOpen(false);
			await loadData();
		} catch (error_) {
			console.error(error_);
			setError("Unable to save rule. Please validate data and retry.");
			setLoading(false);
		}
	};

	const handleToggleActive = async (rule: CategoryRuleResponse, active: boolean) => {
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
			await loadData();
		} catch (error_) {
			console.error(error_);
			setError("Unable to update active status.");
			setLoading(false);
		}
	};

	const handleDelete = async (id: number) => {
		setLoading(true);
		try {
			await deleteCategoryRule(id);
			await loadData();
		} catch (error_) {
			console.error(error_);
			setError("Unable to delete selected rule.");
			setLoading(false);
		}
	};

	const columns: GridColDef[] = [
		{ field: "id", headerName: "ID", minWidth: 60, flex: 0.3 },
		{
			field: "patternType",
			headerName: "Pattern Type",
			minWidth: 120,
			flex: 0.6,
			renderCell: ({ row }) => <Chip label={row.patternType} variant="outlined" size="small" />,
		},
		{ field: "patternValue", headerName: "Pattern", minWidth: 220, flex: 1 },
		{ field: "categoryName", headerName: "Category", minWidth: 140, flex: 0.7 },
		{ field: "priority", headerName: "Priority", minWidth: 100, flex: 0.4 },
		{
			field: "confidence",
			headerName: "Confidence",
			minWidth: 110,
			flex: 0.5,
			renderCell: ({ row }) => `${Number(row.confidence).toFixed(2)}`,
		},
		{
			field: "active",
			headerName: "Active",
			minWidth: 120,
			flex: 0.5,
			renderCell: ({ row }) => (
				<Switch checked={row.active} onChange={(e) => handleToggleActive(row, e.target.checked)} />
			),
		},
		{
			field: "actions",
			headerName: "Actions",
			minWidth: 220,
			flex: 0.8,
			sortable: false,
			filterable: false,
			renderCell: ({ row }) => (
				<Stack direction="row" spacing={1}>
					<Button size="small" variant="outlined" onClick={() => openEditDialog(row)}>
						Edit
					</Button>
					<Button size="small" color="error" variant="outlined" onClick={() => handleDelete(row.id)}>
						Delete
					</Button>
				</Stack>
			),
		},
	];

	return (
		<>
			<Stack spacing={3}>
				<Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center">
					<Stack spacing={1}>
						<Typography variant="h4">Auto Categorization Engine</Typography>
						<Typography color="text.secondary" variant="body2">
							Create pattern rules to auto-assign categories on incoming transactions.
						</Typography>
					</Stack>
					<Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={openCreateDialog}>
						Add Rule
					</Button>
				</Stack>

				{error ? <Alert severity="error">{error}</Alert> : null}

				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 4 }}>
						<Paper sx={{ p: 2 }} elevation={1}>
							<Typography variant="overline" color="text.secondary">
								Total Rules
							</Typography>
							<Typography variant="h4">{rules.length}</Typography>
						</Paper>
					</Grid>
					<Grid size={{ xs: 12, md: 4 }}>
						<Paper sx={{ p: 2 }} elevation={1}>
							<Typography variant="overline" color="text.secondary">
								Active Rules
							</Typography>
							<Typography variant="h4">{activeRules.length}</Typography>
						</Paper>
					</Grid>
					<Grid size={{ xs: 12, md: 4 }}>
						<Paper sx={{ p: 2 }} elevation={1}>
							<Typography variant="overline" color="text.secondary">
								Inactive Rules
							</Typography>
							<Typography variant="h4">{Math.max(rules.length - activeRules.length, 0)}</Typography>
						</Paper>
					</Grid>
				</Grid>

				<Box>
					<DataTable columns={columns} rows={rules} rowHeight={68} />
				</Box>
			</Stack>

			<Dialog fullWidth maxWidth="sm" open={open} onClose={() => setOpen(false)}>
				<DialogTitle>{editingRule ? "Edit Category Rule" : "Create Category Rule"}</DialogTitle>
				<DialogContent>
					<Stack spacing={2} mt={1}>
						<FormControl fullWidth>
							<InputLabel>Pattern Type</InputLabel>
							<Select
								label="Pattern Type"
								value={formData.patternType}
								onChange={(e) => setFormData((prev) => ({ ...prev, patternType: e.target.value as CategoryRulePatternType }))}
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
							value={formData.patternValue}
							onChange={(e) => setFormData((prev) => ({ ...prev, patternValue: e.target.value }))}
							helperText="Example: contains ZOMATO, starts with UPI, exact NETFLIX"
						/>
						<FormControl fullWidth>
							<InputLabel>Category</InputLabel>
							<Select
								label="Category"
								value={formData.categoryId || ""}
								onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: Number(e.target.value) }))}
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
								value={formData.priority}
								onChange={(e) => setFormData((prev) => ({ ...prev, priority: Number(e.target.value) }))}
							/>
							<TextField
								fullWidth
								type="number"
								inputProps={{ min: 0, max: 1, step: 0.01 }}
								label="Confidence"
								value={formData.confidence}
								onChange={(e) => setFormData((prev) => ({ ...prev, confidence: Number(e.target.value) }))}
							/>
						</Stack>
						<Stack direction="row" alignItems="center" justifyContent="space-between">
							<Typography variant="body2">Rule Active</Typography>
							<Switch
								checked={formData.active}
								onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
							/>
						</Stack>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button
						variant="contained"
						onClick={handleSave}
						disabled={!formData.patternValue || !formData.categoryId}
					>
						{editingRule ? "Save Changes" : "Create Rule"}
					</Button>
				</DialogActions>
			</Dialog>
			<LoadingScreen open={loading} />
		</>
	);
}
