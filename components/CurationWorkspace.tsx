
import React from 'react';
import { type ContentItem } from '../types';
import ContentCard from './ContentCard';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';

interface CurationWorkspaceProps {
  items: ContentItem[];
  onDeleteItem: (id: string) => void;
}

const CurationWorkspace: React.FC<CurationWorkspaceProps> = ({ items, onDeleteItem }) => {

  if (items.length === 0) {
    return (
        <div className="text-center py-20">
            <div className="flex items-center justify-center mx-auto w-16 h-16 bg-gray-800 rounded-full mb-4 border-2 border-dashed border-gray-600">
                <Plus size={32} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white">Your curation is empty</h3>
            <p className="text-gray-400 mt-2">Click "Add Content" to start building your collection.</p>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
            {items.map(item => (
                <ContentCard key={item.id} item={item} onDelete={() => onDeleteItem(item.id)} />
            ))}
            </div>
       </SortableContext>
    </div>
  );
};

export default CurationWorkspace;
