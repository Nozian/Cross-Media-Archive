
import React from 'react';
import { PlusCircle, Share2 } from 'lucide-react';

interface HeaderProps {
  onAddContent: () => void;
  onShare: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddContent, onShare }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-700">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="bg-primary-500 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            </div>
            <h1 className="text-xl font-bold text-white">Cross-Media Curator</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onShare}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
          >
            <Share2 size={20} />
            <span>Share</span>
          </button>
          <button
            onClick={onAddContent}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
          >
            <PlusCircle size={20} />
            <span>Add Content</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
