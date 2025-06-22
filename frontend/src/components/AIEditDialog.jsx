import React from 'react';

const AIEditDialog = ({ 
    showDialog, 
    setShowDialog, 
    selectionPosition, 
    selectedText, 
    editPrompt, 
    setEditPrompt, 
    isProcessing, 
    handleSubmitEdit 
}) => {
    if (!showDialog) return null;

    return (
        <div 
            className="fixed bg-white border-2 border-blue-300 shadow-xl rounded-lg p-4 z-50 min-w-[400px] max-w-md"
            style={{
                left: `${selectionPosition.x}px`,
                top: `${selectionPosition.y}px`,
                transform: 'translate(-50%, -110%)'
            }}
        >
            <div className="mb-3">
                <h3 className="font-semibold mb-2 text-black">Enhance Selected Text</h3>
                <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3">
                    <p className="text-sm text-black italic">"{selectedText}"</p>
                </div>
            </div>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">
                    How would you like to improve this text?
                </label>
                <textarea
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="e.g., make it more professional, add specific details, expand the explanation..."
                    className="w-full border border-gray-300 rounded p-2 text-sm resize-none text-black"
                    rows="3"
                    disabled={isProcessing}
                />
            </div>
            
            <div className="flex space-x-2">
                <button
                    onClick={handleSubmitEdit}
                    disabled={isProcessing || !editPrompt.trim()}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 disabled:bg-gray-400 text-black px-3 py-2 rounded text-sm font-medium transition-colors"
                >
                    {isProcessing ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                            <span>Processing...</span>
                        </div>
                    ) : (
                        'Enhance Text'
                    )}
                </button>
                <button
                    onClick={() => setShowDialog(false)}
                    disabled={isProcessing}
                    className="px-3 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors text-black"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AIEditDialog;
