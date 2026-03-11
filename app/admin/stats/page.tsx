"use client";

import { useEffect, useState } from "react";
import DonutChart from "../../components/DonutChart";
import { bookingsToDonut, sportsToDonut } from "../../lib/donut-chart-utils";
import KpiOverview from "../../components/KpiOverview";
import HeatMap from "../../components/HeatMap";

export default function AdminStatsPage() {
    const [kpiData, setKpiData] = useState<KpiData>();
    const [bookingsBreakdownData, setBookingsBreakdownData] = useState<BookingsBreakdownData>();
    const [sportsBreakdownData, setSportsBreakdownData] = useState<SportBreakdownData[]>();
    const [heatMapMatrix, setHeatMapMatrix] = useState<Array<number[]>>();
    const [totalCourts, setTotalCourts] = useState<number>();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const to = "2026-04-10" //new Date().toISOString().split('T')[0]
                const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                const res = await fetch(`/api/admin/stats?from=${from}&to=${to}`)
                if (res.ok) {
                    const data: AdminData = await res.json();
                    console.log(data)
                    setKpiData(data.kpiData);
                    setBookingsBreakdownData(data.bookingsBreakdownData);
                    setSportsBreakdownData(data.sportsBreakdownData);
                    setHeatMapMatrix(data.heatMapData.heatMapMatrix)
                    setTotalCourts(data.heatMapData.totalCourts)
                }
            } catch {}
        }
        fetchStats();
    }, [])

    const bookingsChart = bookingsBreakdownData ? bookingsToDonut(bookingsBreakdownData) : null;
    const sportsChart = sportsBreakdownData ? sportsToDonut(sportsBreakdownData) : null;

    return (
        <main className="flex flex-col items-center w-full min-h-screen py-12">
            {kpiData && <KpiOverview kpiData={kpiData} />}

            <section className="flex gap-4 border-y-2 p-8">
                {bookingsChart && <DonutChart label="Bookings Overview" data={bookingsChart.data} config={bookingsChart.config} />}
                {sportsChart && <DonutChart label="Sports Overview" data={sportsChart.data} config={sportsChart.config} />}
            </section>
            <div className="p-8 rounded-lg border shadow-md my-8 flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-4">Bookings heat map</h2>
                {(heatMapMatrix && totalCourts) && <HeatMap heatMapMatrix={heatMapMatrix} totalCourts={totalCourts} />}
            </div>
        </main>
    );
}