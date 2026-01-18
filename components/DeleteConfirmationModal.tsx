import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
}

const DeleteConfirmationModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Move to Recycle Bin?",
  description = "Are you sure you want to remove this page? This action will move the content to the recycle bin.",
  confirmText = "Yes, Move to Bin"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in zoom-in-95 fade-in duration-200">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <span className="material-symbols-outlined text-[24px]">warning</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                {description}
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
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-red-700 transition-colors shadow-red-600/20"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;