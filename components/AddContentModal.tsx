
import React, { useState, Fragment, useEffect } from 'react';
import { type ContentItem, ContentType, type SummarizedContent } from '../types';
import { CONTENT_TYPE_CONFIG } from '../constants';
import Spinner from './Spinner';
import { summarizeUrlContent } from '../services/geminiService';
import { X } from 'lucide-react';

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<ContentItem, 'id'>) => void;
}

const AddContentModal: React.FC<AddContentModalProps> = ({ isOpen, onClose, onAddItem }) => {
  const [activeTab, setActiveTab] = useState<ContentType>(ContentType.YOUTUBE);
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setNote('');
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleAdd = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === ContentType.NOTE) {
        if (note.trim()) {
          onAddItem({ type: ContentType.NOTE, text: note.trim() });
          onClose();
        } else {
            setError("Note content cannot be empty.");
        }
      } else {
        if (!url.trim()) {
            setError("URL cannot be empty.");
            setIsLoading(false);
            return;
        }
        
        let newItem: Omit<ContentItem, 'id'> = { type: activeTab, url };
        
        if (activeTab === ContentType.LINK || activeTab === ContentType.INSTAGRAM) {
          const summarized: SummarizedContent | null = await summarizeUrlContent(url);
          if (summarized) {
            newItem.title = summarized.title;
            newItem.description = summarized.summary;
          } else {
            // fallback
            newItem.title = "Could not summarize content";
            newItem.description = url;
          }
        }
        
        onAddItem(newItem);
        onClose();
      }
    } catch (e) {
      console.error("Failed to add item:", e);
      setError("Failed to process the content. Please check the URL or try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                <X size={24} />
            </button>
            <div className="p-6">
                 <h2 className="text-2xl font-bold text-white mb-2">Add New Content</h2>
                 <p className="text-gray-400 mb-6">Select a content type and provide the details.</p>

                <div className="flex border-b border-gray-700 mb-6">
                    {Object.values(ContentType).map(type => {
                        const config = CONTENT_TYPE_CONFIG[type];
                        return (
                            <button
                                key={type}
                                onClick={() => setActiveTab(type)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                                    activeTab === type
                                    ? 'border-b-2 border-primary-500 text-white'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <config.icon size={16}/>
                                {config.label}
                            </button>
                        )
                    })}
                </div>
                
                <div className="space-y-4">
                    {activeTab !== ContentType.NOTE ? (
                        <div>
                            <label htmlFor="url-input" className="block text-sm font-medium text-gray-300 mb-1">
                                URL
                            </label>
                            <input
                                id="url-input"
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder={`Enter ${CONTENT_TYPE_CONFIG[activeTab].label} URL`}
                                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    ) : (
                         <div>
                            <label htmlFor="note-input" className="block text-sm font-medium text-gray-300 mb-1">
                                Note
                            </label>
                            <textarea
                                id="note-input"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Jot down your thoughts..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={5}
                            />
                        </div>
                    )}
                </div>

                {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAdd}
                        disabled={isLoading}
                        className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:bg-primary-500/50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading && <Spinner />}
                        {isLoading ? 'Adding...' : 'Add Content'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AddContentModal;
