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
    const isEmpty = data.length === 0;

    // Placeholder data to render a gray ring
    const displayData = isEmpty
        ? [{ name: "empty", value: 1, fill: "var(--color-gray-500)" }]
        : data;
    const displayConfig = isEmpty ? {} : config;

    return (
        <Card className={isEmpty ? "opacity-50" : ""}>
            <CardHeader>
                <CardTitle>{label}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={displayConfig} className="h-75">
                    <PieChart>
                        <Pie
                            data={displayData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={isEmpty ? 0 : 2}
                            isAnimationActive={false}
                        />
                        {!isEmpty && <ChartTooltip content={<ChartTooltipContent />} />}
                        {!isEmpty && <ChartLegend content={<ChartLegendContent />} />}
                    </PieChart>
                </ChartContainer>
                {isEmpty && (
                    <p className="text-center text-muted-foreground text-sm -mt-4">
                        No data avalibale for this period
                    </p>
                )}
            </CardContent>
        </Card>
    )
}