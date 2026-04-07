import frameworkData from "../framework.json";

export default function FrameworkList() {
    return (
        <div className="p-8">
            {frameworkData.map((item) => (
                <div key={item.id} className="border p-4 mb-4 rounded-lg shadow-md bg-white">
                    <h2 className="text-lg font-bold text-gray-800">{item.name}</h2>
                    <p className="text-gray-600">{item.description}</p>

                    <p className="text-blue-500 bg-gray-300 w-fit h-5 flex items-center p-2 rounded-xl">
                        {item.details.developer}
                        <span className="font-bold ml-1">{item.details.releaseYear}</span>
                    </p>

                    <a href={item.details.officialWebsite} className="text-blue-500 
                    underline" target="_blank">Visit Website <a/>
                    
                    {item.tags.map((tag, index)=>(
                        <span key={index} className="bg-gray-200 text-gray-700 px-2
                        py-1 text-xs rounded-full mr-2">s
                            {tag}
                        </span>
                    ))}
                    </a>
                </div>
            ))}
        </div>
    );
}