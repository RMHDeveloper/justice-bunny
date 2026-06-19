import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageDisplay } from './MessageDisplay';
import { StructuredLegalResult } from '../types';

interface LegalResultsProps {
  result: StructuredLegalResult | string | null;
  loading: boolean;
  error: string | null;
  onStartNew: () => void;
}

export const LegalResults: React.FC<LegalResultsProps> = ({ result, loading, error, onStartNew }) => {
  const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(true);

  const isErrorString = typeof result === 'string';
  const hasResult = result && !isErrorString;
  const structuredResult = hasResult ? (result as StructuredLegalResult) : null;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center flex-1 text-[#1A2B48]">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-[#1A2B48]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg">Generating comprehensive legal analysis...</p>
        </div>
      );
    }

    if (error || isErrorString) {
      return (
        <div className="p-4">
          <MessageDisplay message={{ role: 'model', content: error || (result as string) }} />
        </div>
      );
    }

    if (!structuredResult) {
      return (
        <div className="p-4 text-center text-gray-500">
          No legal guidance available. Please start a new inquiry.
        </div>
      );
    }

    return (
      <>
        {/* Relevant Legal Provisions */}
        {(structuredResult.bnsBnssCode && structuredResult.bnsBnssCode !== "N/A") || (structuredResult.oldIpcCrpcSection && structuredResult.oldIpcCrpcSection !== "N/A") ? (
          <div className="mb-6 pb-4 border-b border-slate-200">
            <h3 className="text-xl font-bold text-[#1A2B48] mb-3">Relevant Legal Provisions:</h3>
            {structuredResult.bnsBnssCode && structuredResult.bnsBnssCode !== "N/A" && (
              <p className="text-base md:text-lg mb-2">
                <span className="font-semibold">BNS/BNSS Code:</span> {structuredResult.bnsBnssCode}
              </p>
            )}
            {structuredResult.oldIpcCrpcSection && structuredResult.oldIpcCrpcSection !== "N/A" && (
              <p className="text-base md:text-lg">
                <span className="font-semibold">Corresponding IPC/CrPC Section:</span> {structuredResult.oldIpcCrpcSection}
              </p>
            )}
          </div>
        ) : (
          <p className="mb-6 pb-4 border-b border-slate-200 text-base md:text-lg text-gray-600">No specific legal codes found for this issue.</p>
        )}

        {/* Legal Guidance Accordion */}
        {structuredResult.legalGuidance && (
          <div className="mb-6 pb-4 border-b border-slate-200">
            <button
              className="flex justify-between items-center w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-left text-xl font-bold text-[#1A2B48] focus:outline-none focus:ring-2 focus:ring-[#E5A933] transition-colors duration-200"
              onClick={() => setIsGuidanceExpanded(!isGuidanceExpanded)}
              aria-expanded={isGuidanceExpanded}
              aria-controls="legal-guidance-content"
            >
              General Legal Guidance:
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${isGuidanceExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div
              id="legal-guidance-content"
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isGuidanceExpanded ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
              aria-hidden={!isGuidanceExpanded}
            >
              <div className="prose prose-sm md:prose-base max-w-none text-[#1A2B48]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children, ...props }) => <h1 className="text-xl font-bold mb-2" {...props}>{children}</h1>,
                    h2: ({ children, ...props }) => <h2 className="text-lg font-semibold mt-4 mb-2" {...props}>{children}</h2>,
                    h3: ({ children, ...props }) => <h3 className="text-base font-bold mt-3 mb-1 text-[#E5A933]" {...props}>{children}</h3>,
                    p: ({ children, ...props }) => <p className="mb-2 text-sm md:text-base" {...props}>{children}</p>,
                    ul: ({ children, ...props }) => <ul className="list-disc list-inside mb-2 pl-4" {...props}>{children}</ul>,
                    ol: ({ children, ...props }) => <ol className="list-decimal list-inside mb-2 pl-4" {...props}>{children}</ol>,
                    li: ({ children, ...props }) => <li className="mb-1 text-sm md:text-base" {...props}>{children}</li>,
                    a: ({ children, ...props }) => <a className="text-[#1A2B48] hover:underline font-medium" {...props}>{children}</a>,
                    strong: ({ children, ...props }) => <strong className="font-bold" {...props}>{children}</strong>,
                    em: ({ children, ...props }) => <em className="italic" {...props}>{children}</em>,
                    table: ({ children, ...props }) => <table className="table-auto w-full border-collapse border border-slate-300 my-4" {...props}>{children}</table>,
                    th: ({ children, ...props }) => <th className="border border-slate-300 bg-slate-100 p-2 text-left font-semibold" {...props}>{children}</th>,
                    td: ({ children, ...props }) => <td className="border border-slate-300 p-2" {...props}>{children}</td>,
                  }}
                >
                  {structuredResult.legalGuidance}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Action Plan */}
        {structuredResult.procedure && structuredResult.procedure.length > 0 ? (
          <div>
            <h3 className="text-xl font-bold text-[#1A2B48] mb-3">Your Action Plan:</h3>
            <ol className="list-decimal list-inside space-y-2 text-base md:text-lg">
              {structuredResult.procedure.map((step, index) => (
                <li key={index} className="pl-2 flex items-start">
                  <span className="font-bold text-lg md:text-xl text-[#1A2B48] mr-2">{index + 1}.</span>
                  <span className="font-normal text-lg md:text-xl text-[#1A2B48] flex-1">
                    {step.startsWith(`${index + 1}. `) ? step.substring(String(index + 1).length + 2) : step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="text-base md:text-lg text-gray-600">No specific 3-step procedure found for this issue.</p>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col p-6 bg-[#F8FAFC]">
      <h2 className="text-3xl font-bold text-[#1A2B48] mb-6 text-center uppercase">
        LEGAL GUIDANCE
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-inner border border-slate-200 text-[#1A2B48] mb-6 min-h-[250px] overflow-y-auto">
        {renderContent()}
      </div>
      <button
        onClick={onStartNew}
        className="mt-2 w-full py-4 bg-[#E5A933] text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-[#E5A933]/50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Start New Legal Inquiry"
        disabled={loading}
      >
        START NEW INQUIRY
      </button>
    </div>
  );
};
