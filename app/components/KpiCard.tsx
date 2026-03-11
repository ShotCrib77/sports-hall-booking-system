interface KpiCardProps {
    label: string;
    data: number | string;
}

export default function KpiCard({ label, data}: KpiCardProps) {
    return (
        <div
            className="relative rounded-2xl overflow-hidden w-52 shadow-sm border"
        >

        <div className="p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                    <h3
                        className="text-xs font-semibold uppercase text-gray-500"
                    >
                        {label}
                    </h3>
                    <h2
                        className="text-4xl font-black tracking-tight"
                    >
                        {data}
                    </h2>
                </div>
            </div>
        </div>
        </div>
    );
};
