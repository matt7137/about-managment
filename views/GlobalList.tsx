import React, { useState } from 'react';
import { ViewState, MOCK_DATA_GLOBAL } from '../types';
import ContextSwitcher from '../components/ContextSwitcher';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

interface Props {
  onNavigate: (view: ViewState) => void;
}

const GlobalList: React.FC<Props> = ({ onNavigate }) => {
  const [activeDropdown, setActiveDropdown] = useState<'filter' | 'sort' | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [openLocalCardSettingsId, setOpenLocalCardSettingsId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const toggleDropdown = (name: 'filter' | 'sort') => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const toggleRow = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const toggleLocalCardSettings = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenLocalCardSettingsId(openLocalCardSettingsId === id ? null : id);
  };

  return (
    <main className="flex min-h-screen w-full flex-col gap-6 p-6 md:p-8 lg:px-12 relative z-10 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-2xl flex-col gap-2">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            About Us Management
          </h1>
          <p className="text-lg text-slate-500 font-normal">
            Manage and localise your company's mission, history, and team pages.
          </p>
        </div>
        <button 
          onClick={() => onNavigate('CREATE')}
          className="group flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-primary/30 active:scale-95 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Page (Global)
        </button>
      </div>

      <div className="flex flex-col gap-6 mt-2">
        {/* Tabs */}
        <div className="border-b border-[#d1e3e5]">
          <div className="flex gap-8">
            <button className="relative flex items-center gap-2 pb-4 text-primary after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-primary after:content-['']">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              <span className="text-sm font-bold tracking-wide">Active Content</span>
              <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-extrabold text-primary">12</span>
            </button>
            <button 
              onClick={() => onNavigate('RECYCLE_BIN')}
              className="group flex items-center gap-2 pb-4 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
              <span className="text-sm font-bold tracking-wide">Recycle Bin</span>
            </button>
          </div>
        </div>

        {/* Filters and Context Switcher */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Context Dropdown (Component) */}
            <ContextSwitcher currentContext="Global" onNavigate={onNavigate} />

            {/* Search */}
            <div className="relative w-full sm:w-64 lg:w-80">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
              </div>
              <input className="block w-full rounded-lg border-0 bg-white py-2.5 pl-10 pr-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" placeholder="Search pages..." type="text" />
            </div>
          </div>
          
          <div className="flex w-full sm:w-auto items-center gap-3 relative z-30">
            {/* Filter Dropdown */}
            <div className="relative flex-1 sm:flex-none">
              <button 
                onClick={() => toggleDropdown('filter')}
                className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold shadow-sm transition-colors ${activeDropdown === 'filter' ? 'bg-primary/10 border-primary text-primary ring-2 ring-primary/20' : 'bg-primary/5 border-primary/30 text-primary hover:bg-primary/10'}`}
              >
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                Filter
                <span className={`material-symbols-outlined text-[18px] transition-transform ${activeDropdown === 'filter' ? 'rotate-180' : ''}`}>expand_less</span>
              </button>
              
              {activeDropdown === 'filter' && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="mb-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-50">Filter by Status</div>
                  {['All Pages', 'Published Only', 'Drafts', 'Scheduled'].map((opt, i) => (
                    <button key={opt} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors ${i === 0 ? 'bg-slate-50 text-slate-900' : ''}`}>
                      {opt}
                      {i === 0 && <span className="material-symbols-outlined text-[16px] text-primary">check</span>}
                    </button>
                  ))}
                  <div className="my-1 border-t border-slate-100"></div>
                  <div className="mb-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Filter by Author</div>
                  <button className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Current User
                  </button>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-none">
              <button 
                onClick={() => toggleDropdown('sort')}
                className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold shadow-sm transition-colors ${activeDropdown === 'sort' ? 'bg-primary/10 border-primary text-primary ring-2 ring-primary/20' : 'bg-primary/5 border-primary/30 text-primary hover:bg-primary/10'}`}
              >
                <span className="material-symbols-outlined text-[20px]">sort</span>
                Sort
                <span className={`material-symbols-outlined text-[18px] transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`}>expand_less</span>
              </button>

              {activeDropdown === 'sort' && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="mb-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-50">Sort Order</div>
                  {[
                    { label: 'Last Modified', icon: 'schedule' },
                    { label: 'Alphabetical (A-Z)', icon: 'sort_by_alpha' },
                    { label: 'Status', icon: 'flag' }
                  ].map((opt, i) => (
                    <button key={opt.label} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors ${i === 0 ? 'bg-slate-50 text-slate-900' : ''}`}>
                      <span className="material-symbols-outlined text-[18px] text-slate-400">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="relative rounded-xl border border-slate-200 bg-white shadow-sm overflow-visible">
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[140px]">Actions</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Page Title</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">URL Slug</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Last Modified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_DATA_GLOBAL.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <tr className={`group hover:bg-slate-50 transition-colors ${expandedRowId === item.id ? 'bg-slate-50 border-l-[3px] border-primary' : ''}`}>
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center justify-start gap-1 relative">
                          <button 
                            onClick={() => onNavigate('EDITOR_GLOBAL')}
                            className="rounded-lg p-2 text-slate-500 hover:bg-primary/10 hover:text-primary transition-colors" title="Edit"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button 
                            onClick={() => setItemToDelete(item.id)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors" 
                            title="Move to Trash"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                          
                          {/* Main Row Settings Button - Now toggles Expansion */}
                          <div className="relative">
                            <button 
                              onClick={() => toggleRow(item.id)}
                              className={`rounded-lg p-2 transition-colors ${expandedRowId === item.id ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`} 
                              title="Settings & Local Availability"
                            >
                              <span className={`material-symbols-outlined text-[20px] ${expandedRowId === item.id ? 'icon-filled' : ''}`}>settings</span>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <div>
                          <div className="text-sm font-bold text-slate-900">{item.title}</div>
                          <div className="text-xs text-slate-500">Master global narrative</div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <code className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 font-mono">{item.slug}</code>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full pl-2.5 pr-2 py-1 text-xs font-bold ring-1 ring-inset transition-all ${
                          item.status === 'Published' 
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' 
                            : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${item.status === 'Published' ? 'bg-emerald-600' : 'bg-yellow-500'}`}></span>
                          {item.status}
                          <span className="material-symbols-outlined text-[16px]">expand_more</span>
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">{item.lastModified}</span>
                          <span className="text-xs text-slate-500">by {item.author}</span>
                        </div>
                      </td>
                    </tr>
                    {expandedRowId === item.id && (
                      <tr className="bg-slate-50 border-b-2 border-slate-100 shadow-inner animate-in fade-in zoom-in-[0.99] duration-200">
                        <td className="px-6 py-0" colSpan={5}>
                          <div className="flex flex-col w-full py-6">
                            
                            {/* Section 1: Page Configuration (Moved from Dropdown) */}
                            <div className="mb-6 px-4">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">tune</span>
                                Page Configuration
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                <button className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                                  <span className="material-symbols-outlined text-[18px]">settings_suggest</span>
                                  Page Properties
                                </button>
                                <button className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                                  <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                                  SEO Settings
                                </button>
                                <button className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                                  <span className="material-symbols-outlined text-[18px]">history</span>
                                  View History
                                </button>
                                <div className="h-auto w-px bg-slate-300 mx-1"></div>
                                <button className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm">
                                  <span className="material-symbols-outlined text-[18px]">unpublished</span>
                                  Unpublish Page
                                </button>
                              </div>
                            </div>

                            <div className="border-t border-slate-200 my-2 mx-4 border-dashed"></div>

                            {/* Section 2: Local Availability (Country List) */}
                            <div className="flex w-full mt-4">
                              <div className="w-[50px] border-r border-dashed border-slate-300 mr-6"></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">public</span>
                                    Local Availability
                                  </h4>
                                  <button className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1 hover:bg-primary/5 px-2 py-1 rounded">
                                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                                    Add Country
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {/* US Card */}
                                  <div className="flex flex-col p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group relative">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-center gap-2.5">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">US</div>
                                        <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">United States</div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                         <button className="flex items-center gap-1 rounded bg-amber-50 px-1.5 py-1 text-amber-700 border border-amber-100" title="AI Translated">
                                          <span className="material-symbols-outlined text-[16px] text-amber-500 icon-filled">auto_awesome</span>
                                          <span className="text-[10px] font-bold">AI</span>
                                        </button>
                                        <button className="rounded p-1 text-slate-300 group-hover:text-primary hover:bg-primary/10 transition-colors">
                                          <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        {/* Nested Settings for US */}
                                        <div className="relative">
                                          <button 
                                            onClick={(e) => toggleLocalCardSettings(e, 'us')}
                                            className={`rounded p-1 transition-colors ${openLocalCardSettingsId === 'us' ? 'bg-primary/10 text-primary' : 'text-slate-300 group-hover:text-primary hover:bg-primary/10'}`}
                                          >
                                            <span className="material-symbols-outlined text-[18px]">settings</span>
                                          </button>
                                          {openLocalCardSettingsId === 'us' && (
                                              <div className="absolute right-0 top-6 z-[120] w-48 rounded-lg border border-slate-100 bg-white p-1 shadow-lg ring-1 ring-slate-900/5 animate-in fade-in zoom-in-95 duration-100">
                                                <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                                  <span className="material-symbols-outlined text-[16px]">edit</span> Edit Content
                                                </button>
                                                 <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                                  <span className="material-symbols-outlined text-[16px]">history</span> View History
                                                </button>
                                                 <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                                                  <span className="material-symbols-outlined text-[16px]">link_off</span> Unlink
                                                </button>
                                              </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Published</span>
                                      <span className="text-[10px] text-slate-500">Updated 2h ago</span>
                                    </div>
                                  </div>
                                  {/* Taiwan Card */}
                                  <div onClick={() => onNavigate('LOCAL_LIST')} className="flex flex-col p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group border-primary/20 ring-1 ring-primary/10 relative">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-center gap-2.5">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-[10px] font-bold text-red-600 border border-red-100">TW</div>
                                        <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Taiwan</div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button className="rounded p-1 text-slate-300 group-hover:text-primary hover:bg-primary/10 transition-colors">
                                          <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        {/* Nested Settings for TW */}
                                        <div className="relative">
                                          <button 
                                            onClick={(e) => toggleLocalCardSettings(e, 'tw')}
                                            className={`rounded p-1 transition-colors ${openLocalCardSettingsId === 'tw' ? 'bg-primary/10 text-primary' : 'text-slate-300 group-hover:text-primary hover:bg-primary/10'}`}
                                          >
                                            <span className="material-symbols-outlined text-[18px]">settings</span>
                                          </button>
                                          {openLocalCardSettingsId === 'tw' && (
                                              <div className="absolute right-0 top-6 z-[120] w-48 rounded-lg border border-slate-100 bg-white p-1 shadow-lg ring-1 ring-slate-900/5 animate-in fade-in zoom-in-95 duration-100">
                                                <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                                  <span className="material-symbols-outlined text-[16px]">edit</span> Edit Content
                                                </button>
                                                 <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                                  <span className="material-symbols-outlined text-[16px]">history</span> View History
                                                </button>
                                                 <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                                                  <span className="material-symbols-outlined text-[16px]">delete</span> Delete
                                                </button>
                                              </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-[10px] font-bold text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Draft</span>
                                      <span className="text-[10px] text-slate-500">Updated 3d ago</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
            <p className="text-sm text-slate-500">
              Showing <span className="font-bold text-slate-900">1</span> to <span className="font-bold text-slate-900">3</span> of <span className="font-bold text-slate-900">12</span> results for <span className="font-bold text-primary">Global</span>
            </p>
            <div className="flex gap-2">
              <button className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>Previous</button>
              <button className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={!!itemToDelete} 
        onClose={() => setItemToDelete(null)}
        onConfirm={() => setItemToDelete(null)}
      />
    </main>
  );
};

export default GlobalList;