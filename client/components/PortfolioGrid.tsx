import React from 'react';
import { PortfolioItem } from '../types';
import { ExternalLink } from 'lucide-react';

interface PortfolioGridProps {
  items: PortfolioItem[];
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.id} className="group relative bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="aspect-[4/3] overflow-hidden bg-stone-100 relative">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <a href={item.link || '#'} className="bg-white text-stone-900 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    View Project <ExternalLink size={14} />
                </a>
            </div>
          </div>
          <div className="p-5">
            <div className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">
              {item.category}
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2 leading-tight">
              {item.title}
            </h3>
            <p className="text-stone-500 text-sm leading-relaxed line-clamp-2">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};