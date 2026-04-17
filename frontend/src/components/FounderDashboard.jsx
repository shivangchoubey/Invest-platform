import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import RegisterStartupModal from "./RegisterStartupModal";
import { formatCurrency } from "../utils/formatters";

const FounderDashboard = ({ user }) => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMyStartups = async () => {
    try {
      const res = await api.get("/startups/my");
      setStartups(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch startups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStartups();
  }, []);

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchMyStartups();
  };

  const totalVentures = startups.length;
  const fundingSecured = startups.reduce((acc, curr) => acc + (curr.amountRaised || 0), 0);
  const activeInvestors = startups.reduce((acc, curr) => acc + (curr.investorCount || 0), 0);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-secondary tracking-tight mb-3">Founder Dashboard</h1>
        <p className="text-[15px] font-medium text-gray-500 leading-relaxed max-w-xl">
          Manage your portfolio of ventures, track verification status, and monitor your funding milestones with clinical precision.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#f0f2f1] rounded-xl p-6">
          <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">Total Ventures</p>
          <div className="text-4xl font-bold text-primary">{totalVentures < 10 ? `0${totalVentures}` : totalVentures}</div>
        </div>
        
        <div className="bg-[#f0f2f1] rounded-xl p-6 border-l-4 border-[#e5a03b]">
          <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">Funding Secured</p>
          <div className="text-4xl font-bold text-secondary">{formatCurrency(fundingSecured)}</div>
        </div>

        <div className="bg-[#f0f2f1] rounded-xl p-6">
          <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">Active Investors</p>
          <div className="text-4xl font-bold text-secondary">{activeInvestors < 10 ? `0${activeInvestors}` : activeInvestors}</div>
        </div>
      </div>

      {/* Startups */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 font-semibold py-10">{error}</div>
      ) : startups.length === 0 ? (
        <div className="text-center bg-white rounded-xl border border-gray-200 p-12 shadow-sm">
          <p className="text-gray-500 font-semibold mb-4">You have not registered any ventures yet.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm shadow hover:bg-primary/90 transition"
          >
            Register New Venture
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {startups.map((startup) => {
            const isApproved = startup.verificationStatus === "APPROVED";
            const isPending = startup.verificationStatus === "PENDING";
            const isRejected = startup.verificationStatus === "REJECTED";

            return (
              <div key={startup._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="relative h-48 w-full bg-secondary">
                  <img src={startup.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800"} alt="Venture" className="w-full h-full object-cover opacity-80" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-[9px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider text-gray-700 shadow-sm border border-gray-100">
                    <span className={`w-2 h-2 rounded-full ${isApproved ? "bg-green-500" : isPending ? "bg-amber-500" : "bg-red-500"}`}></span>
                    {startup.verificationStatus}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-secondary mb-2">{startup.title}</h3>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed flex-1">
                    {startup.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Funding Progress</span>
                       <span className="text-sm font-bold text-primary">{Math.min(startup.fundingProgress || 0, 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${Math.min(startup.fundingProgress || 0, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-gray-500">
                      <span>Raised: {formatCurrency(startup.amountRaised)}</span>
                      <span>Goal: {formatCurrency(startup.fundingGoal)}</span>
                    </div>
                  </div>

                  {isApproved ? (
                    <Link to={`/startup/${startup._id}`} className="w-full flex justify-center items-center gap-2 py-3 border border-gray-200 rounded-full text-sm font-bold text-secondary hover:bg-gray-50 transition">
                      Manage Entity <span className="transform translate-y-[1px]">→</span>
                    </Link>
                  ) : isPending ? (
                     <button className="w-full flex justify-center items-center py-3 border border-gray-200 rounded-full text-sm font-bold text-gray-400 hover:bg-gray-50 transition cursor-not-allowed">
                      Complete Onboarding
                     </button>
                  ) : (
                     <button className="w-full flex justify-center gap-2 items-center py-3 bg-gray-100 text-gray-500 rounded-full text-sm font-bold hover:bg-gray-200 transition">
                       ⟲ Re-submit Application
                     </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Dummy UI Card for registering new venture matching the design */}
          <div 
            onClick={() => setIsModalOpen(true)}
            className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-10 min-h-[400px] cursor-pointer hover:bg-gray-50 hover:border-primary/30 transition group"
          >
             <div className="w-12 h-12 bg-gray-50 group-hover:bg-primary/10 flex items-center justify-center rounded-full mb-4 transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
             </div>
             <h3 className="text-lg font-bold text-secondary mb-2 group-hover:text-primary transition">Register New Venture</h3>
             <p className="text-sm text-gray-500 text-center max-w-[250px]">
               Begin the verification process for your next startup and start raising capital.
             </p>
          </div>
        </div>
      )}
      
      <RegisterStartupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleSuccess} 
      />
    </div>
  );
};

export default FounderDashboard;
