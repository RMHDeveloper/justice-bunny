import React, { useState, useCallback } from 'react';
import { callGeminiAI } from './services/geminiService';
import { WelcomeScreen, RABBIT_MARKETING_HOUSE_LOGO_URL } from './components/WelcomeScreen'; // Import RABBIT_MARKETING_HOUSE_LOGO_URL
import { CategorySelection } from './components/CategorySelection';
import { ComplaintForm } from './components/ComplaintForm';
import { VerificationPopup } from './components/VerificationPopup';
import { LegalResults } from './components/LegalResults';
import { LoadingAnalysis } from './components/LoadingAnalysis';
import { ComplaintDetails, StructuredLegalResult } from './types'; // Re-import StructuredLegalResult

type Page = 'welcome' | 'category' | 'form' | 'analysisLoading' | 'verification' | 'results';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const [complaintDetails, setComplaintDetails] = useState<ComplaintDetails>({
    complaintBrief: '',
    category: '',
  });
  // Updated type to accept StructuredLegalResult or string
  const [legalResult, setLegalResult] = useState<StructuredLegalResult | string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goToPage = (page: Page) => setCurrentPage(page);

  const handleBack = useCallback(() => {
    switch (currentPage) {
      case 'welcome':
        break;
      case 'category':
        setCurrentPage('welcome');
        break;
      case 'form':
        setCurrentPage('category');
        setComplaintDetails(prev => ({ ...prev, complaintBrief: '' }));
        break;
      case 'analysisLoading':
        setCurrentPage('form');
        break;
      case 'verification':
        setCurrentPage('form'); // Back from verification goes to form to edit
        // If we go back from verification, clear the generated legalResult
        setLegalResult(null);
        setError(null);
        break;
      case 'results':
        setCurrentPage('verification');
        // No need to clear legalResult here, as verification uses it
        setError(null);
        break;
      default:
        setCurrentPage('welcome');
    }
  }, [currentPage]);

  const handleSubmitBriefForVerification = useCallback((brief: string) => {
    setComplaintDetails(prev => ({ ...prev, complaintBrief: brief }));
    goToPage('analysisLoading');
  }, []);

  // Now, handleAnalysisComplete will trigger the AI call
  const handleAnalysisComplete = useCallback(async () => {
    setLoading(true); // Start loading for the AI call
    setError(null); // Clear any previous errors
    try {
      const result = await callGeminiAI(complaintDetails.complaintBrief);
      if (typeof result === 'string') {
        setError(result);
        setLegalResult(result);
      } else {
        setLegalResult(result);
      }
      goToPage('verification'); // Go to verification after AI has processed and summary is available
    } catch (err: any) {
      console.error('Failed to get AI response:', err);
      const errorMessage = `An error occurred while fetching legal advice: ${err.message || 'Unknown error'}. Please try again.`;
      setError(errorMessage);
      setLegalResult(errorMessage);
      goToPage('verification'); // Still go to verification, but with an error
    } finally {
      setLoading(false); // End loading
    }
  }, [complaintDetails.complaintBrief]);

  // handleConfirmBrief now just navigates, as the AI call is already done
  const handleConfirmBrief = useCallback(() => {
    goToPage('results');
  }, []);

  const handleEditBrief = useCallback(() => {
    goToPage('form');
    setLegalResult(null); // Clear previous AI result if editing
    setError(null);
  }, []);


  const handleStartNew = useCallback(() => {
    setComplaintDetails({ complaintBrief: '', category: '' });
    setLegalResult(null); // Reset to null
    setError(null);
    goToPage('category');
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomeScreen onGetStarted={() => goToPage('category')} />;
      case 'category':
        return <CategorySelection onSelectCategory={(cat) => {
          setComplaintDetails(prev => ({ ...prev, category: cat }));
          goToPage('form');
        }} />;
      case 'form':
        return (
          <ComplaintForm
            complaintDetails={complaintDetails}
            setComplaintDetails={setComplaintDetails}
            onSubmit={handleSubmitBriefForVerification}
            loading={loading}
            error={error}
          />
        );
      case 'analysisLoading':
        return <LoadingAnalysis onComplete={handleAnalysisComplete} />; // Pass new handleAnalysisComplete
      case 'verification':
        return (
          <VerificationPopup
            // The original complaintBrief is only for the AI input, not for display in this component.
            // summarizedBrief is now always available if legalResult is an object.
            summarizedBrief={(legalResult && typeof legalResult !== 'string') ? legalResult.summarizedBrief : (error || "AI summary not available.")} // Display error if summary failed
            onConfirm={handleConfirmBrief}
            onEdit={handleEditBrief}
            loading={loading} // loading state now reflects AI call in handleAnalysisComplete
          />
        );
      case 'results':
        return (
          <LegalResults
            result={legalResult} // Pass StructuredLegalResult or string
            loading={loading}
            error={error}
            onStartNew={handleStartNew}
          />
        );
      default:
        return <WelcomeScreen onGetStarted={() => goToPage('category')} />;
    }
  };

  const isSimplifiedHeader = currentPage === 'form' || currentPage === 'analysisLoading' || currentPage === 'verification' || currentPage === 'category';

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-[#1A2B48]">
      {/* Header */}
      <header className="bg-[#1A2B48] text-white shadow-lg p-4 flex items-center justify-between sticky top-0 z-10">
        {isSimplifiedHeader ? (
          <>
            <button
              onClick={handleBack}
              className={`p-2 rounded-xl hover:bg-[#2b4570] focus:outline-none focus:ring-2 focus:ring-[#E5A933] transition duration-200 ${
                currentPage === 'welcome' ? 'opacity-50 cursor-not-allowed hover:bg-[#1A2B48]' : ''
              }`}
              aria-label="Back"
              disabled={currentPage === 'welcome'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            {/* Simplified Header with Logo */}
            <div className="flex items-center">
              <img src={RABBIT_MARKETING_HOUSE_LOGO_URL} alt="Justice Bunny Logo" className="w-8 h-8 mr-2 object-contain" />
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">
                JUSTICE BUNNY
              </h1>
            </div>
            <div className="w-6 h-6" /> {/* Placeholder for alignment if needed */}
          </>
        ) : (
          <>
            {/* Full Header with Logo */}
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center">
              <img src={RABBIT_MARKETING_HOUSE_LOGO_URL} alt="Justice Bunny Logo" className="w-8 h-8 mr-2 object-contain" />
              <span className="text-[#F8FAFC]">Justice Bunny: </span>
              <span className="text-[#E5A933] ml-1">India Law Reference</span>
            </h1>
            <div className="flex items-center">
              <nav className="hidden md:flex space-x-4 mr-4">
                <a href="#about" className="text-white hover:text-[#E5A933] transition duration-200">About</a>
                <a href="#features" className="text-white hover:text-[#E5A933] transition duration-200">Features</a>
                <a href="#contact" className="text-white hover:text-[#E5A933] transition duration-200">Contact</a>
              </nav>
              <button
                onClick={handleBack}
                className={`p-2 rounded-xl hover:bg-[#2b4570] focus:outline-none focus:ring-2 focus:ring-[#E5A933] transition duration-200 ${
                  currentPage === 'welcome' ? 'opacity-50 cursor-not-allowed hover:bg-[#1A2B48]' : ''
                }`}
                aria-label="Back"
                disabled={currentPage === 'welcome'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </button>
            </div>
          </>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl flex flex-col">
          <div className="">
            {renderPage()}
          </div>
          {/* Disclaimer */}
          <div className="bg-[#F8FAFC] text-[#1A2B48] text-xs p-3 text-center border-t border-slate-200 rounded-b-xl">
            Disclaimer: AI-generated advice is for informational purposes only and does not constitute legal representation.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A2B48] text-gray-300 text-center p-3 text-sm sticky bottom-0 z-10">
        Developed by Rabbit Marketing House
      </footer>
    </div>
  );
};

export default App;