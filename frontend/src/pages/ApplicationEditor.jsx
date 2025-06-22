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

    // Load form data from AsyncStorage on component mount
    useEffect(() => {
        const loadFormData = async () => {
            try {
                const data = await CompanyStorageService.getAllFormData();
                setFormData(data);
                console.log('Form data loaded from AsyncStorage:', data);
            } catch (error) {
                console.error('Error loading form data:', error);
            } finally {
                setIsDataLoaded(true);
            }
        };

        loadFormData();
    }, []);

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
                backgroundColor: '#1a1a1a'
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            {/* Floating Navigation Bar */}
            <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
                <div className="glass-card px-6 py-3 rounded-full flex items-center space-x-6">
                    <button 
                        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors font-accent"
                        onClick={() => navigate('/')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Dashboard</span>
                    </button>
                    
                    <div className="h-4 w-px bg-gray-600"></div>
                    
                    <button 
                        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors font-accent"
                        onClick={() => navigate('/application-form')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit Form</span>
                    </button>
                    
                    <div className="h-4 w-px bg-gray-600"></div>
                    
                    <button 
                        className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 font-accent"
                        onClick={() => setShowPredictabilityModal(true)}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>Predictability</span>
                        <span className="text-green-400 font-bold">{predictabilityScore.score}%</span>
                    </button>
                    
                    <div className="relative">
                        <button 
                            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 font-accent"
                            onClick={() => setShowExportMenu(!showExportMenu)}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Export</span>
                        </button>
                        
                        {/* Export Menu */}
                        {showExportMenu && (
                            <div className="absolute top-full right-0 mt-2 glass-card rounded-lg overflow-hidden min-w-[200px]">
                                <button 
                                    onClick={exportToPDF}
                                    className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors text-gray-300 hover:text-white font-body flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <span>Export as PDF</span>
                                </button>
                                <button 
                                    onClick={copyToClipboard}
                                    className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors text-gray-300 hover:text-white font-body flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span>Copy to Clipboard</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4 font-display">
                            Application Editor & Review
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-body">
                            Review and refine your AI-generated grant application. Select any text to enhance it with AI assistance.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Rich Text Editor */}
                        <div className="glass-card p-8 rounded-2xl">
                            <div 
                                ref={editorRef}
                                className="prose prose-invert prose-purple max-w-none markdown-content text-gray-200 leading-relaxed font-body"
                                style={{ userSelect: 'text' }}
                            >
                                <ReactMarkdown
                                    components={{
                                        h1: ({...props}) => <h1 className="text-3xl font-bold text-white mb-6 font-display" {...props} />,
                                        h2: ({...props}) => <h2 className="text-2xl font-bold text-white mb-4 mt-8 font-heading" {...props} />,
                                        h3: ({...props}) => <h3 className="text-xl font-bold text-white mb-3 mt-6 font-heading" {...props} />,
                                        p: ({...props}) => <p className="text-gray-300 mb-4 leading-relaxed font-body" {...props} />,
                                        strong: ({...props}) => <strong className="text-white font-semibold" {...props} />,
                                        em: ({...props}) => <em className="text-gray-200 italic" {...props} />,
                                        ul: ({...props}) => <ul className="list-disc list-inside mb-4 text-gray-300 space-y-1 font-body" {...props} />,
                                        ol: ({...props}) => <ol className="list-decimal list-inside mb-4 text-gray-300 space-y-1 font-body" {...props} />,
                                        li: ({...props}) => <li className="text-gray-300 font-body" {...props} />,
                                        blockquote: ({...props}) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 mb-4 font-body" {...props} />,
                                        hr: ({...props}) => <hr className="border-gray-600 my-8" {...props} />,
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
                    className="fixed z-50 glass-card p-4 rounded-lg max-w-md"
                    style={{
                        left: `${selectionPosition.x}px`,
                        top: `${selectionPosition.y}px`,
                    }}
                >
                    <div className="space-y-3">
                        <h4 className="text-white font-semibold font-heading">Enhance with AI</h4>
                        <p className="text-gray-300 text-sm mb-3 font-body">Selected: "{selectedText.substring(0, 50)}..."</p>
                        <textarea
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder="How would you like to improve this text?"
                            className="w-full p-3 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 font-body"
                            rows={3}
                        />
                        <div className="flex space-x-2">
                            <button
                                onClick={handleAIEdit}
                                disabled={isProcessing || !editPrompt.trim()}
                                className="flex-1 glass-button px-4 py-2 rounded-lg font-accent disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing...' : 'Enhance'}
                            </button>
                            <button
                                onClick={() => setShowEditDialog(false)}
                                className="px-4 py-2 rounded-lg bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 transition-colors font-accent"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Predictability Score Modal */}
            {showPredictabilityModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="glass-card p-8 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white font-display">Predictability Analysis</h2>
                            <button 
                                onClick={() => setShowPredictabilityModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Overall Score */}
                            <div className="text-center">
                                <div className="text-6xl font-bold text-green-400 mb-2 font-display">{predictabilityScore.score}%</div>
                                <div className="text-gray-300 font-body">Overall Success Probability</div>
                            </div>

                            {/* Factors */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 font-heading">Key Factors</h3>
                                <div className="space-y-3">
                                    {predictabilityScore.factors.map((factor, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                                            <span className="text-gray-300 font-body">{factor.name}</span>
                                            <div className="flex items-center space-x-2">
                                                <span className={`font-bold ${factor.positive ? 'text-green-400' : 'text-yellow-400'} font-accent`}>
                                                    {factor.score}%
                                                </span>
                                                <div className={`w-2 h-2 rounded-full ${factor.positive ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Strengths */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 font-heading">Strengths</h3>
                                <ul className="space-y-2">
                                    {predictabilityScore.strengths.map((strength, index) => (
                                        <li key={index} className="flex items-start space-x-2 text-gray-300 font-body">
                                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Concerns */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 font-heading">Areas for Improvement</h3>
                                <ul className="space-y-2">
                                    {predictabilityScore.concerns.map((concern, index) => (
                                        <li key={index} className="flex items-start space-x-2 text-gray-300 font-body">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <span>{concern}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationEditor;
