import * as React from "react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

interface Props {
	data: Record<string, number>; // matches { "2025-07-01": -2866.84, ... }
}

export function DailyExpenseChart({ data }: Props) {
	// Convert object into sorted array of { x: date, y: amount }
	const chartData = Object.entries(data)
		.map(([date, amount]) => ({ x: date, y: amount }))
		.sort((a, b) => a.x.localeCompare(b.x));

	const options: ApexOptions = {
		chart: {
			type: "line",
			toolbar: { show: false },
			zoom: { enabled: false },
		},
		stroke: {
			curve: "smooth",
			width: 3,
		},
		xaxis: {
			type: "category",
			title: { text: "Date" },
			labels: { rotate: -45 },
		},
		yaxis: {
			title: { text: "Net Amount (₹)" },
			labels: {
				formatter: (value: number) => `₹ ${value.toFixed(0)}`,
			},
		},
		legend: {
			position: "top",
			horizontalAlign: "center",
		},
		tooltip: {
			x: { format: "dd MMM" },
			y: {
				formatter: (val: number) => `₹ ${val.toLocaleString()}`,
			},
		},
	};

	const series = [
		{
			name: "Net Amount",
			data: chartData,
		},
	];

	return <Chart options={options} series={series} type="line" />;
}
