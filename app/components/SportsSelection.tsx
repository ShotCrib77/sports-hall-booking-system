export default function SportsSelection({sports, selectedSport, setSelectedSport}: {sports: string[], selectedSport: string, setSelectedSport: (sport: string) => void}) {

    const formattedSports: { sportName: string; sportSvg: string }[] = sports.map(sport => ({
        sportName: String(sport).charAt(0).toUpperCase() + String(sport).slice(1),
        sportSvg: `/${sport.toLowerCase()}.svg`
    }))
    
    return (
        <div className="flex flex-wrap gap-4 pb-12 pt-2">
            {formattedSports.map(sport => (
                <button
                    key={sport.sportName}
                    onClick={() => setSelectedSport(sport.sportName)}
                    className={`px-4 py-2 rounded-full text-md font-semibold transition-colors flex items-center gap-2 ${
                        selectedSport === sport.sportName
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sport.sportSvg} alt="" width={24} height={24} onError={(e) => e.currentTarget.style.display = "none"} className={selectedSport === sport.sportName ? "" : "invert opacity-40"} /> {sport.sportName}
                </button>
            ))}
        </div>
    );
}