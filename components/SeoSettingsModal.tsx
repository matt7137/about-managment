import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  pageTitle: string;
}

const SeoSettingsModal: React.FC<Props> = ({ isOpen, onClose, onSave, pageTitle }) => {
  const [schemaDescription, setSchemaDescription] = useState("Discover our company history, mission, and the team driving innovation.");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleAiGenerate = () => {
    setIsGenerating(true);
    // Simulate AI API call
    setTimeout(() => {
      setSchemaDescription("Official company profile: Established in 1990, we are a global leader in technology innovation, dedicated to transparency and excellence across all our regional teams.");
      setIsGenerating(false);
    }, 1500);
  };

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
                 {schemaDescription}
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
               
               <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="mb-3">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Schema Description</label>
                    <div className="relative">
                      <input 
                          type="text" 
                          className="w-full rounded-lg border-slate-300 focus:border-primary focus:ring-primary text-sm shadow-sm bg-white pr-28"
                          value={schemaDescription}
                          onChange={(e) => setSchemaDescription(e.target.value)}
                          placeholder="Brief description for the schema object"
                      />
                      <button 
                        onClick={handleAiGenerate}
                        disabled={isGenerating}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 transition-colors border border-indigo-100"
                      >
                        {isGenerating ? (
                           <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                        ) : (
                           <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                        )}
                        AI Assist
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded border border-slate-200 p-2 text-xs font-mono text-slate-500">
                      <div className="flex gap-2">
                          <span className="text-slate-400 select-none w-4 text-right">1</span>
                          <span className="text-slate-600">"@context": "https://schema.org",</span>
                      </div>
                      <div className="flex gap-2">
                          <span className="text-slate-400 select-none w-4 text-right">2</span>
                          <span className="text-slate-600">"@type": "Organization",</span>
                      </div>
                      <div className="flex gap-2">
                          <span className="text-slate-400 select-none w-4 text-right">3</span>
                          <span className="text-slate-600">"name": "My Company",</span>
                      </div>
                      <div className="flex gap-2 bg-blue-50 -mx-2 px-2 border-l-2 border-primary">
                          <span className="text-slate-400 select-none w-4 text-right">4</span>
                          <span className="text-slate-900 font-bold truncate">"description": "{schemaDescription}",</span>
                      </div>
                      <div className="flex gap-2">
                          <span className="text-slate-400 select-none w-4 text-right">5</span>
                          <span className="text-slate-600">"url": "https://www.example.com",</span>
                      </div>
                      <div className="flex gap-2">
                          <span className="text-slate-400 select-none w-4 text-right">6</span>
                          <span className="text-slate-600">"logo": "https://www.example.com/logo.png"</span>
                      </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">info</span>
                      Standard fields are automatically populated from global settings.
                  </p>
               </div>
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