import React, { useState, useRef } from 'react';
import { ViewState } from '../types';

interface Props {
  mode: 'read-only' | 'edit' | 'create';
  title: string;
  slug: string;
  context?: string;
  onNavigate: (view: ViewState) => void;
  onSave: () => void;
}

const Editor: React.FC<Props> = ({ mode, title: initialTitle, slug: initialSlug, context, onNavigate, onSave }) => {
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [hasForbiddenTags, setHasForbiddenTags] = useState(false);
  const isReadOnly = mode === 'read-only';
  
  // Use a ref to access the current content for saving if needed later
  const editorContentRef = useRef<HTMLDivElement>(null);

  const initialHtmlContent = `
<div class="page-content">
  <!-- Introduction Section -->
  <p class="mb-4 text-lg">
      ${context === 'Taiwan' ? '我們公司成立於1990年...' : 'Founded in 2010, our company set out to redefine...'}
  </p>
  <p class="mb-4">
      We believe in transparent communication...
  </p>
  <!-- Quote Component -->
  <div class="my-6 p-4 bg-slate-50 rounded-lg border-l-4 border-primary">
    <span class="italic text-slate-600">
          "Innovation distinguishes between a leader and a follower."
    </span>
  </div>
</div>`;

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerText;
    // Regex to check for <script or <style tags, case insensitive, allowing whitespace
    const forbiddenPattern = /<\s*(script|style)/i;
    setHasForbiddenTags(forbiddenPattern.test(content));
  };

  return (
    <main className="w-full h-full p-4 md:p-6 pb-20 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-1">
            <span>About Us Page</span>
            {context && <span>/ {context}</span>}
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {mode === 'create' ? 'Create New Content' : 'Content Editor'}
          </h2>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onNavigate(context ? 'LOCAL_LIST' : 'GLOBAL_LIST')}
            className="px-4 py-2 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors text-sm"
          >
            Cancel
          </button>
          {!isReadOnly && (
            <button 
              onClick={onSave}
              disabled={hasForbiddenTags}
              className={`px-4 py-2 rounded-lg font-bold shadow-md transition-all text-sm flex items-center gap-2 ${
                hasForbiddenTags 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                  : 'bg-primary hover:bg-primary-dark text-white shadow-primary/20'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="group">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Page Title</label>
                <input 
                  disabled={isReadOnly}
                  className="w-full text-xl font-bold bg-transparent border-0 border-b border-slate-200 focus:border-primary focus:ring-0 px-0 py-2 placeholder-slate-300 transition-colors text-slate-900 disabled:opacity-70" 
                  placeholder="Enter page title" 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-3">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">HTML Content</label>
                  {isReadOnly && (
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                      <span className="material-symbols-outlined text-[14px]">lock</span> Read Only
                    </span>
                  )}
                </div>
                
                {/* Warning / Info Box */}
                {hasForbiddenTags ? (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="material-symbols-outlined text-red-500 text-xl icon-filled">error</span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-bold text-red-800">Security Warning</h3>
                        <p className="text-sm text-red-700 mt-1">
                          For security reasons, <code>&lt;script&gt;</code> and <code>&lt;style&gt;</code> tags are strictly forbidden. Please remove them to save your changes.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r shadow-sm">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="material-symbols-outlined text-orange-400 text-xl">info</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-orange-700">
                          <span className="font-bold">HTML only.</span> Please do not include <code>&lt;script&gt;</code> or <code>&lt;style&gt;</code> tags here.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Simulated Code Editor */}
                <div className={`border rounded-lg overflow-hidden flex flex-col min-h-[500px] shadow-sm bg-white font-mono text-sm transition-colors ${hasForbiddenTags ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-300'}`}>
                  <div className="flex items-center bg-[#f3f3f3] border-b border-slate-300">
                    <div className="px-4 py-2 bg-white border-r border-slate-300 text-xs text-slate-700 border-t-2 border-t-primary flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-orange-600">code</span>
                      source.html
                    </div>
                  </div>
                  <div className="flex flex-1 overflow-hidden relative group">
                    <div className="w-12 bg-[#f0f0f0] border-r border-slate-200 text-slate-400 text-right pr-3 pt-4 select-none leading-6 text-[13px] font-mono flex-shrink-0 z-10">
                      {Array.from({length: 30}, (_, i) => <div key={i}>{i + 1}</div>)}
                    </div>
                    <div 
                      ref={editorContentRef}
                      className="flex-1 p-4 overflow-auto bg-white text-[#24292e] leading-6 whitespace-pre font-mono text-[13px] outline-none"
                      contentEditable={!isReadOnly}
                      spellCheck={false}
                      onInput={handleEditorInput}
                      suppressContentEditableWarning={true}
                    >
                      {initialHtmlContent.trim()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <span className="material-symbols-outlined text-[20px]">javascript</span>
                <h3>Scripts & Styles</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-100">
                  <span className="material-symbols-outlined text-[14px] mr-1.5">css</span>
                  <span>main-theme.css</span>
                  <button className="ml-1.5 text-blue-400 hover:text-blue-600"><span className="material-symbols-outlined text-[14px]">close</span></button>
                </div>
                 <div className="inline-flex items-center bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded border border-yellow-100">
                  <span className="material-symbols-outlined text-[14px] mr-1.5">javascript</span>
                  <span>analytics-core.js</span>
                   <button className="ml-1.5 text-yellow-400 hover:text-yellow-600"><span className="material-symbols-outlined text-[14px]">close</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">visibility</span>
              Publishing
            </h3>
            <div className="flex items-center justify-between mb-6 p-3 bg-background-light rounded-lg">
              <span className="text-sm font-medium text-slate-700">Visible to Public</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="space-y-4 pt-4 border-t border-slate-100">
               <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Last updated</label>
                <div className="text-sm text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
                  Oct 24, 2023 at 4:30 PM
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
               <span className="material-symbols-outlined text-[18px] text-primary">tune</span>
               Attributes
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">URL Path</label>
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-xs">
                    {context === 'Taiwan' ? '/tw/about/' : '/about/'}
                  </span>
                  <input 
                    type="text" 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    disabled={isReadOnly}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-slate-300 text-sm focus:ring-primary focus:border-primary disabled:bg-slate-50" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Country/Region</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                   <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">Selected: {context || 'Global'}</span>
                    <span className="material-symbols-outlined text-[18px] text-slate-400">lock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Editor;