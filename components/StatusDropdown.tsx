import React, { useState, useRef, useEffect } from 'react';

interface Props {
  currentStatus: 'Published' | 'Draft';
  onSelectStatus: (status: 'Published' | 'Draft') => void;
}

const StatusDropdown: React.FC<Props> = ({ currentStatus, onSelectStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const styles = {
    Published: {
      badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
      dot: 'bg-emerald-600',
    },
    Draft: {
      badge: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
      dot: 'bg-yellow-500',
    }
  };

  const currentStyle = styles[currentStatus];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        type="button"
        className={`inline-flex items-center gap-1.5 rounded-full pl-2.5 pr-2 py-1 text-xs font-bold ring-1 ring-inset transition-all hover:ring-2 cursor-pointer ${currentStyle.badge}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${currentStyle.dot}`}></span>
        {currentStatus}
        <span className={`material-symbols-outlined text-[16px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-[60] mt-2 w-40 origin-top-right rounded-xl border border-slate-100 bg-white p-1 shadow-xl ring-1 ring-slate-900/5 animate-in fade-in zoom-in-95 duration-100">
          <div className="mb-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-50">Set Status</div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectStatus('Published');
              setIsOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              currentStatus === 'Published' 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            Published
            {currentStatus === 'Published' && <span className="material-symbols-outlined text-[16px] ml-auto">check</span>}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectStatus('Draft');
              setIsOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              currentStatus === 'Draft' 
                ? 'bg-yellow-50 text-yellow-800' 
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
             <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
            Draft
            {currentStatus === 'Draft' && <span className="material-symbols-outlined text-[16px] ml-auto">check</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;