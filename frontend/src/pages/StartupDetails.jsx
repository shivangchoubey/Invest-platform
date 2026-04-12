import React from "react";
import { Link, useParams } from "react-router-dom";

const StartupDetails = () => {
  const { id } = useParams();

  // Mock data mirroring the design exactly
  const mockDetails = {
    titlePrefix: "Vera Green",
    titleSuffix: "Biotechnology",
    description:
      "Engineering the next generation of carbon-neutral construction materials using synthetic mycelium architecture. Vera Green is reshaping the urban landscape with regenerative biological manufacturing that turns cities into carbon sinks.",
    raised: "₹1.84 Cr",
    goal: "₹2.50 Cr",
    progress: ((1.84 / 2.5) * 100).toFixed(1), // ~73.6%
    daysRemaining: 24,
    investors: [
      {
        initials: "AL",
        name: "Artemis Ventures",
        type: "INSTITUTIONAL",
        amount: "₹5.0 Cr",
        date: "March 2024",
      },
      {
        initials: "SC",
        name: "Sarah Chen",
        type: "ANGEL INVESTOR",
        amount: "₹2.5 Cr",
        date: "April 2024",
      },
      {
        initials: "MK",
        name: "Marcus Kael",
        type: "STRATEGIC PARTNER",
        amount: "₹1.0 Cr",
        date: "May 2024",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-secondary pb-24">
      {/* Basic Navbar (Same aesthetic) */}
      <nav className="w-full px-8 py-5 flex items-center justify-between border-b border-gray-100 bg-white">
        <div className="flex items-center gap-12">
          <Link
            to="/home"
            className="text-xl font-bold text-primary tracking-tight"
          >
            Dhanex
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/home"
              className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition"
            >
              Startups
            </Link>
            <Link
              to="/dashboard"
              className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link
            to="/home"
            className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition"
          >
            Back
          </Link>
          <button className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition">
            Profile
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* LEFT COLUMN */}
          <div className="flex-1 lg:max-w-[800px]">
            {/* Header Content */}
            <div className="mb-4">
              <span className="inline-block bg-[#E5C158] text-[#5C4D04] text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider mb-6">
                FEATURED STARTUP
              </span>
              <h1 className="text-5xl font-extrabold tracking-tight mb-2 text-[#222222]">
                {mockDetails.titlePrefix} <br className="hidden md:block" />
                <span className="text-primary">{mockDetails.titleSuffix}</span>
              </h1>
              <p className="mt-6 text-[15px] font-medium text-gray-500 leading-relaxed max-w-2xl">
                {mockDetails.description}
              </p>
            </div>

            {/* Funding Progress Box */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] my-12">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                    Total Amount Raised
                  </p>
                  <p className="text-3xl font-extrabold text-primary">
                    {mockDetails.raised}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                    Funding Goal
                  </p>
                  <p className="text-2xl font-bold text-[#222]">
                    {mockDetails.goal}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden my-4 relative">
                <div
                  className="h-full bg-primary rounded-full absolute left-0 top-0"
                  style={{ width: `${mockDetails.progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-[13px] font-bold text-primary">
                  {mockDetails.progress}% Completed
                </span>
                <span className="text-[13px] font-bold text-gray-500">
                  {mockDetails.daysRemaining} Days Remaining
                </span>
              </div>
            </div>

            {/* Current Investors Section */}
            <div className="mb-14">
              <div className="flex items-center gap-2 mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <h3 className="text-xl font-bold text-[#222]">
                  Current Investors
                </h3>
              </div>

              <div className="bg-[#F8F9FA] rounded-3xl p-6 space-y-4 border border-gray-100/50">
                {mockDetails.investors.map((investor, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar Circle */}
                      <div className="w-12 h-12 rounded-full bg-[#E8F3EE] text-primary flex items-center justify-center font-bold text-sm">
                        {investor.initials}
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-[#222]">
                          {investor.name}
                        </p>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                          {investor.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[15px] font-extrabold text-[#222]">
                        {investor.amount}
                      </p>
                      <p className="text-[12px] font-semibold text-gray-400 mt-0.5">
                        {investor.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* The Opportunity */}
            <div>
              <h3 className="text-xl font-bold text-[#222] mb-6">
                The Opportunity
              </h3>
              <div className="space-y-6 text-[15px] font-medium text-gray-500 leading-relaxed text-justify">
                <p>
                  Vera Green has developed a proprietary biological synthesis
                  process that binds agricultural byproducts into structural
                  composites. Our <strong className="text-[#333]">MycoShell™</strong> technology offers compressive
                  strength comparable to concrete while maintaining the insulation
                  properties of high-end industrial foam.
                </p>
                <p>
                  Currently operating out of our pilot facility in Berlin, we
                  are raising funds to scale production to industrial levels and
                  fulfill existing letters of intent from three major European
                  developers. This bridge round will facilitate the automation
                  of our bioreactors and the certification of our first
                  load-bearing products.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col pt-4">
            
            {/* The Black Visual Image Block */}
            <div className="w-full bg-[#111] rounded-3xl overflow-hidden aspect-square shadow-2xl relative mb-6 border border-gray-200/20">
              {/* Fallback image if generator fails, we will ideally use the generated one and replace */}
              <img 
                src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800" 
                alt="Vera Green Render" 
                className="w-full h-full object-cover opacity-90 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-10 w-full">
              <button className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-[16px] hover:opacity-95 transition-opacity shadow-[0_8px_20px_rgba(31,122,99,0.2)]">
                Commit Funds
              </button>
              <button className="w-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition-colors hover:border-primary/30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                </svg>
              </button>
            </div>

            {/* Ledger Room Chat Interface */}
            <div className="bg-[#F6F7F9] rounded-3xl p-6 flex flex-col h-[400px] border border-gray-100 shadow-inner">
              
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-indigo-900 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                     {/* Abstract Avatar Graphic */}
                     <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                   </div>
                   <div>
                     <p className="text-[14px] font-bold text-[#222] leading-tight">Elena Rossi</p>
                     <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">Founder</p>
                   </div>
                </div>
                {/* Live Indicator */}
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Live</span>
                </div>
              </div>

              {/* Chat bubbles */}
              <div className="flex-1 flex flex-col gap-5 overflow-y-auto w-full no-scrollbar pr-2 mb-4">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[10px] font-semibold text-gray-400 ml-3">Elena Rossi</span>
                  <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm text-[13px] font-medium text-gray-600 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 max-w-[90%] leading-relaxed">
                    Welcome to our ledger room. I'm available for any specific questions regarding our patent portfolio.
                  </div>
                </div>

                <div className="flex justify-center my-4">
                  <span className="bg-[#E8F3EE] text-primary text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                    Encryption Active (End-to-End)
                  </span>
                </div>
              </div>

              {/* Input Area */}
              <div className="relative mt-auto">
                <input 
                  type="text" 
                  disabled
                  placeholder="Real-time chat will be enabled soon ..." 
                  className="w-full bg-white text-gray-400 text-[12px] font-semibold rounded-2xl px-5 py-4 border border-gray-200 outline-none pr-12 cursor-not-allowed"
                />
                <button disabled className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
              <p className="text-[9px] font-semibold text-center text-gray-400 uppercase tracking-widest mt-4">
                Investor verification required for active participation
              </p>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetails;
