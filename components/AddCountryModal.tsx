import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { countryCode: string; countryName: string; method: 'ai' | 'copy' }) => void;
}

const AVAILABLE_COUNTRIES = [
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'BR', name: 'Brazil' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
];

const AddCountryModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  const [selectedCountry, setSelectedCountry] = useState(AVAILABLE_COUNTRIES[0].code);
  const [method, setMethod] = useState<'ai' | 'copy'>('ai');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const country = AVAILABLE_COUNTRIES.find(c => c.code === selectedCountry);
    if (country) {
      onConfirm({
        countryCode: country.code,
        countryName: country.name,
        method
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in zoom-in-95 fade-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">public</span>
            Add Local Region
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Region Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Select Region</label>
            <div className="relative">
              <select 
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="block w-full rounded-lg border-slate-300 bg-white py-2.5 pl-3 pr-10 text-slate-900 focus:border-primary focus:ring-primary sm:text-sm shadow-sm"
              >
                {AVAILABLE_COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Content Method */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Initial Content</label>
            <div className="space-y-3">
              <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${method === 'ai' ? 'bg-primary/5 border-primary ring-1 ring-primary/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                <input 
                  type="radio" 
                  name="method" 
                  value="ai" 
                  checked={method === 'ai'} 
                  onChange={() => setMethod('ai')}
                  className="mt-1 h-4 w-4 border-slate-300 text-primary focus:ring-primary" 
                />
                <div className="ml-3">
                  <span className={`block text-sm font-bold ${method === 'ai' ? 'text-primary' : 'text-slate-900'}`}>AI Translation</span>
                  <span className="block text-xs text-slate-500 mt-1">Automatically translate global content to local language. Keeps sync enabled.</span>
                </div>
                <span className="material-symbols-outlined text-primary ml-auto text-[20px] opacity-80">auto_awesome</span>
              </label>

              <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${method === 'copy' ? 'bg-primary/5 border-primary ring-1 ring-primary/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                <input 
                  type="radio" 
                  name="method" 
                  value="copy" 
                  checked={method === 'copy'} 
                  onChange={() => setMethod('copy')}
                  className="mt-1 h-4 w-4 border-slate-300 text-primary focus:ring-primary" 
                />
                <div className="ml-3">
                  <span className={`block text-sm font-bold ${method === 'copy' ? 'text-primary' : 'text-slate-900'}`}>Copy Global Content</span>
                  <span className="block text-xs text-slate-500 mt-1">Start with English content from Global Master.</span>
                </div>
                 <span className="material-symbols-outlined text-slate-400 ml-auto text-[20px]">content_copy</span>
              </label>
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
            onClick={handleSubmit}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Region
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCountryModal;