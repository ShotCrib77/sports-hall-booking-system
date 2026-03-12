import KpiCard from "./KpiCard";


export default function KpiOverview({ kpiData }: {kpiData: KpiData}) {
    return (
        <section className="mb-12 px-12 flex flex-col items-center">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Key performace indicators</h1>
            <div className="flex justify-center flex-wrap lg:grid lg:grid-cols-3 gap-4">
                <KpiCard label="Total signups" data={kpiData.total_signups} />
                <KpiCard label="New signups" data={kpiData.new_signups} />
                <KpiCard label="Banned users" data={kpiData.banned_users} />
                <KpiCard label="Total bookings" data={kpiData.total_bookings} />
                <KpiCard label="Cancelled %" data={kpiData.cancelled_percentage ? `${kpiData.cancelled_percentage}%` : "-"} />
                <KpiCard label="No show %" data={kpiData.no_show_percentage ? `${kpiData.no_show_percentage}%` : "-"} />
            </div>
        </section>
    );
};