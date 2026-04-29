import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { formatCurrency } from "../utils/formatters";

const InvestorDashboard = ({ user }) => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyInvestments = async () => {
      try {
        const res = await api.get("/invest/my");
        setInvestments(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch investments");
      } finally {
        setLoading(false);
      }
    };

    fetchMyInvestments();
  }, []);

  const totalCommitted = investments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const holdings = investments.length;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const primaryAsset = investments.length > 0 ? investments[0] : null;

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div className="max-w-2xl">
          <p className="text-[10px] font-bold text-[#b58c2b] tracking-widest uppercase mb-3">Investor Portfolio</p>
          <h1 className="text-5xl font-extrabold text-secondary tracking-tight mb-4">My Investments</h1>
          <p className="text-[15px] font-medium text-gray-500 leading-relaxed">
            Curating your stake in the future. Your digital ledger of private equity holdings across emerging technology sectors.
          </p>
        </div>
        
        {/* Metrics Box */}
        <div className="bg-[#f0f2f1] rounded-2xl p-8 min-w-[300px] flex justify-between items-center shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Total Committed</p>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalCommitted)}</div>
          </div>
          <div className="ml-8 border-l border-gray-300 pl-8">
             <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Holdings</p>
             <div className="text-2xl font-bold text-primary">{holdings < 10 ? `0${holdings}` : holdings}</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 font-semibold py-10">{error}</div>
      ) : investments.length === 0 ? (
        <div className="text-center bg-white rounded-xl border border-gray-200 p-12 shadow-sm">
          <p className="text-gray-500 font-semibold mb-4">You have not made any investments yet.</p>
          <a href="/home" className="inline-block bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm shadow">Explore Startups</a>
        </div>
      ) : (
        <>
          {/* Highlight Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            
            {/* Primary Asset Card */}
            {primaryAsset && (
              <Link to={`/startup/${primaryAsset.startup?._id}`} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row overflow-hidden hover:shadow-md transition">
                <div className="relative w-full sm:w-2/5 h-64 sm:h-auto bg-secondary">
                  <img src={primaryAsset.startup?.image || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800"} alt="Office logic" className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
                  <div className="absolute top-4 left-4 bg-[#e5a03b] text-white text-[9px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider shadow-sm">
                     <span className="w-2 h-2 rounded-full border border-white/50"></span>
                     Primary Asset
                  </div>
                </div>
                <div className="flex-1 p-8 flex flex-col justify-center bg-gray-50/30">
                  <h3 className="text-2xl font-bold text-secondary mb-3">{primaryAsset.startup?.title || "N/A"}</h3>
                  <p className="text-sm text-gray-500 mb-10 leading-relaxed">
                     Next-generation cognitive automation for logistics and industrial scale manufacturing.
                  </p>
                  <div className="flex justify-between items-end mt-auto">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">Invested Amount</p>
                      <div className="text-lg font-bold text-primary">{formatCurrency(primaryAsset.amount)}</div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">Execution Date</p>
                      <div className="text-sm font-bold text-secondary">{formatDate(primaryAsset.createdAt)}</div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Capital Allocation Card */}
            <div className="bg-primary rounded-2xl p-8 text-white flex flex-col shadow-lg shadow-primary/20 relative overflow-hidden">
               {/* Pattern overlay */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a8 8 0 0 1-5 7.59l-9.74-15.75L5 21V10"/></svg>
                   </div>
                   <h3 className="text-xl font-bold">Capital Allocation</h3>
                 </div>
                 
                 <div className="mt-4 space-y-4">
                   {investments.length > 0 ? (
                     [...investments].sort((a,b) => b.amount - a.amount).slice(0, 3).map((inv) => (
                       <div key={inv._id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                         <span className="text-white font-medium text-sm truncate max-w-[120px]">{inv.startup?.title || "Unknown"}</span>
                         <div className="flex items-center gap-3">
                           <span className="text-white font-bold text-sm">{formatCurrency(inv.amount)}</span>
                           <span className="text-[#E5C158] font-black text-xs w-9 text-right bg-[#E5C158]/20 px-1.5 py-0.5 rounded">
                             {Math.round((inv.amount / totalCommitted) * 100)}%
                           </span>
                         </div>
                       </div>
                     ))
                   ) : (
                     <p className="text-white/70 text-[13px] leading-relaxed">No capital deployed yet.</p>
                   )}
                 </div>
               </div>
            </div>

          </div>

          {/* Active Portfolio Grid */}
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-secondary tracking-tight">Active Portfolio</h2>
            <div className="flex gap-2">
               <button className="w-10 h-10 bg-[#f0f2f1] rounded-full flex items-center justify-center text-gray-500 hover:text-black transition">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
               </button>
               <button className="w-10 h-10 bg-[#f0f2f1] rounded-full flex items-center justify-center text-gray-500 hover:text-black transition">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments.map((inv, idx) => (
              <Link to={`/startup/${inv.startup?._id}`} key={inv._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md hover:border-primary/30 transition duration-300">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 bg-secondary rounded-full flex justify-center items-center overflow-hidden">
                     <span className="text-white font-bold text-xs">{inv.startup?.title?.substring(0, 2).toUpperCase()}</span>
                   </div>
                   <div className="bg-[#fff8eb] text-[#e5a03b] text-[8px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                     {['SAAS', 'GREENTECH', 'FINTECH', 'HEALTH', 'WEALTH'][idx % 5] || 'TECH'}
                   </div>
                </div>

                <h4 className="text-lg font-bold text-secondary mb-6">{inv.startup?.title || "Unknown"}</h4>

                <div className="mt-auto space-y-4">
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 tracking-wider uppercase mb-1">Commitment</p>
                    <div className="text-[17px] font-bold text-primary">{formatCurrency(inv.amount)}</div>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 tracking-wider uppercase mb-1">Entry Date</p>
                    <div className="text-sm font-semibold text-secondary">{formatDate(inv.createdAt)}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default InvestorDashboard;
