import { useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HeatMap({ heatMapMatrix, totalCourts }: { heatMapMatrix: Array<number[]>, totalCourts: number }) {
    const [tooltip, setTooltip] = useState<{
        count: number,
        x: number,
        y: number
    } | null>(null)

    return (
        <section className="flex flex-col gap-2">
            <div className="flex gap-1">
                <div className="md:w-11 w-8" /> {/* spacer to align with day labels */}
                    {Array.from({ length: 14 }, (_, i) => (
                        <div key={i} className="w-4 h-4 md:w-8 md:h-8 flex items-center justify-center text-xs font-semibold md:text-base">
                            {i + 8}
                        </div>
                    ))}
            </div>
            {heatMapMatrix.map((dayTimes, dayIndex) => (
                <div key={dayIndex} className="flex items-center">
                    <h2 className="md:w-12 w-8 text-center font-semibold text-xs mr-1 md:text-base">{days[dayIndex]}</h2>
                    <div className="flex gap-1">
                        {dayTimes.map((amountOfBookings, hourIndex) => {
                            if (hourIndex < 8 || hourIndex > 21) return null
                            const opacity = 0.1 + Math.round((amountOfBookings / totalCourts) * 10) / 10 * 0.9;
                            return(
                                <div key={hourIndex}>
                                    <div 
                                        onMouseEnter={(e) => setTooltip({ count: amountOfBookings, x: e.clientX, y: e.clientY })}
                                        onMouseMove={(e) => setTooltip(prev => prev ? {...prev, x: e.clientX, y: e.clientY} : null)}
                                        onMouseLeave={() => setTooltip(null)}
                                        className="bg-emerald-600 w-4 h-4 md:w-8 md:h-8" style={{opacity: opacity}}
                                
                                    />
                                    {tooltip && (
                                        <div 
                                            className="fixed bg-white border-2 border-black text-sm rounded-md px-2 py-1 pointer-events-none"
                                            style={{ left: tooltip.x + 10, top: tooltip.y - 30 }}
                                        >
                                            {tooltip.count} / {totalCourts}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </section>
    );
}