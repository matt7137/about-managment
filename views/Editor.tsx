import React, { useState, useRef, useEffect } from 'react';
import { ViewState } from '../types';

interface Props {
  mode: 'read-only' | 'edit' | 'create';
  title: string;
  slug: string;
  context?: string;
  onNavigate: (view: ViewState) => void;
  onSave: () => void;
  onPublish?: () => void;
}

interface Resource {
  id: string;
  name: string;
  type: 'css' | 'js';
}

const AVAILABLE_RESOURCES: Resource[] = [
  { id: 'css-1', name: 'main-theme.css', type: 'css' },
  { id: 'css-2', name: 'typography-base.css', type: 'css' },
  { id: 'css-3', name: 'grid-layout.css', type: 'css' },
  { id: 'css-4', name: 'dark-mode.css', type: 'css' },
  { id: 'js-1', name: 'analytics-core.js', type: 'js' },
  { id: 'js-2', name: 'slider-component.js', type: 'js' },
  { id: 'js-3', name: 'form-validation.js', type: 'js' },
  { id: 'js-4', name: 'marketing-tracker.js', type: 'js' },
  { id: 'js-5', name: 'interactive-maps.js', type: 'js' },
];

const Editor: React.FC<Props> = ({ mode, title: initialTitle, slug: initialSlug, context, onNavigate, onSave, onPublish }) => {
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [hasForbiddenTags, setHasForbiddenTags] = useState(false);
  const isReadOnly = mode === 'read-only';
  
  // Script & Style State
  const [attachedResources, setAttachedResources] = useState<Resource[]>([
    { id: 'css-1', name: 'main-theme.css', type: 'css' },
    { id: 'js-1', name: 'analytics-core.js', type: 'js' }
  ]);
  const [resourceSearch, setResourceSearch] = useState('');
  const [isResourceDropdownOpen, setIsResourceDropdownOpen] = useState(false);
  const resourceDropdownRef = useRef<HTMLDivElement>(null);

  // Security check: Block ONLY if forbidden tags exist in the HTML content.
  // Attached resources via the UI are explicitly allowed.
  const hasSecurityIssues = hasForbiddenTags;

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

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resourceDropdownRef.current && !resourceDropdownRef.current.contains(event.target as Node)) {
        setIsResourceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerText;
    // Regex to check for <script, <style, <link tags, OR inline style="..." attributes
    // Matches: <script, <style, <link, style="...", style='...'
    // This covers <link rel="stylesheet"> and <script src="..."> cases
    const forbiddenPattern = /<\s*(script|style|link)|style\s*=\s*['"]/i;
    setHasForbiddenTags(forbiddenPattern.test(content));
  };

  const addResource = (resource: Resource) => {
    setAttachedResources([...attachedResources, resource]);
    setResourceSearch('');
    setIsResourceDropdownOpen(false);
  };

  const removeResource = (id: string) => {
    setAttachedResources(attachedResources.filter(r => r.id !== id));
  };

  const filteredResources = AVAILABLE_RESOURCES.filter(r => 
    r.name.toLowerCase().includes(resourceSearch.toLowerCase()) && 
    !attachedResources.find(ar => ar.id === r.id)
  );

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
            <>
              <button 
                onClick={onSave}
                disabled={hasSecurityIssues}
                className={`px-4 py-2 rounded-lg font-bold shadow-md transition-all text-sm flex items-center gap-2 ${
                  hasSecurityIssues 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save Draft
              </button>

              {onPublish && (
                <button 
                  onClick={onPublish}
                  disabled={hasSecurityIssues}
                  className={`px-4 py-2 rounded-lg font-bold shadow-md transition-all text-sm flex items-center gap-2 ${
                    hasSecurityIssues 
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                  Publish
                </button>
              )}
            </>
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
                {hasSecurityIssues ? (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="material-symbols-outlined text-red-500 text-xl icon-filled">error</span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-bold text-red-800">Security Warning</h3>
                        <div className="text-sm text-red-700 mt-1 space-y-1">
                          <p>Directly embedding scripts or styles in the HTML editor is forbidden.</p>
                          <ul className="list-disc pl-4 space-y-0.5">
                            <li><code>&lt;script&gt;</code>, <code>&lt;style&gt;</code>, or <code>&lt;link&gt;</code> tags</li>
                            <li>Inline <code>style="..."</code> attributes</li>
                          </ul>
                          <p className="mt-2 font-medium">Please remove these tags. Use the "Scripts & Styles" panel below to attach approved resources.</p>
                        </div>
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
                          <span className="font-bold">HTML only.</span> To add CSS or JS, please use the <strong>Scripts & Styles</strong> section below.
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
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-visible relative">
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <span className="material-symbols-outlined text-[20px]">javascript</span>
                <h3>Scripts & Styles</h3>
              </div>
            </div>
            <div className="p-6">
              
              {!isReadOnly && (
                <div className="relative mb-4" ref={resourceDropdownRef}>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
                        </div>
                        <input 
                            type="text"
                            className="block w-full rounded-lg border-slate-200 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-primary focus:ring-primary"
                            placeholder="Search to add CSS or JS files..."
                            value={resourceSearch}
                            onChange={(e) => {
                                setResourceSearch(e.target.value);
                                setIsResourceDropdownOpen(true);
                            }}
                            onFocus={() => setIsResourceDropdownOpen(true)}
                        />
                    </div>
                    {isResourceDropdownOpen && (
                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                             {filteredResources.length > 0 ? (
                                filteredResources.map(resource => (
                                    <button
                                        key={resource.id}
                                        onClick={() => addResource(resource)}
                                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700"
                                    >
                                        <span className={`material-symbols-outlined text-[18px] ${resource.type === 'css' ? 'text-blue-500' : 'text-yellow-500'}`}>
                                            {resource.type === 'css' ? 'css' : 'javascript'}
                                        </span>
                                        <span>{resource.name}</span>
                                    </button>
                                ))
                             ) : (
                                <div className="px-4 py-3 text-sm text-slate-500 text-center">
                                    No available resources found.
                                </div>
                             )}
                        </div>
                    )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {attachedResources.map(resource => (
                    <div 
                        key={resource.id}
                        className={`inline-flex items-center text-xs px-2.5 py-1.5 rounded-lg border transition-all animate-in zoom-in-95 duration-200 ${
                            resource.type === 'css' 
                                ? 'bg-blue-50 text-blue-700 border-blue-100' 
                                : 'bg-yellow-50 text-yellow-800 border-yellow-100'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[16px] mr-1.5 opacity-70">
                            {resource.type === 'css' ? 'css' : 'javascript'}
                        </span>
                        <span className="font-medium">{resource.name}</span>
                        {!isReadOnly && (
                            <button 
                                onClick={() => removeResource(resource.id)}
                                className={`ml-2 rounded-full p-0.5 hover:bg-black/10 transition-colors ${
                                    resource.type === 'css' ? 'text-blue-500' : 'text-yellow-600'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[14px] block">close</span>
                            </button>
                        )}
                    </div>
                ))}
                {attachedResources.length === 0 && (
                    <div className="text-sm text-slate-400 italic py-1">No scripts or styles attached.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">
                {context ? 'info' : 'public'}
              </span>
              {context ? 'Page Info' : 'Global Settings'}
            </h3>
            
            {/* Global Context: Allow Local Translation Switch */}
            {!context && (
                <div className="flex items-center justify-between mb-6 p-3 bg-background-light rounded-lg">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700">
                    Allow Local Translation
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight mt-0.5">Enable regions to translate this page</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked disabled={isReadOnly} />
                    <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isReadOnly ? 'opacity-50' : 'peer-checked:bg-primary'}`}></div>
                </label>
                </div>
            )}

            <div className={`space-y-4 ${!context ? 'pt-4 border-t border-slate-100' : ''}`}>
               <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Last updated</label>
                <div className="text-sm text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
                  Oct 24, 2023 at 4:30 PM
                </div>
              </div>
              
               {/* Local Context: Display Status instead of toggle */}
               {context && (
                  <div>
                     <label className="block text-xs font-medium text-slate-500 mb-1.5">Status</label>
                     <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${isReadOnly ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${isReadOnly ? 'bg-emerald-500' : 'bg-yellow-500'}`}></span>
                        {isReadOnly ? 'Published' : 'Draft'}
                     </div>
                  </div>
               )}
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