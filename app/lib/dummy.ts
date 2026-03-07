export const generateMarch = (): Record<string, TimesObject> => {
    const result: Record<string, TimesObject> = {}

    for (let day = 1; day <= 31; day++) {
        const date = `2026-03-${String(day).padStart(2, "0")}`
        result[date] = {
            courts: [1, 2, 3].map(courtId => ({
                courtId,
                name: `Court ${courtId}`,
                slots: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"].map((time, i) => ({
                    time,
                    booked: (day + courtId + i) % 3 === 0
                }))
            }))
        }
    }

    return result
}