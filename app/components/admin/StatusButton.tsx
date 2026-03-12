interface StatusButtonProps {
  onClick: () => void;
  disabled: boolean;
  variant: "completed" | "no_show" | "confirmed";
}

export default function StatusButton({ onClick, disabled, variant }: StatusButtonProps) {
    const styles = {
        confirmed: "text-blue-500 bg-blue-50 hover:bg-blue-100",
        completed: "text-emerald-700 bg-emerald-50 hover:bg-emerald-100",
        no_show: "text-red-600 bg-red-50 hover:bg-red-100",
    };

    const labels = {
        confirmed: "Confirmed",
        completed: "Completed",
        no_show: "No-show",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`text-left px-3 py-1.5 rounded-md text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${styles[variant]}`}
        >
            {labels[variant]}
        </button>
    );
}