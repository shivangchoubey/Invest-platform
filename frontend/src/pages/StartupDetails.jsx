import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { formatCurrency } from "../utils/formatters";

const StartupDetails = () => {
  const { id } = useParams();
  const [startupData, setStartupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditImageModalOpen, setIsEditImageModalOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [updatingImage, setUpdatingImage] = useState(false);
  const [updateImageError, setUpdateImageError] = useState(null);

  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [commitAmount, setCommitAmount] = useState("");
  const [committing, setCommitting] = useState(false);
  const [commitError, setCommitError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/startups/${id}`);
      setStartupData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !startupData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-red-500 font-bold text-xl">{error || "Startup not found"}</div>
      </div>
    );
  }

  const { startup, investors } = startupData;
  const titleParts = startup.title ? startup.title.split(" ") : ["Startup", ""];
  const titlePrefix = titleParts[0];
  const titleSuffix = titleParts.slice(1).join(" ");
  const progressPercent = Math.min(startup.fundingProgress || 0, 100);
  
  const isFounder = user && user.role === "FOUNDER" && startup.founder?._id === user._id;
  const isInvestor = user && user.role === "INVESTOR";

  const handleUpdateImage = async (e) => {
    e.preventDefault();
    setUpdatingImage(true);
    setUpdateImageError(null);
    try {
      await api.put(`/startups/${id}/image`, { image: newImageUrl });
      setStartupData(prev => ({
        ...prev,
        startup: { ...prev.startup, image: newImageUrl }
      }));
      setIsEditImageModalOpen(false);
      setNewImageUrl("");
    } catch (err) {
      setUpdateImageError(err.response?.data?.message || "Failed to update image");
    } finally {
      setUpdatingImage(false);
    }
  };

  const handleCommitFunds = async (e) => {
    e.preventDefault();
    setCommitting(true);
    setCommitError(null);
    try {
      await api.post("/invest", {
        startupId: id,
        amount: Number(commitAmount)
      });
      // Refresh the page data
      await fetchDetails();
      setIsCommitModalOpen(false);
      setCommitAmount("");
    } catch (err) {
      setCommitError(err.response?.data?.message || "Failed to commit funds");
    } finally {
      setCommitting(false);
    }
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
                {titlePrefix} <br className="hidden md:block" />
                <span className="text-primary">{titleSuffix}</span>
              </h1>
              <p className="mt-6 text-[15px] font-medium text-gray-500 leading-relaxed max-w-2xl">
                {startup.description}
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
                    {formatCurrency(startup.amountRaised)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                    Funding Goal
                  </p>
                  <p className="text-2xl font-bold text-[#222]">
                    {formatCurrency(startup.fundingGoal)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden my-4 relative">
                <div
                  className="h-full bg-primary rounded-full absolute left-0 top-0"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-[13px] font-bold text-primary">
                  {startup.fundingProgress || 0}% Completed
                </span>
                <span className="text-[13px] font-bold text-gray-500">
                  {/* Mock days remaining since backend doesnt have end date */}
                  24 Days Remaining
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
                {investors.length === 0 ? (
                  <p className="text-center text-gray-500 font-semibold py-4">No investors yet.</p>
                ) : investors.map((inv, idx) => {
                  const investorName = inv.investor ? inv.investor.name : "Anonymous";
                  const initials = investorName.substring(0, 2).toUpperCase();
                  const date = new Date(inv.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long' });

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar Circle */}
                        <div className="w-12 h-12 rounded-full bg-[#E8F3EE] text-primary flex items-center justify-center font-bold text-sm">
                          {initials}
                        </div>
                        <div>
                          <p className="text-[15px] font-bold text-[#222]">
                            {investorName}
                          </p>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                            INVESTOR
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[15px] font-extrabold text-[#222]">
                          {formatCurrency(inv.amount)}
                        </p>
                        <p className="text-[12px] font-semibold text-gray-400 mt-0.5">
                          {date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* The Opportunity */}
            <div>
              <h3 className="text-xl font-bold text-[#222] mb-6">
                The Opportunity
              </h3>
              <div className="space-y-6 text-[15px] font-medium text-gray-500 leading-relaxed text-justify whitespace-pre-wrap">
                {startup.opportunity || startup.description}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col pt-4">
            
            {/* The Black Visual Image Block */}
            <div className="w-full bg-[#111] rounded-3xl overflow-hidden aspect-square shadow-2xl relative mb-6 border border-gray-200/20 group">
              {/* Fallback image if generator fails, we will ideally use the generated one and replace */}
              <img 
                src={startup.image || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800"} 
                alt={startup.title || "Vera Green Render"} 
                className="w-full h-full object-cover opacity-90 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              {isFounder && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => {
                      setNewImageUrl(startup.image || "");
                      setIsEditImageModalOpen(true);
                    }}
                    className="bg-white/20 backdrop-blur-md text-white border border-white/40 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white/30 transition shadow-lg"
                  >
                    Edit Photo
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-10 w-full">
              {isInvestor ? (
                <button 
                  onClick={() => setIsCommitModalOpen(true)}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-[16px] hover:opacity-95 transition-opacity shadow-[0_8px_20px_rgba(31,122,99,0.2)]"
                >
                  Commit Funds
                </button>
              ) : (
                <button 
                  disabled
                  title="Only verified investors can commit funds"
                  className="flex-1 bg-gray-200 text-gray-400 py-4 rounded-2xl font-bold text-[16px] cursor-not-allowed"
                >
                  Commit Funds
                </button>
              )}
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
                     <p className="text-[14px] font-bold text-[#222] leading-tight">{startup.founder?.name || "Founder"}</p>
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
                  <span className="text-[10px] font-semibold text-gray-400 ml-3">{startup.founder?.name || "Founder"}</span>
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

      {/* Edit Image Modal */}
      {isEditImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden transform transition-all">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-secondary">Update Venture Photo</h2>
                <button 
                  onClick={() => setIsEditImageModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <form onSubmit={handleUpdateImage} className="space-y-5">
                {updateImageError && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {updateImageError}
                  </div>
                )}
                
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-semibold text-secondary mb-2">New Image URL</label>
                  <input
                    type="url"
                    id="imageUrl"
                    required
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditImageModalOpen(false)}
                    className="px-6 py-2.5 rounded-full text-sm font-bold text-gray-500 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingImage}
                    className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-primary hover:bg-primary/90 transition shadow disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {updatingImage ? "Updating..." : "Save Photo"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Commit Funds Modal */}
      {isCommitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden transform transition-all">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-secondary">Commit Funds</h2>
                <button 
                  onClick={() => setIsCommitModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <form onSubmit={handleCommitFunds} className="space-y-5">
                {commitError && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {commitError}
                  </div>
                )}
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-semibold text-secondary mb-2">Investment Amount (INR)</label>
                  <input
                    type="number"
                    id="amount"
                    required
                    min="1"
                    max={startup.fundingGoal - startup.amountRaised}
                    value={commitAmount}
                    onChange={(e) => setCommitAmount(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  />
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    Maximum remaining: {formatCurrency(startup.fundingGoal - startup.amountRaised)}
                  </p>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCommitModalOpen(false)}
                    className="px-6 py-2.5 rounded-full text-sm font-bold text-gray-500 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={committing || !commitAmount}
                    className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-primary hover:bg-primary/90 transition shadow disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {committing ? "Processing..." : "Confirm Investment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartupDetails;
