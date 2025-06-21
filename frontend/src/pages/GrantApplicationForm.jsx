import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GrantApplicationForm = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [companyInfo, setCompanyInfo] = useState({
        companyName: '',
        industry: '',
        employeeCount: '',
        annualRevenue: '',
        website: '',
        address: '',
        phone: '',
        email: '',
        description: '',
        documents: []
    });
    const [followUpQuestions, setFollowUpQuestions] = useState([]);
    const [questionAnswers, setQuestionAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [canProceed, setCanProceed] = useState(false);

    // Grant Templates
    const grantTemplates = [
    {
        "id": 1,
        "title": "Industrial Research Assistance Program (IRAP)",
        "description": "Supports Canadian SMEs in research and development of innovative products, processes, or services",
        "icon": "🔬",
        "amount": "Up to $10 million",
        "duration": "Varies by project",
        "tags": ["R&D", "Innovation", "Technology"],
        "gradient": "from-blue-500 to-purple-600"
    },
    {
        "id": 2,
        "title": "Strategic Innovation Fund (SIF)",
        "description": "Provides large-scale funding for projects that drive innovation and economic growth in Canada’s industrial and technology sectors",
        "icon": "🚀",
        "amount": "Up to 50% of project costs",
        "duration": "Multi-year (typically 2–5 years)",
        "tags": ["Industrial", "Technology", "Growth"],
        "gradient": "from-green-500 to-teal-600"
    },
    {
        "id": 3,
        "title": "CanExport SMEs Program",
        "description": "Helps Canadian SMEs develop new export opportunities and enter international markets",
        "icon": "🌎",
        "amount": "Up to $50,000 per project",
        "duration": "Project-based (usually up to 1 year)",
        "tags": ["Export", "International", "Marketing"],
        "gradient": "from-blue-400 to-cyan-600"
    },
    {
        "id": 4,
        "title": "FedDev Ontario Funding",
        "description": "Supports innovation-driven businesses in Southern Ontario with repayable, interest-free contributions",
        "icon": "🏢",
        "amount": "$125,000 to $10 million",
        "duration": "Project-based (typically 1–3 years)",
        "tags": ["Ontario", "Innovation", "Expansion"],
        "gradient": "from-purple-500 to-indigo-600"
    },
    {
        "id": 5,
        "title": "Futurpreneur Canada Startup Program",
        "description": "Provides financing and mentorship to young entrepreneurs (18–39) launching new businesses",
        "icon": "💡",
        "amount": "Up to $60,000",
        "duration": "Up to 5 years (loan term)",
        "tags": ["Youth", "Mentorship", "Startup"],
        "gradient": "from-pink-500 to-red-600"
    }
    ];

    const createRipple = (event) => {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    };

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setCanProceed(true);
    };

    const handleCompanyInfoChange = (field, value) => {
        setCompanyInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileUpload = (files) => {
        setCompanyInfo(prev => ({
            ...prev,
            documents: [...prev.documents, ...Array.from(files)]
        }));
    };

    const removeDocument = (index) => {
        setCompanyInfo(prev => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index)
        }));
    };

    const submitCompanyInfo = async () => {
        setIsLoading(true);
        try {
            // Simulate API call to backend
            const response = await fetch('/api/validate-company-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    templateId: selectedTemplate.id,
                    companyInfo: companyInfo
                })
            });
            const data = await response.json();
            
            if (data.success && (!data.questions || data.questions.length === 0)) {
                // No questions - proceed to next step
                setCanProceed(true);
                setFollowUpQuestions([]);
                setCurrentStep(3);
            } else if (data.questions && data.questions.length > 0) {
                // Questions from API - show them
                setFollowUpQuestions(data.questions);
                setCanProceed(false);
                setCurrentStep(3);
            }
        } catch (error) {
            console.error('Error submitting company info:', error);
            // For demo purposes, simulate some follow-up questions
            setFollowUpQuestions([
                {
                    id: 1,
                    question: "What is your primary business objective for this grant?",
                    type: "textarea",
                    required: true
                },
                {
                    id: 2,
                    question: "How many years has your company been in operation?",
                    type: "select",
                    options: ["Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "More than 10 years"],
                    required: true
                },
                {
                    id: 3,
                    question: "What is your expected project timeline?",
                    type: "text",
                    required: true
                }
            ]);
            setCanProceed(false);
            setCurrentStep(3);
        }
        setIsLoading(false);
    };

    const handleQuestionAnswer = (questionId, answer) => {
        setQuestionAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const submitFollowUpAnswers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/submit-followup-answers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    templateId: selectedTemplate.id,
                    companyInfo: companyInfo,
                    answers: questionAnswers
                })
            });
            
            const data = await response.json();
            
            if (data.success && (!data.questions || data.questions.length === 0)) {
                // Success - enable next button
                setCanProceed(true);
                setFollowUpQuestions([]);
            } else if (data.questions && data.questions.length > 0) {
                // More questions - update the list
                setFollowUpQuestions(data.questions);
                setCanProceed(false);
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
            // For demo, assume success after answers
            setCanProceed(true);
            setFollowUpQuestions([]);
        }
        setIsLoading(false);
    };

    const nextStep = () => {
        if (currentStep === 1 && selectedTemplate) {
            setCurrentStep(2);
            setCanProceed(false);
        } else if (currentStep === 2) {
            submitCompanyInfo();
        } else if (currentStep === 3 && followUpQuestions.length > 0) {
            submitFollowUpAnswers();
        }
    }; const prevStep = () => {
        if (currentStep === 1) {
            // On step 1, go back to dashboard
            navigate('/');
        } else if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setCanProceed(currentStep === 2 ? !!selectedTemplate : true);
        }
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1: return 'Select Grant Template';
            case 2: return 'Company Information';
            case 3: return 'Additional Information';
            default: return 'Grant Application';
        }
    };

    const isCompanyInfoComplete = () => {
        const required = ['companyName', 'industry', 'email', 'description'];
        return required.every(field => companyInfo[field].trim() !== '');
    };

    const areQuestionsAnswered = () => {
        return followUpQuestions.every(q => 
            q.required ? questionAnswers[q.id]?.trim() : true
        );
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden">
            {/* Animated Background */}
            <div className="liquid-glass-bg fixed inset-0 pointer-events-none"></div>
            
            {/* Main Content */}
            <div className="liquid-glass-overlay relative z-10 w-full">
                {/* Header Navigation */}
                <header className="glass-nav sticky top-0 z-50 p-6">
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
                                <span className="text-2xl font-bold text-white">L</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gradient-purple font-display">
                                    LazyGrant
                                </h3>
                            </div>
                        </div>

                        {/* Progress Indicator */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                            step === currentStep 
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                                                : step < currentStep 
                                                    ? 'bg-green-500 text-white' 
                                                    : 'bg-gray-600 text-gray-300'
                                        }`}>
                                            {step < currentStep ? '✓' : step}
                                        </div>
                                        {step < 3 && (
                                            <div className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
                                                step < currentStep ? 'bg-green-500' : 'bg-gray-600'
                                            }`}></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Form Content */}
                <main className="w-full px-6 py-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Step Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gradient font-display mb-4">
                                {getStepTitle()}
                            </h2>
                            <p className="text-lg text-gray-300 font-body">
                                {currentStep === 1 && "Choose the perfect template for your grant application"}
                                {currentStep === 2 && "Tell us about your company and upload supporting documents"}
                                {currentStep === 3 && "Answer a few additional questions to complete your application"}
                            </p>
                        </div>

                        {/* Step 1: Template Selection */}
                        {currentStep === 1 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {grantTemplates.map((template) => (
                                    <div 
                                        key={template.id}
                                        className={`glass-card glass-hover p-6 rounded-xl cursor-pointer transition-all duration-300 will-change-transform ${
                                            selectedTemplate?.id === template.id 
                                                ? 'ring-2 ring-purple-500 scale-105' 
                                                : ''
                                        }`}
                                        onClick={() => handleTemplateSelect(template)}
                                    >
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-4xl">{template.icon}</span>
                                                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                    selectedTemplate?.id === template.id 
                                                        ? 'bg-purple-500 scale-150' 
                                                        : 'bg-gray-600'
                                                }`}></div>
                                            </div>
                                            
                                            <h3 className="text-xl font-bold text-white font-heading">{template.title}</h3>
                                            <p className="text-gray-300 text-sm leading-relaxed font-body">{template.description}</p>
                                            
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400 font-accent">Amount:</span>
                                                    <span className="text-white font-semibold font-accent">{template.amount}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400 font-accent">Duration:</span>
                                                    <span className="text-white font-accent">{template.duration}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2">
                                                {template.tags.map((tag, index) => (
                                                    <span key={index} className="px-2 py-1 bg-white/10 rounded-md text-xs text-gray-300 font-accent">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Step 2: Company Information */}
                        {currentStep === 2 && (
                            <div className="glass-card p-8 rounded-2xl max-w-4xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Company Details */}
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-white mb-4 font-heading">Company Details</h3>
                                        
                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-2 font-body">Company Name *</label>
                                            <input
                                                type="text"
                                                value={companyInfo.companyName}
                                                onChange={(e) => handleCompanyInfoChange('companyName', e.target.value)}
                                                className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none"
                                                placeholder="Enter your company name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-2 font-body">Industry *</label>
                                            <select
                                                value={companyInfo.industry}
                                                onChange={(e) => handleCompanyInfoChange('industry', e.target.value)}
                                                className="glass-input w-full px-4 py-3 rounded-lg text-white focus:outline-none"
                                            >
                                                <option value="">Select your industry</option>
                                                <option value="technology">Technology</option>
                                                <option value="healthcare">Healthcare</option>
                                                <option value="education">Education</option>
                                                <option value="environment">Environment</option>
                                                <option value="research">Research</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-2 font-body">Employee Count</label>
                                            <select
                                                value={companyInfo.employeeCount}
                                                onChange={(e) => handleCompanyInfoChange('employeeCount', e.target.value)}
                                                className="glass-input w-full px-4 py-3 rounded-lg text-white focus:outline-none"
                                            >
                                                <option value="">Select employee count</option>
                                                <option value="1-10">1-10 employees</option>
                                                <option value="11-50">11-50 employees</option>
                                                <option value="51-200">51-200 employees</option>
                                                <option value="201-1000">201-1000 employees</option>
                                                <option value="1000+">1000+ employees</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-2 font-body">Annual Revenue</label>
                                            <input
                                                type="text"
                                                value={companyInfo.annualRevenue}
                                                onChange={(e) => handleCompanyInfoChange('annualRevenue', e.target.value)}
                                                className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none"
                                                placeholder="e.g. $1,000,000"
                                            />
                                        </div>
                                    </div>

                                    {/* Contact & Additional Info */}
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-white mb-4 font-heading">Contact Information</h3>
                                        
                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-2 font-body">Email *</label>
                                            <input
                                                type="email"
                                                value={companyInfo.email}
                                                onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                                                className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none"
                                                placeholder="company@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-2 font-body">Website</label>
                                            <input
                                                type="url"
                                                value={companyInfo.website}
                                                onChange={(e) => handleCompanyInfoChange('website', e.target.value)}
                                                className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none"
                                                placeholder="https://example.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-2 font-body">Phone</label>
                                            <input
                                                type="tel"
                                                value={companyInfo.phone}
                                                onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                                                className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none"
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-2 font-body">Address</label>
                                            <textarea
                                                value={companyInfo.address}
                                                onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                                                className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none resize-none"
                                                rows="3"
                                                placeholder="Enter your company address"
                                            />
                                        </div>
                                    </div>

                                    {/* Company Description - Full Width */}
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-300 text-sm font-medium mb-2 font-body">Company Description *</label>
                                        <textarea
                                            value={companyInfo.description}
                                            onChange={(e) => handleCompanyInfoChange('description', e.target.value)}
                                            className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none resize-none"
                                            rows="4"
                                            placeholder="Describe your company, mission, and the project you're seeking funding for..."
                                        />
                                    </div>

                                    {/* File Upload */}
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-300 text-sm font-medium mb-2 font-body">Supporting Documents</label>
                                        <div className="glass-card p-6 rounded-lg border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors duration-300">
                                            <input
                                                type="file"
                                                multiple
                                                onChange={(e) => handleFileUpload(e.target.files)}
                                                className="hidden"
                                                id="file-upload"
                                                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                                            />
                                            <label htmlFor="file-upload" className="cursor-pointer block text-center">
                                                <div className="text-4xl mb-2">📁</div>
                                                <p className="text-gray-300 mb-2 font-body">Click to upload or drag and drop</p>
                                                <p className="text-gray-400 text-sm font-body">PDF, DOC, DOCX, TXT, JPG, PNG up to 10MB each</p>
                                            </label>
                                        </div>

                                        {/* Uploaded Files */}
                                        {companyInfo.documents.length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                {companyInfo.documents.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between glass-card p-3 rounded-lg">
                                                        <span className="text-gray-300 text-sm font-body">{file.name}</span>
                                                        <button
                                                            onClick={() => removeDocument(index)}
                                                            className="text-red-400 hover:text-red-300 transition-colors duration-300"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Follow-up Questions */}
                        {currentStep === 3 && (
                            <div className="glass-card p-8 rounded-2xl max-w-4xl mx-auto">
                                <h3 className="text-2xl font-bold text-white mb-6 font-heading">Additional Questions</h3>
                                
                                {followUpQuestions.length > 0 ? (
                                    <div className="space-y-6">
                                        {followUpQuestions.map((question) => (
                                            <div key={question.id}>
                                                <label className="block text-gray-300 text-sm font-medium mb-2 font-body">
                                                    {question.question} {question.required && '*'}
                                                </label>
                                                
                                                {question.type === 'textarea' ? (
                                                    <textarea
                                                        value={questionAnswers[question.id] || ''}
                                                        onChange={(e) => handleQuestionAnswer(question.id, e.target.value)}
                                                        className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none resize-none"
                                                        rows="4"
                                                        placeholder="Enter your answer..."
                                                    />
                                                ) : question.type === 'select' ? (
                                                    <select
                                                        value={questionAnswers[question.id] || ''}
                                                        onChange={(e) => handleQuestionAnswer(question.id, e.target.value)}
                                                        className="glass-input w-full px-4 py-3 rounded-lg text-white focus:outline-none"
                                                    >
                                                        <option value="">Select an option</option>
                                                        {question.options.map((option, index) => (
                                                            <option key={index} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={questionAnswers[question.id] || ''}
                                                        onChange={(e) => handleQuestionAnswer(question.id, e.target.value)}
                                                        className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none"
                                                        placeholder="Enter your answer..."
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">🎉</div>
                                        <h3 className="text-2xl font-bold text-white mb-4 font-heading">All Set!</h3>
                                        <p className="text-gray-300 font-body">Your application is complete and ready for submission.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-12 max-w-4xl mx-auto">
                            <button
                                onClick={(e) => {
                                    createRipple(e);
                                    prevStep();
                                }}
                                className={`glass-button ripple-effect px-6 py-3 rounded-xl font-medium transition-all duration-300 text-white hover:scale-105 font-body`}
                            >
                                <span className="flex items-center space-x-2">
                                    <span>←</span>
                                    <span>{currentStep === 1 ? 'Dashboard' : 'Back'}</span>
                                </span>
                            </button>

                            <button
                                onClick={(e) => {
                                    createRipple(e);
                                    nextStep();
                                }}
                                disabled={
                                    !canProceed || 
                                    isLoading ||
                                    (currentStep === 1 && !selectedTemplate) ||
                                    (currentStep === 2 && !isCompanyInfoComplete()) ||
                                    (currentStep === 3 && followUpQuestions.length > 0 && !areQuestionsAnswered())
                                }
                                className={`glass-button ripple-effect px-8 py-3 rounded-xl font-medium transition-all duration-300 font-body ${
                                    (!canProceed || 
                                     isLoading ||
                                     (currentStep === 1 && !selectedTemplate) ||
                                     (currentStep === 2 && !isCompanyInfoComplete()) ||
                                     (currentStep === 3 && followUpQuestions.length > 0 && !areQuestionsAnswered())
                                    )
                                        ? 'opacity-50 cursor-not-allowed' 
                                        : 'text-white hover:scale-105'
                                }`}
                            >
                                <span className="flex items-center space-x-2">
                                    {isLoading ? (
                                        <>
                                            <span className="animate-spin">⟳</span>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>
                                                {currentStep === 3 && followUpQuestions.length === 0 ? 'Submit Application' : 'Next'}
                                            </span>
                                            <span>→</span>
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default GrantApplicationForm;
