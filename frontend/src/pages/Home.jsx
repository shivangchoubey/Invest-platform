import React from "react";
import { Link, useNavigate } from "react-router-dom";

// Mock Data for the Startups Grid
const startups = [
  {
    id: 1,
    title: "Lumina Neural",
    description: "Pioneering ethical AI hardware designed for distributed processing in secure environments. Reducing energy consumption by 40%.",
    image: "/images/lumina.png",
    badge: "INVESTOR CHOICE",
    progress: 82,
    raised: "₹10.2 Cr",
    goal: "₹12.5 Cr",
    investors: 142
  },
  {
    id: 2,
    title: "VerdaGrid",
    description: "Intelligent micro-grid orchestration for rural communities. Empowering local economies with autonomous energy management.",
    image: "/images/verdagrid.png",
    badge: null,
    progress: 45,
    raised: "₹3.7 Cr",
    goal: "₹8.3 Cr",
    investors: 68
  },
  {
    id: 3,
    title: "BioScale Dynamics",
    description: "Developing programmable synthetic proteins for rapid vaccine deployment. Transforming pharmaceutical logistics globally.",
    image: "/images/bioscale.png",
    badge: null,
    progress: 94,
    raised: "₹19.5 Cr",
    goal: "₹20.8 Cr",
    investors: 211
  },
  {
    id: 4,
    title: "Atelier Flow",
    description: "A decentralized operating system for creative agencies, automating talent allocation and project treasury management.",
    image: "/images/atelier.png",
    badge: null,
    progress: 12,
    raised: "₹50 L",
    goal: "₹4.1 Cr",
    investors: 14
  },
  {
    id: 5,
    title: "Prism Layer",
    description: "Optical computing layers that process data using light refraction, bypassing traditional silicon limitations for massive gains.",
    image: "/images/prism.png",
    badge: null,
    progress: 61,
    raised: "₹38.2 Cr",
    goal: "₹62.3 Cr",
    investors: 89
  },
  {
    id: 6,
    title: "Orbit Insight",
    description: "Real-time geospatial analytics for environmental supply chains, providing transparency from source to consumer markets.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800", // Unsplash fallback due to quota limits
    badge: null,
    progress: 33,
    raised: "₹9.1 Cr",
    goal: "₹27.4 Cr",
    investors: 42
  }
];

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white font-sans text-secondary">
      {/* Navbar */}
      <nav className="w-full px-8 py-5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link to="/home" className="text-xl font-bold text-primary tracking-tight">
            Dhanex
          </Link>
          
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex flex-col items-center">
              <Link to="/home" className="text-sm font-bold text-primary">Startups</Link>
              <div className="h-0.5 w-full bg-primary mt-1 rounded-full"></div>
            </div>
            <Link to="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition">Dashboard</Link>
          </div>
        </div>

        {/* Right side nav */}
        <div className="flex items-center gap-6">
          <button onClick={handleLogout} className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition">
            Log Out
          </button>
          <button className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition">
            Profile
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-extrabold text-secondary tracking-tight leading-tight mb-4">
              Invest in the <span className="text-primary">Next <br/>Frontier</span>
            </h1>
            <p className="text-[15px] font-medium text-gray-500 leading-relaxed max-w-lg">
              A curated collection of high-potential ventures. Join a community of
              forward-thinking investors scaling the companies of tomorrow.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 bg-gray-50/50 p-1.5 rounded-full border border-gray-100">
            <span className="text-sm font-semibold text-gray-400 pl-4 pr-2">Sort by:</span>
            <button className="bg-white text-primary text-sm font-bold px-5 py-2 rounded-full shadow-sm border border-gray-100">
              Latest
            </button>
            <button className="text-gray-500 text-sm font-semibold px-4 py-2 rounded-full hover:text-gray-800 transition">
              Funding Progress
            </button>
          </div>
        </div>

        {/* Startups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {startups.map((startup) => (
            <div key={startup.id} className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              
              {/* Card Image area */}
              <div className="relative h-56 w-full">
                <img src={startup.image} alt={startup.title} className="w-full h-full object-cover" />
                
                {/* Optional Badge */}
                {startup.badge && (
                  <div className="absolute top-4 left-4 bg-[#FFC107] text-[#5C4D04] text-[10px] font-bold px-2.5 py-1 rounded shadow-sm">
                    {startup.badge}
                  </div>
                )}

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-5 pt-12">
                  <h3 className="text-white text-xl font-bold tracking-tight">{startup.title}</h3>
                </div>
              </div>

              {/* Card Content Area */}
              <div className="p-6">
                <p className="text-[13px] text-gray-500 font-medium mb-6 line-clamp-3 leading-relaxed">
                  {startup.description}
                </p>

                {/* Progress Bar Area */}
                <div className="mb-5">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xl font-bold text-primary">{startup.progress}%</span>
                    <span className="text-[12px] font-bold text-gray-400">
                      {startup.raised} <span className="font-medium text-gray-400">/ {startup.goal}</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000" 
                      style={{ width: `${startup.progress}%` }}
                    ></div>
                  </div>
                </div>

                <hr className="border-gray-100 my-4" />

                {/* Card Footer */}
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span className="text-[13px] font-bold text-gray-500">{startup.investors} Investors</span>
                  </div>
                  <button className="bg-primary text-white text-[13px] font-bold px-5 py-2 rounded-full hover:bg-opacity-90 transition shadow-sm">
                    Invest
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Pagination placeholder */}
        <div className="flex justify-center items-center mt-16 gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-black hover:bg-gray-50 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white font-bold text-xs shadow-sm">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 font-bold text-xs hover:bg-gray-50 transition">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 font-bold text-xs hover:bg-gray-50 transition">
            3
          </button>
          <span className="text-gray-400 text-xs font-bold mx-1">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 font-bold text-xs hover:bg-gray-50 transition">
            12
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-black hover:bg-gray-50 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

      </main>

    </div>
  );
};

export default Home;
