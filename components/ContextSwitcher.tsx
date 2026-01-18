import React, { useState } from 'react';
import { ViewState } from '../types';

interface Props {
  currentContext: 'Global' | 'Taiwan';
  onNavigate: (view: ViewState) => void;
}

const ContextSwitcher: React.FC<Props> = ({ currentContext, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-40 flex items-center gap-3 w-full sm:w-auto bg-white px-4 py-1.5 rounded-lg border border-slate-200 shadow-sm ring-1 ring-primary/20">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">Context:</span>
      <div className="relative w-full group">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full min-w-[140px] items-center justify-between gap-2 border-0 bg-transparent py-2 pl-0 pr-0 text-sm font-bold text-primary focus:outline-none cursor-pointer"
        >
          <span>{currentContext === 'Global' ? 'Global (Default)' : 'Taiwan'}</span>
          <span className={`material-symbols-outlined text-[20px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
        </button>
        
        {isOpen && (
          <>
            <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)} />
            <div className="absolute left-[-60px] top-[calc(100%+14px)] w-[240px] rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 origin-top-left z-[60] animate-in fade-in zoom-in-95 duration-100">
              <div className="mb-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-50">Select Region</div>
              
              {/* Global Option */}
              <div 
                onClick={() => {
                  onNavigate('GLOBAL_LIST');
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-bold cursor-pointer mb-1 transition-colors ${
                  currentContext === 'Global' 
                    ? 'text-primary bg-primary/5' 
                    : 'text-slate-900 hover:bg-slate-50'
                }`}
              >
                Global (Default)
                {currentContext === 'Global' && <span className="material-symbols-outlined text-[18px]">check</span>}
              </div>

              {/* Taiwan Option */}
              <div 
                onClick={() => {
                  onNavigate('LOCAL_LIST');
                  setIsOpen(false);
                }}
                 className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-bold cursor-pointer mb-1 transition-colors ${
                  currentContext === 'Taiwan' 
                    ? 'text-primary bg-primary/5' 
                    : 'text-slate-900 hover:bg-slate-50'
                }`}
              >
                Taiwan
                 {currentContext === 'Taiwan' && <span className="material-symbols-outlined text-[18px]">check</span>}
              </div>

              <div className="my-1 border-t border-slate-100"></div>
              
              {/* Other Regions (Mock) */}
              {['United States', 'United Kingdom', 'Germany', 'France'].map(region => (
                 <div key={region} className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 cursor-pointer transition-colors opacity-70">
                  {region}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContextSwitcher;