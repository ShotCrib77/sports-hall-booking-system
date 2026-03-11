import { ChartConfig } from "../components/ui/chart";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function bookingsToDonut(d: BookingsBreakdownData): DonutChartInput {
  const entries: [keyof BookingsBreakdownData, string][] = [
    ["confirmed_bookings", "Confirmed"],
    ["completed_bookings", "Completed"],
    ["cancelled_bookings", "Cancelled"],
    ["no_show_bookings", "No-show"],
  ];

  const data: DonutSlice[] = entries.map(([key, label], i) => ({
    name: label,
    value: d[key],
    fill: CHART_COLORS[i % CHART_COLORS.length],
  })).filter(slice => slice.value > 0);

  const config: ChartConfig = Object.fromEntries(
    entries.map(([, label], i) => [
      label,
      { label, color: CHART_COLORS[i % CHART_COLORS.length] },
    ])
  );

  return { data, config };
}

export function sportsToDonut(rows: SportBreakdownData[]): DonutChartInput {
  const data: DonutSlice[] = rows.map((row, i) => ({
    name: row.sport,
    value: row.total,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  })).filter(slice => slice.value > 0);

  const config: ChartConfig = Object.fromEntries(
    rows.map((row, i) => [
      row.sport,
      { label: row.sport, color: CHART_COLORS[i % CHART_COLORS.length] },
    ])
  );

  return { data, config };
}