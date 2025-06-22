import React from 'react';

const AIGenerationStatus = ({ isGeneratingWithAI, useAIGenerated, generationProgress, generationStatus }) => {
    if (!isGeneratingWithAI && !useAIGenerated) return null;

    return (
        <div className="mt-4 max-w-2xl mx-auto">
            {isGeneratingWithAI ? (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                        <div className="flex-1">
                            <p className="text-purple-800 font-medium text-sm">
                                {generationStatus || 'Generating with AI...'}
                            </p>
                            <div className="mt-2 bg-purple-200 rounded-full h-2">
                                <div 
                                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${generationProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : useAIGenerated && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-green-800 font-medium text-sm">
                            ✨ Grant application generated with AI using your company data
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIGenerationStatus;
