import React from 'react';

const AnalysisLoader = ({ showLoader, analysisProgress }) => {
    if (!showLoader) return null;

    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50">
            <div className="relative">
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-12 max-w-md mx-auto text-center">
                    <div className="absolute inset-0 rounded-3xl overflow-hidden">
                        <div 
                            className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-pulse"
                            style={{
                                animation: 'liquidWave 3s ease-in-out infinite',
                                background: `linear-gradient(45deg, 
                                    rgba(59, 130, 246, 0.1), 
                                    rgba(147, 51, 234, 0.1), 
                                    rgba(236, 72, 153, 0.1))`
                            }}
                        ></div>
                    </div>

                    <div className="relative z-10">
                        <div className="mb-6">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                                <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 mb-3 font-display">
                            Advanced Data Analysis
                        </h3>

                        <p className="text-gray-600 mb-6 font-body">
                            Analyzing your application data using AI-powered insights to optimize your grant proposal.
                        </p>

                        <div className="relative mb-6">
                            <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out relative"
                                    style={{ width: `${analysisProgress}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 mt-2 font-mono">
                                {analysisProgress}% Complete
                            </div>
                        </div>

                        <div className="text-sm text-gray-500 space-y-2 font-body">
                            <div className="animate-pulse">💡 Analyzing market trends and competitive landscape</div>
                            <div className="animate-pulse" style={{ animationDelay: '1s' }}>🔍 Evaluating financial projections and risk factors</div>
                            <div className="animate-pulse" style={{ animationDelay: '2s' }}>⚡ Generating personalized recommendations</div>
                        </div>
                    </div>
                </div>

                <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-400/20 rounded-full animate-bounce"></div>
                <div className="absolute -top-2 -right-6 w-6 h-6 bg-purple-400/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -bottom-4 -right-2 w-10 h-10 bg-pink-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
            </div>
        </div>
    );
};

export default AnalysisLoader;
