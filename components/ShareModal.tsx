
import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Twitter, Facebook } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  curationTitle: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl, curationTitle }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
  };

  const shareText = `Check out my curation: "${curationTitle}"`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                <X size={24} />
            </button>
            <div className="p-6">
                 <h2 className="text-2xl font-bold text-white mb-2">Share Your Curation</h2>
                 <p className="text-gray-400 mb-6">Anyone with this link can view a read-only copy of your collection.</p>

                 <div className="space-y-4">
                    <label htmlFor="share-url-input" className="block text-sm font-medium text-gray-300">
                        Shareable Link
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="share-url-input"
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                            onClick={handleCopy}
                            className="flex-shrink-0 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors flex items-center gap-2 w-28 justify-center"
                        >
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                            <span className="truncate">{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                    </div>
                 </div>

                 <div className="mt-6 pt-6 border-t border-gray-700">
                     <p className="text-sm font-medium text-gray-300 text-center mb-4">Share directly on</p>
                     <div className="flex justify-center gap-4">
                        <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-md hover:opacity-90 transition-opacity">
                           <Twitter size={20} />
                           <span>X (Twitter)</span>
                        </a>
                         <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-md hover:opacity-90 transition-opacity">
                           <Facebook size={20} />
                           <span>Facebook</span>
                        </a>
                     </div>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default ShareModal;
