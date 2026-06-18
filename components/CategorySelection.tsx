import React from 'react';

interface CategorySelectionProps {
  onSelectCategory: (category: string) => void;
}

// Personal Icon SVG (filled house) - Updated to match image
const PERSONAL_ICON_SVG_BASE64 = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj4KICA8cGF0aCBkPSJNMTIgM0wyIDEyaDN2OGgxNHYtOGgzTDEyIDN6bTAgNC4xN2w1IDQuNVYxOGgtMnYtNkg5djZIN3YtNi4zM0wxMiA3LjE3eiIvPgo8L3N2Zz4=`;

// Public Icon SVG (filled group of people) - Updated to match image
const PUBLIC_ICON_SVG_BASE64 = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjMiLz4KICA8cGF0aCBkPSJNMTcgMTRoLTJhMiAyIDAgMDAyIDJ2M2gtMnYtM2EyIDIgMCAwMC0yLTJIN2E1IDUgMCAwMC01IDV2MmgyMHYtMmE1IDUgMCAwMDUtNXoiLz4KPC9zdmc+`;


export const CategorySelection: React.FC<CategorySelectionProps> = ({ onSelectCategory }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-[#F8FAFC]">
      <h2 className="text-3xl font-bold text-[#1A2B48] mb-8 uppercase">
        WHAT IS YOUR COMPLAINT ABOUT?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg">
        <button
          onClick={() => onSelectCategory('Personal (Neighbor/Family)')}
          className="flex flex-col items-center justify-center bg-[#D1E7E0] text-[#1A2B48] py-8 px-4 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-slate-300 transition-shadow duration-200 text-xl font-semibold"
          aria-label="Select Personal (Neighbor/Family) category"
        >
          <img src={PERSONAL_ICON_SVG_BASE64} alt="Personal Icon" className="w-16 h-16 mb-4 text-[#1A2B48]" />
          Personal <br/> (Neighbor/Family)
        </button>
        <button
          onClick={() => onSelectCategory('For Others (Public/Community)')}
          className="flex flex-col items-center justify-center bg-[#F9DCC4] text-[#1A2B48] py-8 px-4 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-slate-300 transition-shadow duration-200 text-xl font-semibold"
          aria-label="Select For Others (Public/Community) category"
        >
          <img src={PUBLIC_ICON_SVG_BASE64} alt="Public Icon" className="w-16 h-16 mb-4 text-[#1A2B48]" />
          For Others <br/> (Public/Community)
        </button>
      </div>
    </div>
  );
};