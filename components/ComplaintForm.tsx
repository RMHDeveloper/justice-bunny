import React, { useState, useCallback, useEffect } from 'react';
import { ComplaintDetails } from '../types';
import { MessageDisplay } from './MessageDisplay';

interface ComplaintFormProps {
  complaintDetails: ComplaintDetails;
  setComplaintDetails: React.Dispatch<React.SetStateAction<ComplaintDetails>>;
  onSubmit: (brief: string) => void;
  loading: boolean;
  error: string | null;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({
  complaintDetails,
  setComplaintDetails,
  onSubmit,
  loading,
  error,
}) => {
  const [currentBrief, setCurrentBrief] = useState(complaintDetails.complaintBrief);

  useEffect(() => {
    setCurrentBrief(complaintDetails.complaintBrief);
  }, [complaintDetails.complaintBrief]); // Corrected dependency array property name

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (currentBrief.trim() === '' || loading) return;
    setComplaintDetails(prev => ({ ...prev, complaintBrief: currentBrief }));
    onSubmit(currentBrief);
  }, [currentBrief, loading, onSubmit, setComplaintDetails]);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-[#F8FAFC]"> {/* Removed h-full */}
      <h2 className="text-3xl font-bold text-[#1A2B48] mb-8 uppercase">
        BRIEF YOUR ISSUE
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-lg"> {/* Removed flex-1 */}
        <div className="mb-8 flex flex-col w-full"> {/* Removed flex-1 */}
          {/* Label removed as per design */}
          <textarea
            id="complaintBrief"
            className="w-full p-5 border border-slate-200 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-[#1A2B48] resize-none text-base md:text-lg bg-white min-h-[150px] max-h-[500px] overflow-y-auto"
            placeholder="Describe the incident in detail..."
            value={currentBrief}
            onChange={(e) => setCurrentBrief(e.target.value)}
            disabled={loading}
            aria-label="Complaint Brief"
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center mb-6 text-[#1A2B48]">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#1A2B48]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Preparing for analysis...
          </div>
        )}

        {error && (
          <div className="mb-6">
            <MessageDisplay message={{ role: 'model', content: error }} />
          </div>
        )}

        <button
          type="submit"
          disabled={currentBrief.trim() === '' || loading}
          className="px-12 py-4 bg-[#E5A933] text-white text-xl font-semibold rounded-xl shadow-lg hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-[#E5A933]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 mx-auto w-48"
          aria-label="Submit Complaint"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
};