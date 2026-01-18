import React from 'react';

interface Props {
  isOpen: boolean;
  itemTitle: string;
  newStatus: 'Published' | 'Draft';
  onClose: () => void;
  onConfirm: () => void;
}

const StatusChangeModal: React.FC<Props> = ({ 
  isOpen, 
  itemTitle,
  newStatus,
  onClose, 
  onConfirm
}) => {
  if (!isOpen) return null;

  const isPublishing = newStatus === 'Published';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in zoom-in-95 fade-in duration-200">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${isPublishing ? 'bg-emerald-100 text-emerald-600' : 'bg-yellow-100 text-yellow-600'}`}>
              <span className="material-symbols-outlined text-[24px]">{isPublishing ? 'rocket_launch' : 'history_edu'}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900">{isPublishing ? 'Publish Page?' : 'Revert to Draft?'}</h3>
              <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                You are about to change the status of <span className="font-bold text-slate-900">{itemTitle}</span> to <span className={`font-bold ${isPublishing ? 'text-emerald-600' : 'text-yellow-600'}`}>{newStatus}</span>.
                {isPublishing 
                  ? ' This will make the page visible to the public immediately.' 
                  : ' This will unpublish the page and hide it from the public.'}
              </p>
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-3 bg-slate-50 -mx-6 -mb-6 px-6 py-4 border-t border-slate-100">
            <button 
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className={`rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors ${
                isPublishing 
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' 
                  : 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-600/20'
              }`}
            >
              {isPublishing ? 'Yes, Publish' : 'Yes, Revert to Draft'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusChangeModal;