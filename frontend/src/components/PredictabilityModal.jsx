import React from 'react';

const PredictabilityModal = ({ showModal, setShowModal, predictabilityScore }) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white/80 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Application Predictability Analysis
                    </h2>
                    <button 
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100/50"
                    >
                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Score and Overview */}
                    <div className="space-y-6">
                        <div className="text-center bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="text-6xl font-bold text-blue-600 mb-2 font-display">
                                {predictabilityScore.score}%
                            </div>
                            <div className="text-gray-700 font-medium text-lg">
                                Success Probability
                            </div>
                            <p className="text-gray-600 text-sm mt-3">
                                {predictabilityScore.description}
                            </p>
                        </div>

                        <div className="bg-green-50/80 border border-green-200/50 rounded-xl p-4 backdrop-blur-sm">
                            <h3 className="font-semibold mb-3 text-black flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Strengths
                            </h3>
                            <ul className="space-y-2">
                                {predictabilityScore.strengths.map((strength, index) => (
                                    <li key={index} className="text-black flex items-start text-sm">
                                        <span className="text-green-500 mr-2 mt-0.5">✓</span>
                                        {strength}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-amber-50/80 border border-amber-200/50 rounded-xl p-4 backdrop-blur-sm">
                            <h3 className="font-semibold mb-3 text-black flex items-center">
                                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                                Areas for Improvement
                            </h3>
                            <ul className="space-y-2 text-gray-900">
                                {predictabilityScore.improvements.map((improvement, index) => (
                                    <li key={index} className="text-black flex items-start text-sm">
                                        <span className="text-gray-900 mr-2 mt-0.5">→</span>
                                        {improvement}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Detailed Analysis */}
                    <div className="space-y-6">
                        <div className="bg-blue-50/80 border border-blue-200/50 rounded-xl p-4 backdrop-blur-sm">
                            <h3 className="font-semibold mb-4 text-black flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                Key Success Factors
                            </h3>
                            <div className="space-y-3">
                                {predictabilityScore.factors.map((factor, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-white/40 rounded-lg backdrop-blur-sm">
                                        <span className="text-black text-sm font-medium">{factor.name}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className={`font-bold text-sm ${factor.positive ? 'text-green-600' : 'text-amber-600'}`}>
                                                {factor.score}%
                                            </span>
                                            <div className={`w-2 h-2 rounded-full ${factor.positive ? 'bg-green-600' : 'bg-amber-600'}`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-purple-50/80 border border-purple-200/50 rounded-xl p-4 backdrop-blur-sm">
                            <h3 className="font-semibold mb-3 text-black flex items-center">
                                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                AI Analysis Methodology
                            </h3>
                            <p className="text-sm text-black leading-relaxed">
                                Our AI analyzes application completeness, alignment with grant requirements, 
                                budget accuracy, impact potential, and organizational credibility to generate 
                                this predictability score. The analysis considers over 50 success factors 
                                derived from thousands of historical grant applications.
                            </p>
                        </div>

                        <div className="text-center pt-4">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="bg-blue-100/80 hover:bg-blue-200/80 text-black px-8 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-blue-200/50 hover:scale-105"
                            >
                                <span className='text-gray-900'>Close Analysis</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictabilityModal;
