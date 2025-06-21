import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LiquidGlassDashboard = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Mock data for demonstration
    const stats = [
        { label: 'Total Applications', value: '12', icon: '📊', change: '+3 this month' },
        { label: 'In Progress', value: '5', icon: '⏳', change: '2 drafts' },
        { label: 'Submitted', value: '4', icon: '✅', change: 'Awaiting review' },
        { label: 'Success Rate', value: '75%', icon: '🎯', change: '+5% this quarter' }
    ];

    const projects = [
        {
            id: 1,
            title: 'AI Research Grant',
            status: 'In Progress',
            progress: 65,
            deadline: '2024-03-15',
            amount: '$75,000',
            category: 'Research',
            summary: 'Developing advanced machine learning algorithms for healthcare applications',
            tags: ['AI', 'Healthcare', 'Research']
        },
        {
            id: 2,
            title: 'Sustainable Tech Initiative',
            status: 'Draft',
            progress: 25,
            deadline: '2024-04-01',
            amount: '$150,000',
            category: 'Environment',
            summary: 'Creating eco-friendly technology solutions for renewable energy',
            tags: ['Sustainability', 'Clean Tech', 'Innovation']
        },
        {
            id: 3,
            title: 'Education Platform Development',
            status: 'Submitted',
            progress: 50,
            deadline: '2024-02-28',
            amount: '$50,000',
            category: 'Education',
            summary: 'Building an accessible online learning platform for underserved communities',
            tags: ['Education', 'Accessibility', 'Community']
        },
    ];

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.summary.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = selectedFilter === 'all' || project.status.toLowerCase() === selectedFilter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'in progress': return 'border-blue-400/50 bg-blue-500/10';
            case 'draft': return 'border-yellow-400/50 bg-yellow-500/10';
            case 'submitted': return 'border-green-400/50 bg-green-500/10';
            case 'in review': return 'border-purple-400/50 bg-purple-500/10';
            default: return 'border-gray-400/50 bg-gray-500/10';
        }
    };

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

    return (
        <div className="min-h-screen w-full relative overflow-hidden">
            {/* Main Content */}
            <div className="liquid-glass-overlay relative z-10 w-full">
                {/* Header Navigation - removed glass-nav class which might have had a border */}
                <header className="sticky top-0 z-50 p-5 bg-transparent">
                    <div className="w-full flex items-center justify-between">
                        <div
                            className="flex items-center space-x-4 cursor-pointer"
                            onClick={() => navigate('/')}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter') navigate('/'); }}
                            >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
                                <span className="text-2xl font-bold text-white">L</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gradient-purple font-display">
                                LazyGrant
                                </h3>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">

                            {/* User Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <span className="text-sm font-bold text-white">NP</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="w-full px-6 py-8 space-y-8">
                                        <section className="text-center py-16">
                                            <div className="max-w-4xl mx-auto">
                                                <h4 className="text-4xl text-gray-300 mb-4 font-light font-accent italic">
                                                    "The laziest way to win grants"
                                                </h4>
                                                <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-body">
                                                    Why stress over grant applications? Let our intelligent platform do the heavy lifting while you focus on what matters most — <span className='text-white'>your brilliant ideas.</span>
                                                </p>

                                                <button
                                                    className="glass-button ripple-effect px-10 py-5 rounded-2xl text-xl font-semibold text-white transform hover:scale-105 transition-all duration-300 shadow-2xl font-body"
                                                    onClick={(e) => {
                                    createRipple(e);
                                    navigate('/application-form');
                                }}
                            >
                                <span className="flex items-center space-x-3">
                                    <span className="text-xl">🚀</span>
                                    <p className='font-bold text-2xl sm:text-4xl md:text-2xl lg:text-2xl font-heading' style={{fontSize: "1.25rem"}}>Start Grant Application</p>
                                    <span className="text-xl">✨</span>
                                </span>
                            </button>
                        </div>
                    </section>

                    {/* Stats Cards */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="glass-card glass-hover p-6 rounded-xl will-change-transform"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-3xl">{stat.icon}</span>
                                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                                </div>
                                <h3 className="text-gray-300 font-medium mb-1">{stat.label}</h3>
                                <p className="text-sm text-gray-400 font-body">{stat.change}</p>
                            </div>
                        ))}
                    </section>

                    {/* Search and Filter Bar */}
                    <section className="glass-card p-6 rounded-xl">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="flex-1 w-full lg:max-w-md">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search applications..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="glass-input w-full px-4 py-3 pl-12 rounded-lg text-white placeholder-gray-400 focus:outline-none"
                                    />
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        🔍
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {['All', 'Draft', 'In Progress', 'Submitted', 'In Review'].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setSelectedFilter(filter.toLowerCase())}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${selectedFilter === filter.toLowerCase()
                                            ? 'glass-button text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Projects Grid */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="glass-card glass-hover p-6 rounded-xl will-change-transform">
                                <div className="space-y-4">
                                    {/* Project Header */}
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-xl font-bold text-white line-clamp-2 font-heading">{project.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border font-ui ${getStatusColor(project.status)}`}>
                                            {project.status}
                                        </span>
                                    </div>

                                    {/* Project Summary */}
                                    <p className="text-gray-300 text-sm line-clamp-3 font-body">{project.summary}</p>

                                    {/* Project Details */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400 font-ui">Amount:</span>
                                            <span className="text-white font-semibold font-ui">{project.amount}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400 font-ui">Deadline:</span>
                                            <span className="text-white font-ui">{project.deadline}</span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400 font-ui">Progress:</span>
                                                <span className="text-white font-ui">{project.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700/50 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${project.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="px-2 py-1 bg-white/10 rounded-md text-xs text-gray-300 font-ui"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        className="glass-button ripple-effect w-full py-3 rounded-lg font-medium text-white transform hover:scale-[1.02] transition-all duration-300 font-ui"
                                        onClick={createRipple}
                                    >
                                        Continue Application
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>
                </main>

                {/* Footer */}
                <footer className="glass-card mt-16 mx-6 mb-6 p-8 rounded-2xl">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Brand Section */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center">
                                        <span className="text-xl font-bold text-white">L</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gradient-purple font-display">
                                        LazyGrant
                                    </h3>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed font-body">
                                    Making grant applications effortless with AI-powered assistance and intelligent automation.
                                </p>
                            </div>

                            {/* Contact */}
                            <div className="flex flex-col items-start justify-start space-y-4 text-left">
                            <h4 className="text-white font-semibold font-heading">Get in Touch</h4>
                            <div className="flex flex-col space-y-3">
                                <div className="flex items-start space-x-2 text-sm text-gray-400">
                                <span className="text-lg leading-none">📍</span>
                                <span className="leading-snug">San Francisco, CA</span>
                                </div>
                                <div className="flex items-start space-x-2 text-sm text-gray-400">
                                <span className="text-lg leading-none">📞</span>
                                <span className="leading-snug">+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-start space-x-2 text-sm text-gray-400">
                                <span className="text-lg leading-none">✉️</span>
                                <span className="leading-snug">hello@lazygrant.com</span>
                                </div>
                            </div>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="border-t border-gray-700/50 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <p className="text-gray-400 text-sm font-accent italic">
                                © 2025 LazyGrant. All rights reserved. Making grants lazy since 2025.
                            </p>
                            <div className="flex space-x-6 text-sm text-gray-400">
                                <a href="#" className="hover:text-white transition-colors duration-300 font-body">Privacy Policy</a>
                                <a href="#" className="hover:text-white transition-colors duration-300 font-body">Terms of Service</a>
                                <a href="#" className="hover:text-white transition-colors duration-300 font-body">Cookie Policy</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LiquidGlassDashboard;
