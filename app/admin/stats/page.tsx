"use client";

import { useEffect, useState } from "react";
import DonutChart from "../../components/admin/DonutChart";
import { bookingsToDonut, sportsToDonut } from "../../lib/donut-chart-utils";
import KpiOverview from "../../components/admin/KpiOverview";
import HeatMap from "../../components/admin/HeatMap";
import DaysDropDown from "../../components/admin/DaysDropDown";

export default function AdminStatsPage() {
    const [kpiData, setKpiData] = useState<KpiData>();
    const [bookingsBreakdownData, setBookingsBreakdownData] = useState<BookingsBreakdownData>();
    const [sportsBreakdownData, setSportsBreakdownData] = useState<SportBreakdownData[]>();
    const [heatMapMatrix, setHeatMapMatrix] = useState<Array<number[]>>();
    const [totalCourts, setTotalCourts] = useState<number>();
    
    const [days, setDays] = useState<number>(() => {
        if (typeof window === "undefined") return 90;
        const stored = localStorage.getItem("days");
        return stored ? Number(stored) : 90;
    });

    const [customFromTo, setCustomFromTo] = useState<{from: string, to: string} | null>(() => {
        if (typeof window === "undefined") return null;
        const stored = localStorage.getItem("customFromTo");
        try {
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const to = customFromTo?.to ?? new Date().toISOString().split('T')[0]
                const from = customFromTo?.from ?? new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                const res = await fetch(`/api/admin/stats?from=${from}&to=${to}`)
                if (res.ok) {
                    const data: AdminData = await res.json();
                    setKpiData(data.kpiData);
                    setBookingsBreakdownData(data.bookingsBreakdownData);
                    setSportsBreakdownData(data.sportsBreakdownData);
                    setHeatMapMatrix(data.heatMapData.heatMapMatrix)
                    setTotalCourts(data.heatMapData.totalCourts)
                }
            } catch {}
        }
        fetchStats();
    }, [days, customFromTo]);

    const bookingsChart = bookingsBreakdownData ? bookingsToDonut(bookingsBreakdownData) : null;
    const sportsChart = sportsBreakdownData ? sportsToDonut(sportsBreakdownData) : null;

    useEffect(() => {
        localStorage.setItem("days", String(days));
    }, [days]);

    useEffect(() => {
        if (customFromTo === null) {
            localStorage.removeItem("customFromTo");
        } else {
            localStorage.setItem("customFromTo", JSON.stringify(customFromTo));
        }
    }, [customFromTo])

    return (
        <main className="flex flex-col items-center w-full min-h-screen py-4 md:py-12">
            <div className="self-end px-6 py-2 md:px-24">
                <DaysDropDown setDays={setDays} days={days} setCustomFromTo={setCustomFromTo} />
            </div>
            {kpiData && <KpiOverview kpiData={kpiData} />}

            <section className="flex flex-wrap justify-center gap-4 border-y-2 md:p-8 py-6">
                <DonutChart
                    label="Bookings Overview"
                    data={bookingsChart?.data ?? []}
                    config={bookingsChart?.config ?? {}}
                />
                <DonutChart
                    label="Sports Overview"
                    data={sportsChart?.data ?? []}
                    config={sportsChart?.config ?? {}}
                />
            </section>

            <div className="p-4 md:p-8 rounded-lg border shadow-md my-8 flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-4">Bookings heat map</h2>
                {(heatMapMatrix && totalCourts) && <HeatMap heatMapMatrix={heatMapMatrix} totalCourts={totalCourts} />}
            </div>
        </main>
    );
}