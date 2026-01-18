import React from 'react';
import Tooltip from './Tooltip';

interface Props {
  onEdit: () => void;
  onDelete: () => void;
  onCompare?: () => void;
  onSettings: () => void;
  isExpanded: boolean;
  tooltips: {
    edit: string;
    delete: string;
    compare?: string;
    settings: string;
  };
}

const ActionButtons: React.FC<Props> = ({ 
  onEdit, 
  onDelete, 
  onCompare, 
  onSettings, 
  isExpanded, 
  tooltips 
}) => {
  return (
    <div className="flex items-center justify-start gap-1 relative">
      <Tooltip content={tooltips.edit}>
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="rounded-lg p-2 text-slate-500 hover:bg-primary/10 hover:text-primary transition-colors group"
        >
          <span className="material-symbols-outlined text-[20px] group-active:scale-95 transition-transform">edit</span>
        </button>
      </Tooltip>
      
      <Tooltip content={tooltips.delete}>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
        >
          <span className="material-symbols-outlined text-[20px] group-active:scale-95 transition-transform">delete</span>
        </button>
      </Tooltip>

      {onCompare && tooltips.compare && (
        <Tooltip content={tooltips.compare}>
          <button 
            onClick={(e) => { e.stopPropagation(); onCompare(); }}
            className="rounded-lg p-2 text-slate-500 hover:bg-primary/10 hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-[20px] group-active:scale-95 transition-transform">difference</span>
          </button>
        </Tooltip>
      )}
      
      <div className="relative">
        <Tooltip content={tooltips.settings}>
          <button 
            onClick={(e) => { e.stopPropagation(); onSettings(); }}
            className={`rounded-lg p-2 transition-colors group ${
              isExpanded 
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] group-active:scale-95 transition-transform ${isExpanded ? 'icon-filled' : ''}`}>settings</span>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ActionButtons;