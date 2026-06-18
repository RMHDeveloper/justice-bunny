import React from 'react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

// New Rabbit Marketing House Logo URL
export const RABBIT_MARKETING_HOUSE_LOGO_URL = `https://rabbitmarketinghouse.in/webinar/assets/ChatGPT_Image_Jan_6__2026__03_05_08_PM-removebg-preview.png`;


export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="relative flex flex-col items-center justify-between h-full p-6 text-center bg-[#F8FAFC] overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-xl flex-grow pt-12">
        {/* Rabbit Scales Logo */}
        <div className="mb-8 w-36 h-36 md:w-48 md:h-48">
          <img src={RABBIT_MARKETING_HOUSE_LOGO_URL} alt="Justice Bunny Rabbit Marketing House Logo" className="w-full h-full object-contain" />
        </div>

        {/* Title */}
        <div className="flex flex-col mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A2B48] tracking-tight uppercase">
            JUSTICE BUNNY
          </h2>
          <h3 className="text-xl md:text-2xl font-medium text-[#E5A933] tracking-wider uppercase -mt-1">
            INDIA LAW REFERENCE
          </h3>
        </div>

        {/* Get Started Button */}
        <button
          onClick={onGetStarted}
          className="px-12 py-4 bg-[#E5A933] text-white text-xl font-semibold rounded-xl shadow-lg hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-[#E5A933]/50 transition-colors duration-200"
        >
          GET STARTED
        </button>
      </div>

      {/* Removed Footer text from image */}
      {/* <p className="text-xs text-gray-500 mb-4 z-10">
        Developed by Rabbit Marketing House
      </p> */}
    </div>
  );
};