import React from 'react';
import { RABBIT_MARKETING_HOUSE_LOGO_URL } from './WelcomeScreen'; // Import the new logo URL

interface VerificationPopupProps {
  // complaintBrief is no longer needed directly in this component's props
  summarizedBrief: string | null; // AI-summarized brief or error message
  onConfirm: () => void;
  onEdit: () => void;
  loading: boolean;
}

export const VerificationPopup: React.FC<VerificationPopupProps> = ({
  summarizedBrief,
  onConfirm,
  onEdit,
  loading,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-[#F8FAFC]">
      {/* Rabbit Logo */}
      <div className="mb-4 w-20 h-20">
        <img src={RABBIT_MARKETING_HOUSE_LOGO_URL} alt="Justice Bunny Rabbit Marketing House Logo" className="w-full h-full object-contain" />
      </div>

      <h2 className="text-3xl font-bold text-[#1A2B48] mb-8 uppercase">
        REVIEW & CONFIRM
      </h2>

      <div className="bg-[#FFF6E5] p-6 rounded-xl shadow-md border border-slate-200 w-full max-w-xl text-left mb-8 text-[#1A2B48]">
        <h3 className="text-lg font-bold text-[#1A2B48] mb-2">Summarized by AI:</h3>
        <p className="whitespace-pre-wrap text-base">
          {summarizedBrief || "AI summary not available. Please try again or edit your complaint."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
        <button
          onClick={onEdit}
          disabled={loading}
          className="flex-1 py-4 px-6 bg-white text-[#1A2B48] text-lg font-semibold rounded-xl shadow-md border border-slate-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Edit"
        >
          EDIT
        </button>
        <button
          onClick={onConfirm}
          disabled={loading} // Button is disabled if loading is true (i.e., AI call is in progress)
          className="flex-1 py-4 px-6 bg-[#E5A933] text-white text-lg font-semibold rounded-xl shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#E5A933]/50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Confirm and View Legal Advice"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Getting Advice...
            </div>
          ) : (
            'VIEW LEGAL ADVICE' // Changed text
          )}
        </button>
      </div>
    </div>
  );
};