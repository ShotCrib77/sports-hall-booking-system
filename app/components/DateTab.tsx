type DateTabType = "today" | "tomorrow" | "pick";

interface DateTabProps {
  type: DateTabType;
  active: boolean;
  onClick: () => void;
  pickedDate?: string;
  onPickedDate?: (val: string) => void;
}

export default function DateTab({ type, active, onClick, pickedDate, onPickedDate }: DateTabProps) {
    const today = new Date();

    const getLabel = () => {
        if (type === "today") {
            return `Today — ${today.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
        }
        if (type === "tomorrow") {
            const t = new Date(today);
            t.setDate(t.getDate() + 1);
            return `Tomorrow — ${t.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
        }
        
        return "Pick date";
    };

    const btnClass = `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active
        ? "bg-green-500 text-white"
        : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
    }`;

    return (
        <div className="flex items-center gap-2">
            <button onClick={onClick} className={btnClass}>
                {getLabel()}
            </button>
            {type === "pick" && active && (
                <input
                    type="date"
                    value={pickedDate}
                    onChange={(e) => onPickedDate?.(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
            )}
        </div>
    );
}