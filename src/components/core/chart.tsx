import * as React from "react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

import { CategoryBreakdown } from "@/types/nav";

interface Props {
	data: CategoryBreakdown;
}
export function CategoryBreakDownChart({ data }: Props) {
	const labels = Object.keys(data);
	const legends = Object.values(data);

	const options: ApexOptions = {
		chart: {
			type: "donut",
		},
		labels,
		legend: {
			position: "right",
		},
	};

	return <Chart options={options} series={legends} type="donut" />;
}
