import React, { useState, useEffect, useRef } from 'react';


const mockProjects = [
    {
        id: 1,
        name: "AI-Powered Healthcare Platform",
        lastEdited: "2025-06-20",
        status: "In Progress",
        summary: "Developing an intelligent healthcare management system using machine learning to predict patient outcomes and optimize treatment plans.",
        progress: 65,
        type: "Healthcare Tech",
        priority: "High"
    },
    {
        id: 2,
        name: "Sustainable Energy Grid",
        lastEdited: "2025-06-19",
        status: "Under Review",
        summary: "Smart grid infrastructure project focusing on renewable energy integration and automated power distribution optimization.",
        progress: 90,
        type: "CleanTech",
        priority: "Medium"
    },
    {
        id: 3,
        name: "Quantum Computing Framework",
        lastEdited: "2025-06-18",
        status: "Completed",
        summary: "Open-source quantum computing development framework designed to accelerate quantum algorithm research and implementation.",
        progress: 100,
        type: "Quantum Tech",
        priority: "High"
    },
    {
        id: 4,
        name: "Urban Mobility Analytics",
        lastEdited: "2025-06-17",
        status: "Draft",
        summary: "Real-time urban transportation analysis platform using IoT sensors and predictive modeling for traffic optimization.",
        progress: 25,
        type: "Smart Cities",
        priority: "Low"
    }
];

// Ripple Effect Hook
const useRipple = () => {
    const [ripples, setRipples] = useState([]);

    const addRipple = (event) => {
        const rippleContainer = event.currentTarget.getBoundingClientRect();
        const size = rippleContainer.width > rippleContainer.height ? rippleContainer.width : rippleContainer.height;
        const x = event.clientX - rippleContainer.x - size / 2;
        const y = event.clientY - rippleContainer.y - size / 2;
        const newRipple = {
            x,
            y,
            size,
            id: Date.now()
        };

        setRipples(prev => [...prev, newRipple]);

        setTimeout(() => {
            setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
        }, 600);
    };

    return { ripples, addRipple };
};

const StatusBadge = ({ status, progress, priority }) => {
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Completed':
                return 'glass-effect border-green-500/30 text-green-400 bg-green-500/10';
            case 'In Progress':
                return 'glass-effect border-blue-500/30 text-blue-400 bg-blue-500/10';
            case 'Under Review':
                return 'glass-effect border-yellow-500/30 text-yellow-400 bg-yellow-500/10';
            case 'Draft':
                return 'glass-effect border-gray-500/30 text-gray-400 bg-gray-500/10';
            default:
                return 'glass-effect border-gray-500/30 text-gray-400 bg-gray-500/10';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'from-red-500 to-orange-500';
            case 'Medium': return 'from-yellow-500 to-blue-500';
            case 'Low': return 'from-green-500 to-teal-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyles(status)} 
                        backdrop-blur-sm transition-all duration-300`}>
                {status}
            </span>
            <div className="flex items-center gap-2">
                <div className="w-20 h-2 glass-effect rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${getPriorityColor(priority)} transition-all duration-700 ease-out`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="text-xs text-gray-400 font-mono min-w-[2.5rem]">{progress}%</span>
            </div>
        </div>
    );
};

const ProjectCard = ({ project, index }) => {
    const { ripples, addRipple } = useRipple();
    const cardRef = useRef(null);

    return (
        <div
            ref={cardRef}
            className={`group liquid-glass-bg glass-card rounded-2xl p-6 glass-hover will-change-transform
                    animate-scale-in transition-all duration-500 relative overflow-hidden
                    stagger-${(index % 6) + 1}`}

            onClick={addRipple}
        >
            {/* Liquid Glass Background */}
            <div className="liquid-glass-overlay">
                {/* Animated Status Indicator */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white group-hover:text-gradient transition-all duration-300">
                                {project.name}
                            </h3>
                            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${project.status === 'Completed' ? 'bg-green-400 animate-pulse' :
                                project.status === 'In Progress' ? 'bg-blue-400 animate-pulse' :
                                    project.status === 'Under Review' ? 'bg-yellow-400 animate-pulse' :
                                        'bg-gray-400'
                                }`} />
                        </div>
                        <p className="text-xs text-gray-400 font-mono flex items-center gap-2">
                            <span className="px-2 py-1 glass-effect rounded text-xs">{project.type}</span>
                            <span>•</span>
                            <span>Edited {new Date(project.lastEdited).toLocaleDateString()}</span>
                        </p>
                    </div>

                    <div className="ml-4 glass-effect p-2 rounded-lg">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                </div>

                {/* Summary with Glass Effect */}
                <div className="glass-effect rounded-xl p-4 mb-4 border border-white/5">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        {project.summary}
                    </p>
                </div>

                {/* Status and Progress */}
                <div className="mb-6">
                    <StatusBadge status={project.status} progress={project.progress} priority={project.priority} />
                </div>

                {/* Actions with Glass Buttons */}
                <div className="flex items-center gap-3">
                    <button className="flex-1 glass-button py-3 px-4 text-sm font-medium rounded-xl text-white
                                    hover:scale-105 active:scale-95 transition-all duration-300 ripple-effect"
                        onClick={addRipple}>
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            Continue
                        </span>
                    </button>
                    <button className="glass-effect p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group/btn">
                        <svg className="w-4 h-4 text-gray-400 group-hover/btn:text-white transition-colors"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Ripple Effects */}
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="ripple"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: ripple.size,
                        height: ripple.size,
                    }}
                />
            ))}
        </div>
    );
};

const LiquidGlassSearchBar = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-in-right">
            <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="search"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 glass-input rounded-2xl text-white placeholder-gray-400 
                            focus:outline-none transition-all duration-300"
                />
            </div>
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-6 py-4 glass-input rounded-2xl text-white cursor-pointer focus:outline-none 
                        transition-all duration-300 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDE0IDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNyA3TDEzIDEiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-no-repeat bg-right-4 bg-center pr-12"
            >
                <option value="">All Status</option>
                <option value="In Progress">In Progress</option>
                <option value="Under Review">Under Review</option>
                <option value="Completed">Completed</option>
                <option value="Draft">Draft</option>
            </select>
        </div>
    );
};

const LiquidGlassStatsCard = ({ icon, label, value, trend, color = "blue" }) => {
    const colorClasses = {
        blue: "from-blue-500/20 to-purple-500/20 border-blue-500/30",
        green: "from-green-500/20 to-teal-500/20 border-green-500/30",
        yellow: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
        purple: "from-purple-500/20 to-pink-500/20 border-purple-500/30"
    };

    return (
        <div className={`glass-effect rounded-2xl p-6 hover:scale-105 transition-all duration-300 
                        animate-scale-in liquid-glass-bg bg-gradient-to-br ${colorClasses[color]}`}>
            <div className="liquid-glass-overlay">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm font-medium">{label}</p>
                        <p className="text-3xl font-bold text-white mt-2 font-mono">{value}</p>
                    </div>
                    <div className="glass-effect p-3 rounded-xl text-white">
                        {icon}
                    </div>
                </div>
                {trend && (
                    <div className="flex items-center mt-4 text-sm">
                        <div className="flex items-center gap-1 glass-effect px-2 py-1 rounded-lg">
                            <span className="text-green-400">↗</span>
                            <span className="text-green-400 font-medium">{trend}</span>
                        </div>
                        <span className="text-gray-500 ml-2">vs last month</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Dashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filteredProjects, setFilteredProjects] = useState(mockProjects);
    const [user] = useState({ name: 'Alex Chen', avatar: '👨‍💻' });
    const { ripples: headerRipples, addRipple: addHeaderRipple } = useRipple();

    useEffect(() => {
        let filtered = mockProjects;

        if (searchTerm) {
            filtered = filtered.filter(project =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.type.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus) {
            filtered = filtered.filter(project => project.status === filterStatus);
        }

        setFilteredProjects(filtered);
    }, [searchTerm, filterStatus]);

    return (
        <div className="min-h-screen liquid-glass-bg">
            {/* Liquid Glass Header */}
            <header className="glass-nav sticky top-0 z-50 liquid-glass-bg">
                <div className="liquid-glass-overlay">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 animate-slide-in-left">
                                <h1 className="text-3xl font-bold text-gradient">
                                    LazyGrant
                                </h1>
                                <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-gray-600 to-transparent" />
                                <span className="hidden sm:inline text-gray-400 text-sm font-mono glass-effect px-3 py-1 rounded-lg">
                                    Dashboard
                                </span>
                            </div>

                            <div className="flex items-center gap-4 animate-slide-in-right">
                                <div className="hidden md:flex items-center gap-4 glass-effect px-4 py-2 rounded-xl">
                                    <span className="text-gray-400 text-sm">Welcome back,</span>
                                    <span className="text-white font-medium">{user.name}</span>
                                    <span className="text-xl">{user.avatar}</span>
                                </div>
                                <button className="glass-button p-3 rounded-xl hover:scale-110 transition-all duration-300"
                                    onClick={addHeaderRipple}>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>

                                {/* Header Ripples */}
                                {headerRipples.map((ripple) => (
                                    <span
                                        key={ripple.id}
                                        className="ripple"
                                        style={{
                                            left: ripple.x,
                                            top: ripple.y,
                                            width: ripple.size,
                                            height: ripple.size,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8 liquid-glass-overlay">
                {/* Liquid Glass Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <LiquidGlassStatsCard
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>}
                        label="Total Projects"
                        value="12"
                        trend="+3"
                        color="blue"
                    />
                    <LiquidGlassStatsCard
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>}
                        label="Success Rate"
                        value="87%"
                        trend="+12%"
                        color="green"
                    />
                    <LiquidGlassStatsCard
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>}
                        label="Funding Secured"
                        value="$2.3M"
                        trend="+$450K"
                        color="yellow"
                    />
                    <LiquidGlassStatsCard
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>}
                        label="Avg. Time Saved"
                        value="15hrs"
                        trend="+2hrs"
                        color="purple"
                    />
                </div>

                {/* Action Section with Liquid Glass CTA */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
                    <div className="animate-slide-in-left">
                        <h2 className="text-2xl font-semibold text-white mb-2">Your Projects</h2>
                        <p className="text-gray-400">Manage and track your grant applications with AI assistance</p>
                    </div>

                    <button className="glass-button px-8 py-4 rounded-2xl font-medium text-lg
                                    animate-glow-pulse hover:scale-110 active:scale-95 
                                    transition-all duration-500 animate-slide-in-right
                                    flex items-center gap-3 will-change-transform group ripple-effect"
                        onClick={addHeaderRipple}>
                        <div className="glass-effect p-2 rounded-xl group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <span className="text-gradient font-semibold">Start New Application</span>
                    </button>
                </div>

                {/* Liquid Glass Search and Filter */}
                <LiquidGlassSearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                />

                {/* Projects Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 glass-scrollbar">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16 animate-scale-in">
                            <div className="glass-effect rounded-3xl p-12 max-w-md mx-auto">
                                <div className="text-gray-500 mb-6">
                                    <svg className="w-20 h-20 mx-auto mb-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-gray-300 mb-3">No projects found</h3>
                                <p className="text-gray-500 mb-8">Try adjusting your search or filter criteria</p>
                                <button className="glass-button px-6 py-3 rounded-xl">
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

