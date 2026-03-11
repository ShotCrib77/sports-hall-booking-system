"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "../components/ui/chart"
import { PieChart, Pie } from "recharts"
import { ChartConfig } from "../components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface DonutChartProps {
	label: string,
	config: ChartConfig,
	data: {
		name: string,
		value: number,
		fill: string,
	}[]
}

export default function DonutChart({label, config, data}: DonutChartProps) {
	return (
		<Card>
  			<CardHeader>
				<CardTitle>
					{label}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={config} className="h-75">
					<PieChart>
						<Pie
							data={data}
							dataKey="value"
							nameKey="name"
							innerRadius={60}
							outerRadius={100}
							paddingAngle={2}
							isAnimationActive={false}
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent /> } />
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}