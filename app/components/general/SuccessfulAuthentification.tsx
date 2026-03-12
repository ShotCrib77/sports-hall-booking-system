import { Check } from "lucide-react";

export default function SuccessfulAuthentification({authType} : {authType: string}) {
    return (
        <div className="flex items-center bg-green-500 text-white absolute p-4 rounded-lg top-12">
            <Check/>
            <span className="text-lg ml-4">{authType} successful!</span>
        </div>
    );
}