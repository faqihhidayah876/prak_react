import { BsDatabaseExclamation } from "react-icons/bs"; 

export default function EmptyState({ text = "Belum ada data" }) {
    return (
        <div className="p-8 text-center text-gray-500 flex flex-col items-center">
            <div className="text-4xl mb-3 text-gray-400">
                <BsDatabaseExclamation />   
            </div>
            <p className="font-medium">{text}</p>
        </div>
    );
}