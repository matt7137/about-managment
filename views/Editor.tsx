import React, { useState, useRef, useEffect } from 'react';
import { ViewState } from '../types';
import StatusChangeModal from '../components/StatusChangeModal';

interface Props {
  mode: 'read-only' | 'edit' | 'create';
  title: string;
  slug: string;
  context?: string;
  version?: string;
  onNavigate: (view: ViewState) => void;
  onSave: () => void;
  onPublish?: () => void;
}

interface Resource {
  id: string;
  name: string;
  type: 'css' | 'js';
  origin?: 'system' | 'custom';
}

const AVAILABLE_RESOURCES: Resource[] = [
  { id: 'css-1', name: 'main-theme.css', type: 'css', origin: 'system' },
  { id: 'css-2', name: 'typography-base.css', type: 'css', origin: 'system' },
  { id: 'css-3', name: 'grid-layout.css', type: 'css', origin: 'system' },
  { id: 'css-4', name: 'dark-mode.css', type: 'css', origin: 'system' },
  { id: 'js-1', name: 'analytics-core.js', type: 'js', origin: 'system' },
  { id: 'js-2', name: 'slider-component.js', type: 'js', origin: 'system' },
  { id: 'js-3', name: 'form-validation.js', type: 'js', origin: 'system' },
  { id: 'js-4', name: 'marketing-tracker.js', type: 'js', origin: 'system' },
  { id: 'js-5', name: 'interactive-maps.js', type: 'js', origin: 'system' },
];

const Editor: React.FC<Props> = ({ mode, title: initialTitle, slug: initialSlug, context, version, onNavigate, onSave, onPublish }) => {
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [hasForbiddenTags, setHasForbiddenTags] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const isReadOnly = mode === 'read-only';
  
  // Resources State
  const [headResources, setHeadResources] = useState<Resource[]>([
    { id: 'css-1', name: 'main-theme.css', type: 'css', origin: 'system' },
    { id: 'custom-css-demo', name: 'a7f3e2b9c4d1.css', type: 'css', origin: 'custom' }
  ]);
  const [bodyResources, setBodyResources] = useState<Resource[]>([
    { id: 'js-1', name: 'analytics-core.js', type: 'js', origin: 'system' },
    { id: 'custom-js-demo', name: 'b8d2e5a1c9f3.js', type: 'js', origin: 'custom' }
  ]);

  // Dropdown States
  const [headSearch, setHeadSearch] = useState('');
  const [isHeadDropdownOpen, setIsHeadDropdownOpen] = useState(false);
  const headDropdownRef = useRef<HTMLDivElement>(null);

  const [bodySearch, setBodySearch] = useState('');
  const [isBodyDropdownOpen, setIsBodyDropdownOpen] = useState(false);
  const bodyDropdownRef = useRef<HTMLDivElement>(null);
  
  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security check
  const hasSecurityIssues = hasForbiddenTags;
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

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headDropdownRef.current && !headDropdownRef.current.contains(event.target as Node)) {
        setIsHeadDropdownOpen(false);
      }
      if (bodyDropdownRef.current && !bodyDropdownRef.current.contains(event.target as Node)) {
        setIsBodyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerText;
    const forbiddenPattern = /<\s*(script|style|link)|style\s*=\s*['"]/i;
    setHasForbiddenTags(forbiddenPattern.test(content));
  };

  const handlePublishClick = () => {
    setIsPublishModalOpen(true);
  };

  const confirmPublish = () => {
    if (onPublish) onPublish();
    setIsPublishModalOpen(false);
  };

  // Logic for Head Resources
  const addHeadResource = (resource: Resource) => {
    setHeadResources([...headResources, resource]);
    setHeadSearch('');
    setIsHeadDropdownOpen(false);
  };
  const removeHeadResource = (id: string) => {
    setHeadResources(headResources.filter(r => r.id !== id));
  };
  const filteredHeadResources = AVAILABLE_RESOURCES.filter(r => 
    r.name.toLowerCase().includes(headSearch.toLowerCase()) && 
    !headResources.find(hr => hr.id === r.id) &&
    !bodyResources.find(br => br.id === r.id) // Optionally prevent duplicates across sections
  );

  // Logic for Body Resources
  const addBodyResource = (resource: Resource) => {
    setBodyResources([...bodyResources, resource]);
    setBodySearch('');
    setIsBodyDropdownOpen(false);
  };
  const removeBodyResource = (id: string) => {
    setBodyResources(bodyResources.filter(r => r.id !== id));
  };
  const filteredBodyResources = AVAILABLE_RESOURCES.filter(r => 
    r.name.toLowerCase().includes(bodySearch.toLowerCase()) && 
    !bodyResources.find(br => br.id === r.id) &&
    !headResources.find(hr => hr.id === r.id)
  );

  // Logic for Custom Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const type = file.name.endsWith('.css') ? 'css' : 'js';
      const ext = file.name.split('.').pop() || type;
      
      // Simulate hash generation (12 random hex characters)
      const hash = Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const hashedName = `${hash}.${ext}`;

      const newResource: Resource = {
        id: `custom-${Date.now()}`,
        name: hashedName,
        type: type,
        origin: 'custom'
      };

      if (type === 'css') {
        setHeadResources([...headResources, newResource]);
      } else {
        setBodyResources([...bodyResources, newResource]);
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <main className="w-full p-4 md:p-6 pb-20 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-1">
            <span>About Us Page</span>
            {context && <span>/ {context}</span>}
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {mode === 'create' ? 'Create New Content' : 'Content Editor'}
            </h2>
            {version && (
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ring-1 ring-inset ${isReadOnly ? 'bg-slate-100 text-slate-600 ring-slate-500/10' : 'bg-primary/10 text-primary ring-primary/20'}`}>
                    {version}
                </span>
            )}
          </div>
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
                  onClick={handlePublishClick}
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
                          <span className="font-bold">HTML only.</span> To add CSS or JS, please use the <strong>Scripts & Styles</strong> sections below.
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
          
          {/* Scripts & Styles Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-visible relative">
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 text-slate-700 font-semibold">
              <span className="material-symbols-outlined text-[20px]">javascript</span>
              <h3>Scripts & Styles</h3>
            </div>
            
            <div className="p-6 space-y-8">
              
              {/* 1. HEAD Section */}
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">code_blocks</span>
                        Head (&lt;head&gt;)
                    </h4>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">Loaded First</span>
                </div>
                
                {/* Head Search Dropdown */}
                {!isReadOnly && (
                    <div className="relative mb-3" ref={headDropdownRef}>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
                            </div>
                            <input 
                                type="text"
                                className="block w-full rounded-lg border-slate-200 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-primary focus:ring-primary"
                                placeholder="Add CSS/JS to Head..."
                                value={headSearch}
                                onChange={(e) => {
                                    setHeadSearch(e.target.value);
                                    setIsHeadDropdownOpen(true);
                                }}
                                onFocus={() => setIsHeadDropdownOpen(true)}
                            />
                        </div>
                        {isHeadDropdownOpen && (
                            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                                {filteredHeadResources.length > 0 ? (
                                    filteredHeadResources.map(resource => (
                                        <button
                                            key={resource.id}
                                            onClick={() => addHeadResource(resource)}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700"
                                        >
                                            <span className={`material-symbols-outlined text-[18px] ${resource.type === 'css' ? 'text-blue-500' : 'text-yellow-500'}`}>
                                                {resource.type === 'css' ? 'css' : 'javascript'}
                                            </span>
                                            <span>{resource.name}</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-slate-500 text-center">No available resources.</div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Head List */}
                <div className="flex flex-wrap gap-2 min-h-[36px] bg-slate-50 rounded-lg p-2 border border-slate-200 border-dashed">
                    {headResources.map(resource => (
                        <div key={resource.id} className={`inline-flex items-center text-xs px-2.5 py-1.5 rounded-lg border transition-all animate-in zoom-in-95 duration-200 ${resource.type === 'css' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-yellow-50 text-yellow-800 border-yellow-100'}`}>
                             {resource.origin === 'custom' && <span className="material-symbols-outlined text-[14px] mr-1 text-slate-400" title="Custom Upload">cloud_upload</span>}
                            <span className="material-symbols-outlined text-[16px] mr-1.5 opacity-70">{resource.type === 'css' ? 'css' : 'javascript'}</span>
                            <span className="font-medium">{resource.name}</span>
                            {!isReadOnly && (
                                <button onClick={() => removeHeadResource(resource.id)} className="ml-2 rounded-full p-0.5 hover:bg-black/10 transition-colors">
                                    <span className="material-symbols-outlined text-[14px] block">close</span>
                                </button>
                            )}
                        </div>
                    ))}
                    {headResources.length === 0 && <div className="text-xs text-slate-400 italic py-1 px-1">No resources in &lt;head&gt;.</div>}
                </div>
              </div>

              {/* 2. BODY Section */}
              <div className="relative">
                 <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">html</span>
                        Body (&lt;body&gt;)
                    </h4>
                     <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">Loaded Last</span>
                </div>

                {/* Body Search Dropdown */}
                {!isReadOnly && (
                    <div className="relative mb-3" ref={bodyDropdownRef}>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
                            </div>
                            <input 
                                type="text"
                                className="block w-full rounded-lg border-slate-200 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-primary focus:ring-primary"
                                placeholder="Add JS to Body..."
                                value={bodySearch}
                                onChange={(e) => {
                                    setBodySearch(e.target.value);
                                    setIsBodyDropdownOpen(true);
                                }}
                                onFocus={() => setIsBodyDropdownOpen(true)}
                            />
                        </div>
                        {isBodyDropdownOpen && (
                            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                                {filteredBodyResources.length > 0 ? (
                                    filteredBodyResources.map(resource => (
                                        <button
                                            key={resource.id}
                                            onClick={() => addBodyResource(resource)}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700"
                                        >
                                            <span className={`material-symbols-outlined text-[18px] ${resource.type === 'css' ? 'text-blue-500' : 'text-yellow-500'}`}>
                                                {resource.type === 'css' ? 'css' : 'javascript'}
                                            </span>
                                            <span>{resource.name}</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-slate-500 text-center">No available resources.</div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                 {/* Body List */}
                 <div className="flex flex-wrap gap-2 min-h-[36px] bg-slate-50 rounded-lg p-2 border border-slate-200 border-dashed">
                    {bodyResources.map(resource => (
                        <div key={resource.id} className={`inline-flex items-center text-xs px-2.5 py-1.5 rounded-lg border transition-all animate-in zoom-in-95 duration-200 ${resource.type === 'css' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-yellow-50 text-yellow-800 border-yellow-100'}`}>
                             {resource.origin === 'custom' && <span className="material-symbols-outlined text-[14px] mr-1 text-slate-400" title="Custom Upload">cloud_upload</span>}
                            <span className="material-symbols-outlined text-[16px] mr-1.5 opacity-70">{resource.type === 'css' ? 'css' : 'javascript'}</span>
                            <span className="font-medium">{resource.name}</span>
                            {!isReadOnly && (
                                <button onClick={() => removeBodyResource(resource.id)} className="ml-2 rounded-full p-0.5 hover:bg-black/10 transition-colors">
                                    <span className="material-symbols-outlined text-[14px] block">close</span>
                                </button>
                            )}
                        </div>
                    ))}
                    {bodyResources.length === 0 && <div className="text-xs text-slate-400 italic py-1 px-1">No resources in &lt;body&gt;.</div>}
                </div>
              </div>

              {/* 3. Custom Upload Section */}
              {!isReadOnly && (
                 <div className="relative pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                        Upload Custom Assets
                    </h4>
                    
                    {/* Display existing custom assets */}
                    {(() => {
                        const customAssets = [...headResources, ...bodyResources].filter(r => r.origin === 'custom');
                        if (customAssets.length > 0) {
                            return (
                                <div className="mb-4 bg-slate-50 rounded-lg p-3 border border-slate-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Uploaded Files</p>
                                        <span className="text-[10px] text-slate-400">Auto-hashed filenames</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {customAssets.map(asset => (
                                            <div key={asset.id} className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white shadow-sm text-xs text-slate-700 animate-in zoom-in-95 duration-200">
                                                <span className={`material-symbols-outlined text-[16px] ${asset.type === 'css' ? 'text-blue-500' : 'text-yellow-500'}`}>
                                                    {asset.type === 'css' ? 'css' : 'javascript'}
                                                </span>
                                                <span className="font-mono text-[11px] text-slate-600">{asset.name}</span>
                                                <button 
                                                    onClick={() => asset.type === 'css' ? removeHeadResource(asset.id) : removeBodyResource(asset.id)}
                                                    className="ml-1 text-slate-300 hover:text-red-500 transition-colors"
                                                    title="Remove"
                                                >
                                                    <span className="material-symbols-outlined text-[16px] block">close</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50/50 hover:bg-slate-50 hover:border-primary/50 transition-colors group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <span className="material-symbols-outlined text-slate-400 mb-2 group-hover:text-primary transition-colors">upload_file</span>
                            <p className="mb-1 text-sm text-slate-500"><span className="font-bold text-slate-700 group-hover:text-primary">Click to upload</span> custom JS or CSS</p>
                            <p className="text-xs text-slate-400">.js or .css files only</p>
                        </div>
                        <input 
                            ref={fileInputRef} 
                            type="file" 
                            className="hidden" 
                            accept=".js,.css" 
                            onChange={handleFileUpload}
                        />
                    </label>
                 </div>
              )}
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

      <StatusChangeModal 
        isOpen={isPublishModalOpen}
        itemTitle={title}
        newStatus="Published"
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={confirmPublish}
      />
    </main>
  );
};

export default Editor;