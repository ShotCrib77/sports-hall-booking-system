"use client"
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

interface DaysDropDownProps {
    setDays: (days: number) => void;
    days: number;
    setCustomFromTo: (input: { from: string, to: string } | null) => void;
}

const options = [7, 30, 90, 365]

export default function DaysDropDown({ setDays, days, setCustomFromTo }: DaysDropDownProps) {
    const [showCustom, setShowCustom] = useState(false)
    const [customDateFrom, setCustomDateFrom] = useState("")
    const [customDateTo, setCustomDateTo] = useState("")

    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const from = e.target.value
        setCustomDateFrom(from)
        if (customDateTo) {
            const diff = Math.round((new Date(customDateTo).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24))
            if (diff > 0) {
                setDays(diff)
                setCustomFromTo({ from, to: customDateTo })
            }
        }
    }

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const to = e.target.value
        setCustomDateTo(to)
        if (customDateFrom) {
            const diff = Math.round((new Date(to).getTime() - new Date(customDateFrom).getTime()) / (1000 * 60 * 60 * 24))
            if (diff > 0) {
                setDays(diff)
                setCustomFromTo({ from: customDateFrom, to })
            }
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Select
                defaultValue={days.toString()}
                onValueChange={(value) => {
                    if (value === "custom") {
                        setShowCustom(true)
                    } else {
                        setShowCustom(false)
                        setCustomFromTo(null)
                        setCustomDateFrom("")
                        setCustomDateTo("")
                        setDays(Number(value))
                    }
                }}
            >
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                    <SelectGroup>
                        {options.map(option => (
                            <SelectItem key={option} value={option.toString()}>
                                Past {option} days
                            </SelectItem>
                        ))}
                        <SelectItem value="custom">Custom date...</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            {showCustom && (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center">
                        <h2 className="w-12">From:</h2>
                        <input
                            type="date"
                            value={customDateFrom}
                            max={customDateTo || new Date().toISOString().split("T")[0]}
                            onChange={handleFromChange}
                            className="border rounded px-2 py-1 text-sm"
                        />
                    </div>
                    <div className="flex items-center">
                        <h2 className="w-12">To:</h2>
                        <input
                            type="date"
                            value={customDateTo}
                            min={customDateFrom}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={handleToChange}
                            className="border rounded px-2 py-1 text-sm"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}