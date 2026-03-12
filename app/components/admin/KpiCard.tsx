interface KpiCardProps {
    label: string;
    data: number | string;
}

export default function KpiCard({ label, data}: KpiCardProps) {
    return (
        <div className="flex flex-col w-72 px-5 py-7 sm:w-52 border rounded-2xl shadow-sm mb-4">
            <h3 className="text-xs font-semibold uppercase text-gray-500">
                {label}
            </h3>
            <h2 className="text-4xl font-black tracking-tight">
                {data}
            </h2>
        </div>
    );
};