import * as React from "react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

import { MonthlySummaryItem } from "@/types/nav";

interface Props {
	data: MonthlySummaryItem[];
}

export function IncomeExpenseChart({ data }: Props) {
	const categories = data.map((item) => item.month);
	const incomeData = data.map((item) => item.income);
	const expenseData = data.map((item) => item.expense);

	const options: ApexOptions = {
		chart: {
			type: "line",
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: false,
			},
		},
		stroke: {
			curve: "smooth", // makes the line smooth like a sinusoidal wave
			width: 3,
		},
		xaxis: {
			categories,
			title: {
				text: "Month",
			},
		},
		yaxis: {
			title: {
				text: "Amount (₹)",
			},
			labels: {
				formatter: (value: number) => `₹ ${value.toFixed(0)}`, // Customize here
			},
		},
		legend: {
			position: "top",
			horizontalAlign: "center",
		},
		tooltip: {
			y: {
				formatter: (val: number) => `₹ ${val.toLocaleString()}`,
			},
		},
	};

	const series = [
		{ name: "Income", data: incomeData },
		{ name: "Expense", data: expenseData },
	];

	return <Chart options={options} series={series} type="line" height={500} />;
}
