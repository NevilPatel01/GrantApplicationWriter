import React from 'react';
const Navigation = ({ 
    navigate, 
    editCompanyInfo, 
    predictabilityScore, 
    setShowPredictabilityModal, 
    showExportMenu, 
    setShowExportMenu, 
    exportToPDF, 
    copyToClipboard,
    saveAsTXT
}) => {
    return (
        <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg px-6 py-3 rounded-full flex items-center space-x-6">
                <button 
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors font-accent"
                    onClick={() => navigate('/')}
                >
                    <svg className="w-5 h-5 text-gray-600 hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className='text-black'>Dashboard</span>
                </button>
                
                <div className="h-4 w-px bg-gray-300"></div>
                
                <button 
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors font-accent"
                    onClick={editCompanyInfo}
                >
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className='text-black'>Edit</span>
                </button>
                
                <div className="h-4 w-px bg-gray-300"></div>
                                    
                <button 
                    className="bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-lg flex items-center space-x-2 font-accent transition-colors"
                    onClick={() => setShowPredictabilityModal(true)}
                >
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-black">Predictability</span>
                    <span className="text-black font-bold">{predictabilityScore.score}%</span>
                </button>
                
                <div className="relative">
                    <button 
                        className="bg-green-50 hover:bg-green-100 border border-green-200 px-4 py-2 rounded-lg flex items-center space-x-2 font-accent transition-colors"
                        onClick={() => setShowExportMenu(!showExportMenu)}
                    >
                        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-black">Export</span>
                    </button>
                    
                    {/* Export Menu */}
                    {showExportMenu && (
                        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden min-w-[200px]">
                            <button 
                                onClick={exportToPDF}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900 font-body flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span className='text-black'>Export as PDF</span>
                            </button>
                            <button 
                                onClick={saveAsTXT}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900 font-body flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className='text-black'>Save as TXT</span>
                            </button>
                            <button 
                                onClick={copyToClipboard}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900 font-body flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span className='text-black'>Copy to Clipboard</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
