import React from 'react';

interface HistoryVersion {
  version: string;
  date: string;
  author: string;
  status: 'Published' | 'Draft' | 'Archived';
  description: string;
}

const MOCK_HISTORY: HistoryVersion[] = [
  { version: 'v14', date: 'Oct 24, 2023 4:30 PM', author: 'Alex M.', status: 'Published', description: 'Updated mission statement paragraph.' },
  { version: 'v13', date: 'Oct 20, 2023 2:15 PM', author: 'Sarah J.', status: 'Archived', description: 'Reverted to Q3 content.' },
  { version: 'v12', date: 'Sep 15, 2023 10:00 AM', author: 'Alex M.', status: 'Archived', description: 'Initial draft for Q4.' },
  { version: 'v11', date: 'Aug 01, 2023 09:15 AM', author: 'Mike T.', status: 'Archived', description: 'Minor typo fixes.' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pageTitle: string;
  onRestore?: (version: string) => void;
}

const HistoryModal: React.FC<Props> = ({ isOpen, onClose, pageTitle, onRestore }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in zoom-in-95 fade-in duration-200 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
             <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            Version History
          </h3>
          <p className="text-xs text-slate-500 mt-1">History for <span className="font-semibold text-slate-700">{pageTitle}</span></p>
          </div>
         
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* List */}
        <div className="flex-1 overflow-y-auto p-0 bg-white">
            <div className="divide-y divide-slate-100">
                {MOCK_HISTORY.map((item, index) => (
                    <div key={item.version} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4 group">
                        <div className="flex flex-col items-center gap-1 mt-1">
                             <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm ${index === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                {item.version}
                             </div>
                             {index !== MOCK_HISTORY.length - 1 && <div className="w-px h-full bg-slate-200 min-h-[30px] rounded-full"></div>}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-900">{item.author}</span>
                                    <span className="text-xs text-slate-500">{item.date}</span>
                                </div>
                                {item.status === 'Published' && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                        Current
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">{item.description}</p>
                            
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-xs font-bold text-primary hover:bg-primary/5 px-2 py-1 rounded transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">visibility</span> Preview
                                </button>
                                {onRestore && (
                                  <button 
                                    onClick={() => onRestore(item.version)}
                                    className="text-xs font-bold text-slate-700 hover:bg-slate-100 px-2 py-1 rounded transition-colors flex items-center gap-1"
                                  >
                                      <span className="material-symbols-outlined text-[14px]">restore</span> Restore
                                  </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;