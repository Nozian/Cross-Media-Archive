
import React, { useState, useEffect, useCallback } from 'react';
import { type ContentItem, ContentType } from './types';
import Header from './components/Header';
import CurationWorkspace from './components/CurationWorkspace';
import AddContentModal from './components/AddContentModal';
import ShareModal from './components/ShareModal';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import { compressAndEncode, decodeAndDecompress } from './utils/share';


// Make Twitter Widgets object available on the window
declare global {
    interface Window {
        twttr?: any;
    }
}


const App: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);


  useEffect(() => {
    const loadData = async () => {
        const hash = window.location.hash;
        if (hash.startsWith('#data=')) {
            try {
                const encodedData = hash.substring(6); // remove '#data='
                const decompressedState = await decodeAndDecompress(encodedData);
                if (decompressedState) {
                    setTitle(decompressedState.title || 'My Awesome Curation');
                    setDescription(decompressedState.description || 'A collection of my favorite things from the internet.');
                    setItems(decompressedState.items || []);
                    window.history.replaceState(null, '', window.location.pathname + window.location.search);
                }
            } catch (error) {
                console.error("Failed to load curation from URL", error);
                // Fallback to default state if URL parsing fails
                setTitle('My Awesome Curation');
                setDescription('A collection of my favorite things from the internet.');
            }
        } else {
             // If no URL data, try localStorage
            try {
                const savedCuration = localStorage.getItem('curation');
                if (savedCuration) {
                    const { title, description, items } = JSON.parse(savedCuration);
                    setTitle(title);
                    setDescription(description);
                    setItems(items);
                } else {
                    setTitle('My Awesome Curation');
                    setDescription('A collection of my favorite things from the internet.');
                }
            } catch (error) {
                console.error("Failed to load curation from localStorage", error);
                setTitle('My Awesome Curation');
                setDescription('A collection of my favorite things from the internet.');
            }
        }
        setIsDataLoaded(true);
    };

    loadData();
  }, []); // Run only on initial mount

  useEffect(() => {
    if (isDataLoaded) {
      const curation = { title, description, items };
      localStorage.setItem('curation', JSON.stringify(curation));
    }
  }, [title, description, items, isDataLoaded]);

  const handleAddItem = (item: Omit<ContentItem, 'id'>) => {
    setItems(prevItems => [...prevItems, { ...item, id: uuidv4() }]);
  };
  
  const handleDeleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const {active, over} = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);
  
  const handleShare = async () => {
    const curationState = { title, description, items };
    try {
        const encodedData = await compressAndEncode(curationState);
        const url = `${window.location.origin}${window.location.pathname}#data=${encodedData}`;
        setShareUrl(url);
        setIsShareModalOpen(true);
    } catch (error) {
        console.error("Failed to create share link", error);
        alert("Sorry, could not create a shareable link.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header onAddContent={() => setIsModalOpen(true)} onShare={handleShare} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Curation Title"
            className="w-full bg-transparent text-4xl font-bold text-white outline-none mb-2 placeholder-gray-500"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            className="w-full bg-transparent text-lg text-gray-400 outline-none resize-none placeholder-gray-500"
            rows={2}
          />
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <CurationWorkspace items={items} onDeleteItem={handleDeleteItem} />
        </DndContext>
      </main>
      <AddContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddItem={handleAddItem}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
        curationTitle={title}
      />
    </div>
  );
};

export default App;
