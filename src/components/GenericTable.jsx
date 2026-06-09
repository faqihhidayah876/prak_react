export default function GenericTable({ columns, data, renderRow }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-2xl shadow-lg">
                <thead className="text-white bg-hijau">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className="px-6 py-3 text-left">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-800">
                    {data.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                            {renderRow(item, index)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}