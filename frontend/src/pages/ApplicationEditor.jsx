import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import CompanyStorageService from '../services/CompanyStorageService';
import GrantGenerationService from '../services/GrantGenerationService';
import NavigationFixed from '../components/NavigationFixed';
import PredictabilityModal from '../components/PredictabilityModal';
import AIEditDialog from '../components/AIEditDialog';
import AnalysisLoader from '../components/AnalysisLoader';
import AIGenerationStatus from '../components/AIGenerationStatus';
import ExportNotification from '../components/ExportNotification';

const ApplicationEditor = () => {
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const [selectedText, setSelectedText] = useState('');
    const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 });
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showPredictabilityModal, setShowPredictabilityModal] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [editPrompt, setEditPrompt] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [showAnalysisLoader, setShowAnalysisLoader] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    
    // Export notification states
    const [showExportNotification, setShowExportNotification] = useState(false);
    const [exportNotification, setExportNotification] = useState({
        type: 'success',
        title: 'Export Successful',
        message: 'Your file has been exported successfully'
    });
    
    // AI Generation states (for future use)
    const [isGeneratingWithAI] = useState(false);
    const [generationProgress] = useState(0);
    const [generationStatus] = useState('');
    const [useAIGenerated] = useState(false);

    // Advanced data analysis simulation
    const startAnalysisSimulation = useCallback(async () => {
        for (let i = 0; i <= 100; i += 2) {
            await new Promise(resolve => setTimeout(resolve, 50));
            setAnalysisProgress(i);
        }

        setTimeout(() => {
            setShowAnalysisLoader(false);
            // Mark analysis as completed and store in localStorage
            try {
                localStorage.setItem('grant_analysis_completed', 'true');
            } catch (error) {
                console.error('Error saving analysis completion:', error);
            }
        }, 500);
    }, []);

    // Load form data from AsyncStorage on component mount
    useEffect(() => {
        const loadFormData = async () => {
            try {
                const data = await CompanyStorageService.getAllFormData();
                setFormData(data);
                console.log('Form data loaded from AsyncStorage:', data);
                
                // Check if we're coming from the application form (analysis not yet completed)
                const analysisCompleted = localStorage.getItem('grant_analysis_completed');
                const shouldRunAnalysis = !analysisCompleted && data && (data.companyInfo || data.selectedTemplate);
                
                if (shouldRunAnalysis) {
                    setTimeout(() => {
                        setShowAnalysisLoader(true);
                        startAnalysisSimulation();
                    }, 1000);
                }
            } catch (error) {
                console.error('Error loading form data:', error);
            }
        };

        loadFormData();
    }, [startAnalysisSimulation]);

    // Load saved analysis answers on component mount
    useEffect(() => {
        // No longer needed - refinement questions removed
    }, []);

    // Reset analysis completion (useful for testing or re-running analysis)
    // Expose to window for manual testing in console
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.resetAnalysisCompletion = () => {
                try {
                    localStorage.removeItem('grant_analysis_completed');
                    console.log('Analysis completion reset - refresh page to see analysis again');
                } catch (error) {
                    console.error('Error resetting analysis completion:', error);
                }
            };
        }
    }, []);

    // Simulate AI-generated markdown content based on form data from AsyncStorage
    // Load markdown content from lazygrant_application.md
    const [markdownContent, setMarkdownContent] = useState('Loading...');

    // Load markdown content from public folder
    useEffect(() => {
        const loadMarkdownContent = async () => {
            try {
                const response = await fetch('/lazygrant_application.md');
                if (response.ok) {
                    const content = await response.text();
                    setMarkdownContent(content);
                } else {
                    console.error('Failed to load markdown file');
                    setMarkdownContent('# Error\n\nFailed to load grant application content.');
                }
            } catch (error) {
                console.error('Error loading markdown file:', error);
                setMarkdownContent('# Error\n\nFailed to load grant application content.');
            }
        };

        loadMarkdownContent();
    }, []);

    // Simulated predictability score
    const predictabilityScore = {
        score: 78,
        description: "Your grant application shows strong potential for success based on our comprehensive analysis.",
        factors: [
            { name: 'Team Experience', score: 85, positive: true },
            { name: 'Market Opportunity', score: 92, positive: true },
            { name: 'Technical Feasibility', score: 75, positive: true },
            { name: 'Financial Planning', score: 70, positive: true },
            { name: 'Competition Risk', score: 60, positive: false },
            { name: 'Regulatory Challenges', score: 55, positive: false }
        ],
        strengths: [
            'Strong technical team with proven track record',
            'Clear market need and well-defined target audience',
            'Innovative approach with competitive advantages',
            'Comprehensive financial planning and risk management'
        ],
        improvements: [
            'Enhance competitive analysis section',
            'Add more detailed timeline milestones',
            'Strengthen risk mitigation strategies'
        ],
        concerns: [
            'Moderate competition in target market',
            'Potential regulatory hurdles may impact timeline',
            'Market adoption timeline may vary'
        ]
    };

    // Handle text selection for AI editing
    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            const rect = selection.getRangeAt(0).getBoundingClientRect();
            setSelectedText(selection.toString());
            setSelectionPosition({ 
                x: rect.left + window.scrollX, 
                y: rect.top + window.scrollY - 10 
            });
            setShowEditDialog(true);
        }
    };

    // Handle AI text editing
    const handleAIEdit = async () => {
        if (!editPrompt.trim()) return;
        
        setIsProcessing(true);
        
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simple text replacement with AI enhancement indicator
        const improvedText = `${selectedText} [AI Enhanced: ${editPrompt}]`;
        const newContent = markdownContent.replace(selectedText, improvedText);
        setMarkdownContent(newContent);
        
        setShowEditDialog(false);
        setEditPrompt('');
        setIsProcessing(false);
    };

    // Export to PDF
    const exportToPDF = async () => {
        const element = editorRef.current;
        if (!element) {
            showNotification('error', 'Export Failed', 'Unable to find content to export');
            return;
        }

        try {
            const result = await GrantGenerationService.saveAsFile(
                markdownContent,
                formData?.companyInfo?.companyName || 'GrantApplication',
                'pdf',
                element
            );

            if (result.success) {
                showNotification('success', 'PDF Export Successful', result.message);
            } else {
                showNotification('error', 'PDF Export Failed', result.message);
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            showNotification('error', 'PDF Export Failed', 'An error occurred while generating the PDF');
        }
        setShowExportMenu(false);
    };

    // Copy to clipboard
    const copyToClipboard = async () => {
        try {
            const result = await GrantGenerationService.copyToClipboard(markdownContent);
            
            if (result.success) {
                showNotification('success', 'Copied to Clipboard', result.message);
            } else {
                showNotification('error', 'Copy Failed', result.message);
            }
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            showNotification('error', 'Copy Failed', 'An error occurred while copying to clipboard');
        }
        setShowExportMenu(false);
    };

    // Save as TXT file
    const saveAsTXT = async () => {
        try {
            const result = await GrantGenerationService.saveAsFile(
                markdownContent,
                formData?.companyInfo?.companyName || 'GrantApplication',
                'txt'
            );

            if (result.success) {
                showNotification('success', 'TXT Export Successful', result.message);
            } else {
                showNotification('error', 'TXT Export Failed', result.message);
            }
        } catch (error) {
            console.error('Error saving TXT:', error);
            showNotification('error', 'TXT Export Failed', 'An error occurred while saving the text file');
        }
        setShowExportMenu(false);
    };

    // Helper function to show notifications
    const showNotification = (type, title, message) => {
        setExportNotification({ type, title, message });
        setShowExportNotification(true);
    };

    // Navigate back to edit company information (step 2)
    const editCompanyInfo = async () => {
        console.log('Edit button clicked - starting navigation to Company Info');
        
        try {
            // Set the current step to 2 (Company Information) before navigating
            const success = await CompanyStorageService.saveCurrentStep(2);
            console.log('Set current step to 2 for editing company information - Success:', success);
            
            // Clear analysis completion so it shows again when returning from form
            localStorage.removeItem('grant_analysis_completed');
            console.log('Cleared analysis completion for fresh analysis on return');
            
            console.log('Navigating to /application-form...');
            navigate('/application-form');
            
        } catch (error) {
            console.error('Error setting step for editing:', error);
            console.log('Attempting fallback navigation...');
            // Navigate anyway, form will handle step detection
            navigate('/application-form');
        }
    };

    // Set up text selection listener
    useEffect(() => {
        const handleMouseUp = handleTextSelection;
        document.addEventListener('mouseup', handleMouseUp);
        return () => document.removeEventListener('mouseup', handleMouseUp);
    }, [markdownContent]);

    return (
        <>
            {/* Custom Styles for Liquid Glass Animation and Inter Font */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                * {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                @keyframes liquidWave {
                    0%, 100% {
                        transform: translateX(-50%) translateY(-50%) rotate(0deg);
                        opacity: 0.3;
                    }
                    25% {
                        transform: translateX(-40%) translateY(-60%) rotate(90deg);
                        opacity: 0.5;
                    }
                    50% {
                        transform: translateX(-60%) translateY(-40%) rotate(180deg);
                        opacity: 0.4;
                    }
                    75% {
                        transform: translateX(-45%) translateY(-55%) rotate(270deg);
                        opacity: 0.6;
                    }
                }
            `}</style>
            
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
                <NavigationFixed 
                    navigate={navigate}
                    editCompanyInfo={editCompanyInfo}
                    predictabilityScore={predictabilityScore}
                    setShowPredictabilityModal={setShowPredictabilityModal}
                    showExportMenu={showExportMenu}
                    setShowExportMenu={setShowExportMenu}
                    exportToPDF={exportToPDF}
                    copyToClipboard={copyToClipboard}
                    saveAsTXT={saveAsTXT}
                />

                {/* Main Content */}
                <main className="pt-30 pb-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'}}>
                            Application Editor & Review
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto font-body">
                            Review and refine your AI-generated grant application. Select any text to enhance it with AI assistance.
                        </p>
                        
                        <AIGenerationStatus 
                            isGeneratingWithAI={isGeneratingWithAI}
                            useAIGenerated={useAIGenerated}
                            generationProgress={generationProgress}
                            generationStatus={generationStatus}
                        />
                    </div>

                    <div className="space-y-8">
                        {/* Rich Text Editor */}
                        <div className="bg-white border border-gray-200 shadow-lg p-8 rounded-2xl">
                            <div 
                                ref={editorRef}
                                className="prose prose-gray max-w-none markdown-content text-gray-800 leading-relaxed font-body"
                                style={{ userSelect: 'text' }}
                            >
                                <ReactMarkdown
                                    components={{
                                        h1: ({...props}) => <h1 className="text-3xl font-bold text-gray-900 mb-6" style={{fontFamily: 'Inter, sans-serif'}} {...props} />,
                                        h2: ({...props}) => <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8" style={{fontFamily: 'Inter, sans-serif'}} {...props} />,
                                        h3: ({...props}) => <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6" style={{fontFamily: 'Inter, sans-serif'}} {...props} />,
                                        h4: ({...props}) => <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-4" style={{fontFamily: 'Inter, sans-serif'}} {...props} />,
                                        p: ({...props}) => <p className="text-gray-700 mb-4 leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}} {...props} />,
                                        strong: ({...props}) => <strong className="text-gray-900 font-semibold" style={{fontFamily: 'Inter, sans-serif'}} {...props} />,
                                        em: ({...props}) => <em className="text-gray-800 italic" style={{fontFamily: 'Inter, sans-serif'}} {...props} />,
                                        ul: ({...props}) => <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1" style={{fontFamily: 'Inter, sans-serif'}} {...props} />,
                                        ol: ({...props}) => <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-1" style={{fontFamily: 'Inter, sans-serif'}} {...props} />,
                                        li: ({...props}) => <li className="text-gray-700" style={{fontFamily: 'Inter, sans-serif'}} {...props} />,
                                        blockquote: ({...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4" style={{fontFamily: 'Inter, sans-serif'}} {...props} />,
                                        hr: ({...props}) => <hr className="border-gray-300 my-8" {...props} />,
                                    }}
                                >
                                    {markdownContent}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* AI Text Edit Dialog */}
            <AIEditDialog 
                showDialog={showEditDialog}
                setShowDialog={setShowEditDialog}
                selectionPosition={selectionPosition}
                selectedText={selectedText}
                editPrompt={editPrompt}
                setEditPrompt={setEditPrompt}
                isProcessing={isProcessing}
                handleSubmitEdit={handleAIEdit}
            />

            <PredictabilityModal 
                showModal={showPredictabilityModal}
                setShowModal={setShowPredictabilityModal}
                predictabilityScore={predictabilityScore}
            />

            {/* Advanced Data Analysis Loader */}
            <AnalysisLoader 
                showLoader={showAnalysisLoader}
                analysisProgress={analysisProgress}
            />

            {/* Export Notification */}
            <ExportNotification
                isVisible={showExportNotification}
                onClose={() => setShowExportNotification(false)}
                type={exportNotification.type}
                title={exportNotification.title}
                message={exportNotification.message}
            />
            </div>
        </>
    );
};

export default ApplicationEditor;
