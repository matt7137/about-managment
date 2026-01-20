import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  currentStatus: 'Published' | 'Draft';
  onSelectStatus?: (status: 'Published' | 'Draft') => void;
  readOnly?: boolean;
}

const StatusDropdown: React.FC<Props> = ({ currentStatus, onSelectStatus, readOnly = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    const handleResize = () => {
       if (isOpen) setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (readOnly) return;

    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const DROPDOWN_WIDTH = 160; // w-40 is 10rem = 160px
      setPosition({
        top: rect.bottom + 8, // +8px gap
        left: rect.right - DROPDOWN_WIDTH > 0 ? rect.right - DROPDOWN_WIDTH : rect.left, 
      });
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

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
    <>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        type="button"
        disabled={readOnly}
        className={`inline-flex items-center gap-1.5 rounded-full pl-2.5 pr-2 py-1 text-xs font-bold ring-1 ring-inset transition-all ${readOnly ? 'cursor-default opacity-90' : 'cursor-pointer hover:ring-2'} ${currentStyle.badge}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${currentStyle.dot}`}></span>
        {currentStatus}
        {!readOnly && (
          <span className={`material-symbols-outlined text-[16px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
        )}
      </button>

      {isOpen && !readOnly && onSelectStatus && createPortal(
        <div 
          ref={dropdownMenuRef}
          style={{ top: position.top, left: position.left }}
          className="fixed z-[9999] w-40 origin-top-right rounded-xl border border-slate-100 bg-white p-1 shadow-xl ring-1 ring-slate-900/5 animate-in fade-in zoom-in-95 duration-100"
        >
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
        </div>,
        document.body
      )}
    </>
  );
};

export default StatusDropdown;