import * as React from "react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

import { SharedVsPersonal } from "@/types/nav";

interface Props {
	data: SharedVsPersonal;
}

export function SharedPersonalChart({ data }: Props) {
	const options: ApexOptions = {
		chart: {
			type: "donut",
		},
		labels: ["Personal", "Shared"],
		legend: {
			position: "right",
		},
		tooltip: {
			y: {
				formatter: (val: number) => `₹ ${val.toLocaleString()}`,
			},
		},
	};

	const series = [data.personal, data.shared];

	return <Chart options={options} series={series} type="donut" height={400} />;
}
