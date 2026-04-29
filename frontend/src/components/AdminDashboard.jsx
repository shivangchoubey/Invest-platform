import React, { useEffect, useState } from "react";
import api from "../services/api";
import { formatCurrency } from "../utils/formatters";

const AdminDashboard = ({ user }) => {
  const [pendingStartups, setPendingStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingStartups = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/pending");
      setPendingStartups(data);
    } catch (error) {
      console.error("Failed to fetch pending startups", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingStartups();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await api.put(`/admin/${action}/${id}`);
      fetchPendingStartups();
    } catch (error) {
      console.error(`Failed to ${action} startup`, error);
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Submitted just now";
    if (diffHours < 24) return `Submitted ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    return `Submitted ${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-[#111] mb-4">Verification Queue</h1>
        <p className="text-gray-500 font-medium text-lg leading-relaxed">
          Review and manage pending startup applications. Ensure all entities align with the compliance standards before granting marketplace access.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {pendingStartups.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-xl font-bold text-[#111] mb-2">All Caught Up!</h3>
            <p className="text-gray-500 font-medium">There are no pending startups to review at this time.</p>
          </div>
        ) : (
          pendingStartups.map((startup) => (
            <div key={startup._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition">
              <div className="flex items-start gap-6 w-full md:w-3/4">
                <div className="w-20 h-20 rounded-2xl bg-[#0f2e26] shrink-0 overflow-hidden relative shadow-inner">
                  {startup.image ? (
                    <img src={startup.image} alt={startup.title} className="w-full h-full object-cover opacity-90" />
                  ) : (
                    <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800" alt="Placeholder" className="w-full h-full object-cover opacity-60" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h2 className="text-xl font-bold text-[#111]">{startup.title}</h2>
                    <span className="bg-[#f0e8db] text-[#8c6b3e] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      PENDING REVIEW
                    </span>
                  </div>
                  
                  <p className="text-gray-500 text-sm font-medium mb-3 line-clamp-2 pr-4">
                    {startup.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {getTimeAgo(startup.createdAt)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif text-sm">₹</span>
                      Seeking {formatCurrency(startup.fundingGoal)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto shrink-0 md:justify-end">
                <button 
                  onClick={() => handleAction(startup._id, 'approve')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0f5c43] hover:bg-[#0b4231] text-white px-5 py-2.5 rounded-full font-bold text-sm transition shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Approve
                </button>
                <button 
                  onClick={() => handleAction(startup._id, 'reject')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#111] border border-gray-200 px-5 py-2.5 rounded-full font-bold text-sm transition shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
