import React, { useState } from "react";
import api from "../services/api";

const RegisterStartupModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    opportunity: "",
    industryType: "TECH",
    fundingGoal: "",
    equityOffered: "",
    image: "",
    pitchPdf: "",
    pitchVideo: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post("/startups", {
        ...formData,
        fundingGoal: Number(formData.fundingGoal),
        equityOffered: Number(formData.equityOffered)
      });
      setFormData({ title: "", description: "", opportunity: "", industryType: "TECH", fundingGoal: "", equityOffered: "", image: "", pitchPdf: "", pitchVideo: "" });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register venture. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden transform transition-all h-[90vh] flex flex-col">
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-secondary">Register New Venture</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-8">
            Provide the details for your new venture. Once submitted, it will be reviewed for approval before it becomes visible to investors.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 pb-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-secondary mb-2">Venture Name</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. NextGen Robotics"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-secondary mb-2">Short Description</label>
              <textarea
                id="description"
                name="description"
                required
                rows="2"
                value={formData.description}
                onChange={handleChange}
                placeholder="A brief summary of your venture..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-none"
              ></textarea>
            </div>

            <div>
              <label htmlFor="opportunity" className="block text-sm font-semibold text-secondary mb-2">The Opportunity (Detailed Description)</label>
              <textarea
                id="opportunity"
                name="opportunity"
                rows="5"
                value={formData.opportunity || ""}
                onChange={handleChange}
                placeholder="Describe your venture's mission, product, and market opportunity in detail..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-none"
              ></textarea>
            </div>

            <div>
              <label htmlFor="industryType" className="block text-sm font-semibold text-secondary mb-2">Industry Type</label>
              <select
                id="industryType"
                name="industryType"
                value={formData.industryType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-white"
              >
                <option value="TECH">Technology (General)</option>
                <option value="SAAS">SaaS (Software as a Service)</option>
                <option value="GREENTECH">Greentech & Sustainability</option>
                <option value="FINTECH">FinTech</option>
                <option value="HEALTH">HealthTech</option>
                <option value="WEALTH">Wealth Management</option>
                <option value="FMCG">FMCG</option>
                <option value="AI">AI</option>
                <option value="EDTECH">EduTech</option>
              </select>
            </div>

            <div>
              <label htmlFor="fundingGoal" className="block text-sm font-semibold text-secondary mb-2">Funding Goal (INR)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-semibold">₹</span>
                </div>
                <input
                  type="number"
                  id="fundingGoal"
                  name="fundingGoal"
                  required
                  min="1000"
                  value={formData.fundingGoal}
                  onChange={handleChange}
                  placeholder="5000000"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="equityOffered" className="block text-sm font-semibold text-secondary mb-2">Equity Offered (%)</label>
              <div className="relative">
                <input
                  type="number"
                  id="equityOffered"
                  name="equityOffered"
                  required
                  min="0.01"
                  max="100"
                  step="0.01"
                  value={formData.equityOffered}
                  onChange={handleChange}
                  placeholder="5"
                  className="w-full pr-8 pl-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-semibold">%</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-secondary mb-2">Cover Image URL (Optional)</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              />
            </div>

            <div>
              <label htmlFor="pitchPdf" className="block text-sm font-semibold text-secondary mb-2">Pitch Deck (PDF URL) (Optional)</label>
              <input
                type="text"
                id="pitchPdf"
                name="pitchPdf"
                value={formData.pitchPdf || ""}
                onChange={handleChange}
                placeholder="https://example.com/pitch.pdf"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              />
            </div>

            <div>
              <label htmlFor="pitchVideo" className="block text-sm font-semibold text-secondary mb-2">Pitch Video (YouTube/Vimeo URL) (Optional)</label>
              <input
                type="text"
                id="pitchVideo"
                name="pitchVideo"
                value={formData.pitchVideo || ""}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-gray-500 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-primary hover:bg-primary/90 transition shadow disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : null}
                Submit Venture
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterStartupModal;
