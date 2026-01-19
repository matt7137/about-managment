import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  pageTitle: string;
}

const SeoSettingsModal: React.FC<Props> = ({ isOpen, onClose, onSave, pageTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in zoom-in-95 fade-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">travel_explore</span>
            SEO Settings
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Preview Section */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-bold text-blue-900 mb-2">Search Engine Preview</h4>
            <div className="bg-white p-3 rounded border border-blue-100 shadow-sm max-w-full overflow-hidden">
               <div className="flex items-center gap-1 text-sm text-slate-500 mb-0.5">
                  <span className="material-symbols-outlined text-[14px]">public</span>
                  www.example.com › about
               </div>
               <div className="text-lg text-blue-600 font-medium hover:underline cursor-pointer truncate">{pageTitle} - Company Name</div>
               <div className="text-sm text-slate-600 line-clamp-2">
                 Discover our company history, mission, and the team driving innovation since 1990. We are committed to excellence and transparency.
               </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Meta Title</label>
              <input type="text" defaultValue={pageTitle} className="w-full rounded-lg border-slate-300 focus:border-primary focus:ring-primary text-sm shadow-sm" />
              <p className="mt-1 text-xs text-slate-400">Recommended length: 50-60 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Meta Description</label>
              <textarea rows={3} className="w-full rounded-lg border-slate-300 focus:border-primary focus:ring-primary text-sm shadow-sm" defaultValue="Discover our company history, mission, and the team driving innovation since 1990. We are committed to excellence and transparency."></textarea>
              <p className="mt-1 text-xs text-slate-400">Recommended length: 150-160 characters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Keywords</label>
                  <input type="text" placeholder="company, history, team" className="w-full rounded-lg border-slate-300 focus:border-primary focus:ring-primary text-sm shadow-sm" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Canonical URL</label>
                  <input type="text" placeholder="https://..." className="w-full rounded-lg border-slate-300 focus:border-primary focus:ring-primary text-sm shadow-sm" />
               </div>
            </div>

            {/* Schema Settings */}
            <div className="pt-5 border-t border-slate-100 flex flex-col gap-3">
               <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">schema</span>
                  Schema Markup (JSON-LD)
               </h4>
               <div className="relative">
                  <textarea 
                    rows={6} 
                    className="w-full rounded-lg border-slate-300 focus:border-primary focus:ring-primary text-xs font-mono text-slate-600 shadow-sm bg-slate-50" 
                    placeholder='<script type="application/ld+json">{ ... }</script>'
                    defaultValue={`{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "My Company",
  "url": "https://www.example.com",
  "logo": "https://www.example.com/logo.png"
}`}
                  ></textarea>
                  <div className="absolute top-2 right-2">
                     <span className="text-[10px] font-bold text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-white">JSON</span>
                  </div>
               </div>
               <p className="text-xs text-slate-400">Add structured data to enhance rich results in search engines.</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onSave}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeoSettingsModal;