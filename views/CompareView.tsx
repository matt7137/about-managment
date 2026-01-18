import React from 'react';
import { ViewState } from '../types';

interface Props {
  onNavigate: (view: ViewState) => void;
  onSave: () => void;
}

const CompareView: React.FC<Props> = ({ onNavigate, onSave }) => {
  return (
    <main className="flex flex-col h-screen w-full gap-4 p-4 md:p-6 lg:px-8 overflow-hidden bg-background-light">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('LOCAL_LIST')}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Compare: About Us
              </h1>
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                Taiwan (TW)
              </span>
            </div>
            <p className="text-sm text-slate-500 font-normal mt-1">
              Reviewing local overrides against Global Master (v4.2).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 mr-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <span className="block h-3 w-3 rounded bg-red-100 border border-red-200"></span>
              <span>Removed</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="block h-3 w-3 rounded bg-emerald-100 border border-emerald-200"></span>
              <span>Added</span>
            </div>
          </div>
          
          <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1 shadow-sm mr-2">
             <button 
                className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                title="Discard all changes and match Global"
             >
                <span className="material-symbols-outlined text-[18px]">close</span>
                Reject All
             </button>
             <div className="w-px h-4 bg-slate-200 mx-1"></div>
             <button 
                className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                title="Keep all current local overrides"
             >
                <span className="material-symbols-outlined text-[18px]">done_all</span>
                Accept All
             </button>
          </div>

          <button 
            onClick={onSave}
            className="group flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-dark active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Changes
          </button>
        </div>
      </div>

      {/* Comparison Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 pb-2">
        {/* Left Pane (Global) */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500 text-[18px]">public</span>
              <span className="text-sm font-bold text-slate-900">Global Source</span>
              <span className="ml-2 rounded text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200 px-1.5 py-0.5">Read Only</span>
            </div>
            <span className="text-xs font-mono text-slate-400">last_modified: 2h ago</span>
          </div>
          <div className="relative flex-1 overflow-auto bg-[#fafafa] font-mono text-sm leading-6">
            <div className="flex min-h-full">
              <div className="flex flex-col items-end gap-0 border-r border-slate-200 bg-slate-50 py-4 px-3 text-xs text-slate-400 select-none">
                {Array.from({length: 16}, (_, i) => <span key={i}>{i+1}</span>)}
              </div>
              <div className="flex-1 py-4 w-full">
                 <div className="px-4 whitespace-pre hover:bg-slate-100 text-slate-600">&lt;section class="hero-section"&gt;</div>
                 <div className="px-4 whitespace-pre hover:bg-slate-100 text-slate-600">  &lt;div class="container mx-auto px-4"&gt;</div>
                 <div className="px-4 whitespace-pre bg-red-50 border-l-2 border-red-400 text-red-900 font-bold">  &lt;h1 class="text-4xl"&gt;About Our Company&lt;/h1&gt;</div>
                 <div className="px-4 whitespace-pre bg-red-50 border-l-2 border-red-400 text-red-900 font-bold">  &lt;p&gt;Innovating for a better future since 1995.&lt;/p&gt;</div>
                 <div className="px-4 whitespace-pre hover:bg-slate-100 text-slate-600">  &lt;/div&gt;</div>
                 <div className="px-4 whitespace-pre hover:bg-slate-100 text-slate-600">&lt;/section&gt;</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane (Local) */}
        <div className="flex flex-col overflow-hidden rounded-xl border-2 border-primary/20 bg-white shadow-sm relative">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">edit_note</span>
              <span className="text-sm font-bold text-slate-900">Local Version (Taiwan)</span>
              <span className="ml-2 rounded text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5">Editable</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">Wrap Text</button>
            </div>
          </div>
          <div className="relative flex-1 overflow-auto bg-[#fafafa] font-mono text-sm leading-6">
            <div className="flex min-h-full">
              <div className="flex flex-col items-end gap-0 border-r border-slate-200 bg-slate-50 py-4 px-3 text-xs text-slate-400 select-none">
                 {Array.from({length: 16}, (_, i) => <span key={i}>{i+1}</span>)}
              </div>
              <div className="flex-1 py-4 w-full outline-none" contentEditable spellCheck={false}>
                 <div className="px-4 whitespace-pre hover:bg-slate-100 text-slate-600">&lt;section class="hero-section"&gt;</div>
                 <div className="px-4 whitespace-pre hover:bg-slate-100 text-slate-600">  &lt;div class="container mx-auto px-4"&gt;</div>
                 <div className="px-4 whitespace-pre bg-emerald-50 border-l-2 border-emerald-500 text-emerald-900 font-bold">  &lt;h1 class="text-4xl"&gt;關於我們公司&lt;/h1&gt;</div>
                 <div className="px-4 whitespace-pre bg-emerald-50 border-l-2 border-emerald-500 text-emerald-900 font-bold">  &lt;p&gt;自 1995 年以來為更美好的未來而創新。&lt;/p&gt;</div>
                 <div className="px-4 whitespace-pre hover:bg-slate-100 text-slate-600">  &lt;/div&gt;</div>
                 <div className="px-4 whitespace-pre hover:bg-slate-100 text-slate-600">&lt;/section&gt;</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CompareView;