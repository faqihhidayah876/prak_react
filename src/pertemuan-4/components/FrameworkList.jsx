import frameworkData from "../framework.json";

export default function FrameworkList() {
    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            {/* Header Section */}
            <div className="max-w-4xl mx-auto mb-10 text-center">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                    JavaScript Frameworks
                </h1>
                <p className="text-slate-500">
                    Koleksi framework modern untuk development web
                </p>
            </div>

            {/* Cards Grid */}
            <div className="max-w-4xl mx-auto grid gap-6">
                {frameworkData.map((item) => (
                    <div 
                        key={item.id} 
                        className="bg-white rounded-xl border border-slate-200 p-6 
                                 hover:shadow-lg hover:border-blue-300 transition-all 
                                 duration-300 ease-out group"
                    >
                        {/* Top Section: Title & Tags */}
                        <div className="flex flex-col sm:flex-row sm:items-start 
                                      sm:justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 
                                             group-hover:text-blue-600 transition-colors">
                                    {item.name}
                                </h2>
                                <p className="text-slate-600 mt-1 text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 sm:justify-end">
                                {item.tags.map((tag, index) => (
                                    <span 
                                        key={index} 
                                        className="bg-blue-50 text-blue-700 px-3 py-1 
                                                 text-xs font-medium rounded-full 
                                                 border border-blue-100"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-100 my-4"></div>

                        {/* Bottom Section: Meta Info & Action */}
                        <div className="flex flex-col sm:flex-row sm:items-center 
                                      justify-between gap-4">
                            {/* Developer & Year */}
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 
                                                  flex items-center justify-center 
                                                  text-slate-500">
                                        <svg className="w-4 h-4" fill="none" 
                                             stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" 
                                                  strokeLinejoin="round" 
                                                  strokeWidth={2} 
                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs">Developer</p>
                                        <p className="text-slate-700 font-medium">
                                            {item.details.developer}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="h-8 w-px bg-slate-200"></div>
                                
                                <div>
                                    <p className="text-slate-400 text-xs">Release</p>
                                    <p className="text-slate-700 font-medium">
                                        {item.details.releaseYear}
                                    </p>
                                </div>
                            </div>

                            {/* Visit Button */}
                            <a 
                                href={item.details.officialWebsite} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white 
                                         border-2 border-blue-500 text-blue-600 
                                         px-5 py-2 rounded-lg text-sm font-semibold
                                         hover:bg-blue-500 hover:text-white 
                                         transition-all duration-200 group/btn"
                            >
                                <span>Visit Website</span>
                                <svg 
                                    className="w-4 h-4 transform group-hover/btn:translate-x-1 
                                             transition-transform" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" 
                                          strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Footer */}
            <p className="text-center text-slate-400 text-sm mt-12">
                Total {frameworkData.length} framework tersedia
            </p>
        </div>
    );
}