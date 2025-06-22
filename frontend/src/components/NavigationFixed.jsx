import React from 'react';

const NavigationFixed = ({ 
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
        <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Left Side - Navigation */}
                    <div className="flex items-center space-x-6">
                        <button 
                            onClick={() => navigate('/')}
                            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors font-display"
                        >
                            <span className='text-gray-900'>LazyGrant</span>
                        </button>
                        <button 
                            onClick={editCompanyInfo}
                            className="text-gray-600 hover:text-gray-900 transition-colors font-body"
                        >
                            <span className='text-gray-900'>Edit Company Info</span>
                        </button>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Predictability Score */}
                        <button 
                            onClick={() => setShowPredictabilityModal(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-gray-900 rounded-lg hover:bg-blue-100 transition-colors font-body"
                        >
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-gray-900">Predictability: {predictabilityScore.score}%</span>
                        </button>

                        {/* Export Menu */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-gray-900 rounded-lg hover:bg-purple-700 transition-colors font-body"
                            >
                                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-gray-900">Export</span>
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
                </div>
            </div>
        </nav>
    );
};

export default NavigationFixed;
