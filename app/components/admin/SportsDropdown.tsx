import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export default function SportsDropdown({ sports, selectedSport, setSelectedSport }: {sports: string[], selectedSport: string, setSelectedSport: (sport: string) => void}) {
    
    return (
        <div className="flex items-center gap-2">
            <Select
                defaultValue={selectedSport.toString()}
                onValueChange={(value) => setSelectedSport(value)}
            >
                <SelectTrigger className="bg-green-500 text-white border-green-700 border-2">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                    <SelectGroup>
                        {sports.map(sport => (
                            <SelectItem key={sport} value={sport.toString()}>
                                {sport}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}
