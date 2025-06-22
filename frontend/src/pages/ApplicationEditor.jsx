import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CompanyStorageService from '../services/CompanyStorageService';

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
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [showAnalysisLoader, setShowAnalysisLoader] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [showRefinementQuestions, setShowRefinementQuestions] = useState(false);
    const [analysisAnswers, setAnalysisAnswers] = useState({});

    // Load form data from AsyncStorage on component mount
    useEffect(() => {
        const loadFormData = async () => {
            try {
                const data = await CompanyStorageService.getAllFormData();
                setFormData(data);
                console.log('Form data loaded from AsyncStorage:', data);
                
                // Start advanced data analysis simulation
                if (data && (data.companyInfo || data.selectedTemplate)) {
                    setTimeout(() => {
                        setShowAnalysisLoader(true);
                        startAnalysisSimulation();
                    }, 1000);
                }
            } catch (error) {
                console.error('Error loading form data:', error);
            } finally {
                setIsDataLoaded(true);
            }
        };

        loadFormData();
    }, [startAnalysisSimulation]);

    // Advanced data analysis simulation
    const startAnalysisSimulation = useCallback(async () => {
        for (let i = 0; i <= 100; i += 2) {
            await new Promise(resolve => setTimeout(resolve, 50));
            setAnalysisProgress(i);
        }

        setTimeout(() => {
            setShowAnalysisLoader(false);
            setShowRefinementQuestions(true);
        }, 500);
    }, []);

    // Handle refinement question answers
    const handleRefinementAnswer = (questionId, answer) => {
        setAnalysisAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    // Close refinement questions
    const closeRefinementQuestions = () => {
        setShowRefinementQuestions(false);
    };

    // Simulate AI-generated markdown content based on form data from AsyncStorage
    const generateMarkdownContent = useCallback(() => {
        const { selectedTemplate, companyInfo } = formData || {};
        
        return `# Grant Application: ${selectedTemplate?.title || 'Industrial Research Assistance Program (IRAP)'}

## Executive Summary

**${companyInfo?.companyName || 'TechInnovate Solutions'}** is a forward-thinking technology company seeking funding through the ${selectedTemplate?.title || 'Industrial Research Assistance Program (IRAP)'} to advance our cutting-edge research and development initiatives.

${companyInfo?.description ? `

### Company Description

${companyInfo.description}

` : ''}

## Company Overview

### About Our Organization

**${companyInfo?.companyName || 'TechInnovate Solutions'}** has established itself as a leader in innovative solutions. Our dedicated team brings together diverse expertise in research, development, and commercialization.

**Key Metrics:**
- Company Name: ${companyInfo?.companyName || 'TechInnovate Solutions'}
- Employee Count: ${companyInfo?.employeeCount || 'Not specified'}
- Grant Amount Requested: ${companyInfo?.annualRevenue || 'To be determined'}
- Email: ${companyInfo?.email || 'Not provided'}

${companyInfo?.documents && companyInfo.documents.length > 0 ? `
### Supporting Documents

We have submitted ${companyInfo.documents.length} supporting document(s) as part of this application:
${companyInfo.documents.map((doc, index) => `${index + 1}. ${doc.name} (${doc.type})`).join('\n')}
` : ''}

## Project Description

### Overview

This project represents a significant advancement in our core technology platform, with the potential to revolutionize how businesses approach operational efficiency and sustainability. Our innovative solution addresses critical gaps in the current market while positioning our company for substantial growth.

### Technical Innovation

Our approach combines cutting-edge research methodologies with practical implementation strategies, ensuring that our developments translate into meaningful commercial applications.

**Key Innovation Areas:**
- Advanced computational algorithms
- Sustainable development practices  
- User experience optimization
- Scalable architecture design

### Market Opportunity

The addressable market for our solution is substantial, with projected growth opportunities. Our unique positioning and innovative approach provide significant competitive advantages.

## Budget and Timeline

### Financial Requirements

Our funding request of **${selectedTemplate?.amount || 'To be determined'}** will be allocated strategically across key project components to ensure maximum impact and return on investment.

**Budget Allocation:**
- Research & Development: 50%
- Personnel & Talent: 30%
- Equipment & Infrastructure: 15%
- Marketing & Commercialization: 5%

### Project Timeline

**Phase 1 (Months 1-6): Foundation**
- Establish research framework
- Assemble core team
- Begin technology development

**Phase 2 (Months 7-18): Development**
- Core technology implementation
- Prototype development and testing
- Market validation studies

**Phase 3 (Months 19-24): Launch**
- Product refinement and optimization
- Market launch and commercialization
- Scale operations

## Expected Outcomes

Upon successful completion, this project will deliver:
- Revolutionary technology platform
- Significant market penetration
- Job creation and economic growth
- Industry leadership position

## Conclusion

We respectfully request your support for this transformative initiative that will advance innovation, create economic value, and establish new industry standards.

---

*Application prepared by ${companyInfo?.companyName || 'TechInnovate Solutions'} | ${new Date().toLocaleDateString()}*`;
    }, [formData]);

    // Initialize markdown content from form data
    const [markdownContent, setMarkdownContent] = useState(() => {
        return isDataLoaded && formData ? generateMarkdownContent() : 'Loading...';
    });

    // Update markdown content when form data is loaded
    useEffect(() => {
        if (isDataLoaded && formData) {
            setMarkdownContent(generateMarkdownContent());
        }
    }, [isDataLoaded, formData, generateMarkdownContent]);

    // Simulated predictability score
    const predictabilityScore = {
        score: 78,
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
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 30;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save('grant-application.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
        setShowExportMenu(false);
    };

    // Copy to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(markdownContent);
        setShowExportMenu(false);
        // Could add toast notification here
    };

    // Set up text selection listener
    useEffect(() => {
        const handleMouseUp = handleTextSelection;
        document.addEventListener('mouseup', handleMouseUp);
        return () => document.removeEventListener('mouseup', handleMouseUp);
    }, [markdownContent]);

    return (
        <>
            {/* Custom Styles for Liquid Glass Animation */}
            <style jsx>{`
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
            {/* Floating Navigation Bar */}
            <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg px-6 py-3 rounded-full flex items-center space-x-6">
                    <button 
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors font-accent"
                        onClick={() => navigate('/')}
                    >
                        <svg className="w-5 h-5  text-gray-600 hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className='text-black'>Dashboard</span>
                    </button>
                    
                    <div className="h-4 w-px bg-gray-300"></div>
                    
                    <button 
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors font-accent"
                        onClick={() => navigate('/application-form')}
                    >
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className=' text-black'>Edit</span>
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

            {/* Main Content */}
            <main className="pt-30 pb-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-display">
                            Application Editor & Review
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto font-body">
                            Review and refine your AI-generated grant application. Select any text to enhance it with AI assistance.
                        </p>
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
                                        h1: ({...props}) => <h1 className="text-3xl font-bold text-gray-900 mb-6 font-display" {...props} />,
                                        h2: ({...props}) => <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8 font-heading" {...props} />,
                                        h3: ({...props}) => <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6 font-heading" {...props} />,
                                        p: ({...props}) => <p className="text-gray-700 mb-4 leading-relaxed font-body" {...props} />,
                                        strong: ({...props}) => <strong className="text-gray-900 font-semibold" {...props} />,
                                        em: ({...props}) => <em className="text-gray-800 italic" {...props} />,
                                        ul: ({...props}) => <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1 font-body" {...props} />,
                                        ol: ({...props}) => <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-1 font-body" {...props} />,
                                        li: ({...props}) => <li className="text-gray-700 font-body" {...props} />,
                                        blockquote: ({...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4 font-body" {...props} />,
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
            {showEditDialog && (
                <div 
                    className="fixed z-50 bg-white border border-gray-200 shadow-xl p-4 rounded-lg max-w-md"
                    style={{
                        left: `${selectionPosition.x}px`,
                        top: `${selectionPosition.y}px`,
                    }}
                >
                    <div className="space-y-3">
                        <h4 className="text-gray-900 font-semibold font-heading">Enhance with AI</h4>
                        <p className="text-gray-600 text-sm mb-3 font-body">Selected: "{selectedText.substring(0, 50)}..."</p>
                        <textarea
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder="How would you like to improve this text?"
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 font-body"
                            rows={3}
                        />
                        <div className="flex space-x-2">
                            <button
                                onClick={handleAIEdit}
                                disabled={isProcessing || !editPrompt.trim()}
                                className="flex-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-lg font-accent disabled:opacity-50 transition-colors"
                            >
                                <span className='text-black'>{isProcessing ? 'Processing...' : 'Enhance'}</span>
                            </button>
                            <button
                                onClick={() => setShowEditDialog(false)}
                                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-accent text-black"
                            >
                            <span className='text-black'>Cancel</span> 
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Predictability Score Modal */}
            {showPredictabilityModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-white border border-gray-200 shadow-xl p-8 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 font-display">Predictability Analysis</h2>
                            <button 
                                onClick={() => setShowPredictabilityModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6  text-gray-600 hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Overall Score */}
                            <div className="text-center">
                                <div className="text-6xl font-bold text-green-600 mb-2 font-display">{predictabilityScore.score}%</div>
                                <div className="text-gray-600 font-body">Overall Success Probability</div>
                            </div>

                            {/* Factors */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 font-heading">Key Factors</h3>
                                <div className="space-y-3">
                                    {predictabilityScore.factors.map((factor, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700 font-body">{factor.name}</span>
                                            <div className="flex items-center space-x-2">
                                                <span className={`font-bold ${factor.positive ? 'text-green-600' : 'text-amber-600'} font-accent`}>
                                                    {factor.score}%
                                                </span>
                                                <div className={`w-2 h-2 rounded-full ${factor.positive ? 'bg-green-600' : 'bg-amber-600'}`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Strengths */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 font-heading">Strengths</h3>
                                <ul className="space-y-2">
                                    {predictabilityScore.strengths.map((strength, index) => (
                                        <li key={index} className="flex items-start space-x-2 text-gray-700 font-body">
                                            <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Concerns */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 font-heading">Areas for Improvement</h3>
                                <ul className="space-y-2">
                                    {predictabilityScore.concerns.map((concern, index) => (
                                        <li key={index} className="flex items-start space-x-2 text-gray-700 font-body">
                                            <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                                            <span>{concern}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Advanced Data Analysis Loader */}
            {showAnalysisLoader && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="relative">
                        {/* Main Glass Panel */}
                        <div className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-12 max-w-md mx-auto text-center">
                            {/* Animated Background Elements */}
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

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="mb-6">
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                                        <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-gray-800 mb-3 font-display">
                                    Advanced Data Analysis
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 mb-6 font-body">
                                    Analyzing your application data using AI-powered insights to optimize your grant proposal.
                                </p>

                                {/* Progress Bar */}
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

                                {/* Analysis Tips */}
                                <div className="text-sm text-gray-500 space-y-2 font-body">
                                    <div className="animate-pulse">💡 Analyzing market trends and competitive landscape</div>
                                    <div className="animate-pulse" style={{ animationDelay: '1s' }}>🔍 Evaluating financial projections and risk factors</div>
                                    <div className="animate-pulse" style={{ animationDelay: '2s' }}>⚡ Generating personalized recommendations</div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-400/20 rounded-full animate-bounce"></div>
                        <div className="absolute -top-2 -right-6 w-6 h-6 bg-purple-400/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute -bottom-4 -right-2 w-10 h-10 bg-pink-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                    </div>
                </div>
            )}

            {/* Data Refinement Questions */}
            {showRefinementQuestions && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 font-display">Refine Your Analysis</h2>
                                    <p className="text-gray-600 mt-1 font-body">Help us provide more targeted insights for your grant application</p>
                                </div>
                                <button 
                                    onClick={closeRefinementQuestions}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100/50 rounded-lg"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Questions */}
                        <div className="p-6 space-y-6">
                            {/* Question 1 */}
                            <div className="space-y-3">
                                <label className="block text-gray-800 font-semibold font-body">
                                    What is your primary business focus for this grant?
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Technology Innovation', 'Market Expansion', 'Research & Development', 'Sustainability'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => handleRefinementAnswer('focus', option)}
                                            className={`p-3 rounded-lg border transition-all duration-200 font-body text-left ${
                                                analysisAnswers.focus === option
                                                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                                                    : 'bg-gray-50/50 border-gray-200 hover:bg-gray-100/50 text-gray-700'
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Question 2 */}
                            <div className="space-y-3">
                                <label className="block text-gray-800 font-semibold font-body">
                                    What is your expected timeline for project completion?
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['6-12 months', '1-2 years', '2+ years'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => handleRefinementAnswer('timeline', option)}
                                            className={`p-3 rounded-lg border transition-all duration-200 font-body text-center ${
                                                analysisAnswers.timeline === option
                                                    ? 'bg-green-50 border-green-200 text-green-800'
                                                    : 'bg-gray-50/50 border-gray-200 hover:bg-gray-100/50 text-gray-700'
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Question 3 */}
                            <div className="space-y-3">
                                <label className="block text-gray-800 font-semibold font-body">
                                    Which aspect would you like us to emphasize in your application?
                                </label>
                                <textarea
                                    placeholder="e.g., Innovation potential, job creation, environmental impact..."
                                    className="w-full p-3 rounded-lg bg-gray-50/50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 font-body resize-none"
                                    rows={3}
                                    value={analysisAnswers.emphasis || ''}
                                    onChange={(e) => handleRefinementAnswer('emphasis', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200/50 flex justify-end space-x-3">
                            <button
                                onClick={closeRefinementQuestions}
                                className="px-6 py-2 rounded-lg bg-gray-100/50 hover:bg-gray-200/50 text-gray-700 transition-colors font-accent"
                            >
                                Skip for Now
                            </button>
                            <button
                                onClick={closeRefinementQuestions}
                                className="px-6 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 transition-colors font-accent"
                            >
                                Apply Insights
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </>
    );
};

export default ApplicationEditor;
