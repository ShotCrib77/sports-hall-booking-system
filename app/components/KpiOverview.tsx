import KpiCard from "./KpiCard";


export default function KpiOverview({ kpiData }: {kpiData: KpiData}) {
    return (
        <section className="mb-12 px-12 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Key performace indicators</h1>
            <div className="grid grid-cols-3 gap-4">
                <KpiCard label="Total signups" data={kpiData.total_signups} color="indigo"  />
                <KpiCard label="New signups" data={kpiData.new_signups} color="emerald" />
                <KpiCard label="Banned users" data={kpiData.banned_users} color="rose"    />
                <KpiCard label="Total bookings" data={kpiData.total_bookings} color="sky"     />
                <KpiCard label="Cancelled %" data={`${kpiData.cancelled_percentage}%`} color="amber"   />
                <KpiCard label="No show %" data={`${kpiData.no_show_percentage}%`} color="violet"  />
            </div>
        </section>
    );
};