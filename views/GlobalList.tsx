import React, { useState, useMemo } from 'react';
import { ViewState, MOCK_DATA_GLOBAL, PageItem } from '../types';
import ContextSwitcher from '../components/ContextSwitcher';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import StatusDropdown from '../components/StatusDropdown';
import StatusChangeModal from '../components/StatusChangeModal';
import ActionButtons from '../components/ActionButtons';
import Tooltip from '../components/Tooltip';
import SeoSettingsModal from '../components/SeoSettingsModal';
import HistoryModal from '../components/HistoryModal';
import AddCountryModal from '../components/AddCountryModal';

interface Props {
  onNavigate: (view: ViewState) => void;
  onEdit: (view: ViewState, item: PageItem) => void;
}

// Helper interface for local regions within global items
interface LocalRegion {
  id: string;
  code: string;
  name: string;
  status: 'Published' | 'Draft';
  lastUpdated: string;
  sourceType: 'ai' | 'copy' | 'empty' | 'manual';
  colorClass: string;
  textClass: string;
}

const GlobalList: React.FC<Props> = ({ onNavigate, onEdit }) => {
  const [activeDropdown, setActiveDropdown] = useState<'filter' | 'sort' | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [openLocalCardSettingsId, setOpenLocalCardSettingsId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  // SEO Modal State
  const [seoModalOpen, setSeoModalOpen] = useState(false);
  const [activeSeoItem, setActiveSeoItem] = useState<{id: string, title: string} | null>(null);

  // History Modal State
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [activeHistoryItem, setActiveHistoryItem] = useState<{id: string, title: string} | null>(null);

  // Add Country Modal State
  const [addCountryModalOpen, setAddCountryModalOpen] = useState(false);
  const [activePageForAdd, setActivePageForAdd] = useState<string | null>(null);

  // Filter & Sort State
  const [filterStatus, setFilterStatus] = useState<'All' | 'Published' | 'Draft'>('All');
  const [sortOption, setSortOption] = useState<'Last Modified' | 'Alphabetical' | 'Status'>('Last Modified');

  // Status Change State
  const [statusToChange, setStatusToChange] = useState<{
    id: string;
    title: string;
    newStatus: 'Published' | 'Draft';
  } | null>(null);

  // Dynamic Regions State (initialized with mock data for ID '1')
  const [pageRegions, setPageRegions] = useState<Record<string, LocalRegion[]>>({
    '1': [
      { 
        id: 'us', code: 'US', name: 'United States', status: 'Published', lastUpdated: 'Updated 2h ago', 
        sourceType: 'ai', colorClass: 'bg-blue-100', textClass: 'text-blue-700' 
      },
      { 
        id: 'tw', code: 'TW', name: 'Taiwan', status: 'Draft', lastUpdated: 'Updated 3d ago', 
        sourceType: 'manual', colorClass: 'bg-red-50 border border-red-100', textClass: 'text-red-600' 
      }
    ]
  });

  // Derived Data (Filter & Sort)
  const processedData = useMemo(() => {
    let data = [...MOCK_DATA_GLOBAL];

    // Filter
    if (filterStatus !== 'All') {
      data = data.filter(item => item.status === filterStatus);
    }

    // Sort
    data.sort((a, b) => {
      switch (sortOption) {
        case 'Alphabetical':
          return a.title.localeCompare(b.title);
        case 'Status':
          return a.status.localeCompare(b.status);
        case 'Last Modified':
        default:
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      }
    });

    return data;
  }, [filterStatus, sortOption]);

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

  const handleStatusSelect = (id: string, title: string, newStatus: 'Published' | 'Draft') => {
    setStatusToChange({ id, title, newStatus });
  };

  const confirmStatusChange = () => {
    console.log(`Changing status of ${statusToChange?.id} to ${statusToChange?.newStatus}`);
    setStatusToChange(null);
  };

  const openSeoSettings = (item: PageItem) => {
    setActiveSeoItem({ id: item.id, title: item.title });
    setSeoModalOpen(true);
  };

  const openHistory = (item: PageItem, context?: string) => {
    setActiveHistoryItem({ id: item.id, title: context ? `${item.title} (${context})` : item.title });
    setHistoryModalOpen(true);
  };

  const handleAddCountryClick = (pageId: string) => {
    setActivePageForAdd(pageId);
    setAddCountryModalOpen(true);
  };

  const handleAddCountryConfirm = (data: { countryCode: string; countryName: string; method: 'ai' | 'copy' }) => {
    if (!activePageForAdd) return;

    const newRegion: LocalRegion = {
      id: `${activePageForAdd}-${data.countryCode.toLowerCase()}`,
      code: data.countryCode,
      name: data.countryName,
      status: 'Draft',
      lastUpdated: 'Just now',
      sourceType: data.method,
      colorClass: 'bg-slate-100', // Default neutral
      textClass: 'text-slate-700'
    };

    // Helper to get color styles based on code (simplified mock)
    if (data.countryCode === 'DE') { newRegion.colorClass = 'bg-yellow-100'; newRegion.textClass = 'text-yellow-800'; }
    if (data.countryCode === 'FR') { newRegion.colorClass = 'bg-blue-50 border border-blue-100'; newRegion.textClass = 'text-blue-700'; }
    if (data.countryCode === 'JP') { newRegion.colorClass = 'bg-red-50 border border-red-100'; newRegion.textClass = 'text-red-700'; }

    setPageRegions(prev => ({
      ...prev,
      [activePageForAdd]: [...(prev[activePageForAdd] || []), newRegion]
    }));
    
    setAddCountryModalOpen(false);
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
        <Tooltip content="Create a new global page">
          <button 
            onClick={() => onNavigate('CREATE')}
            className="group flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-primary/30 active:scale-95 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create Page (Global)
          </button>
        </Tooltip>
      </div>

      <div className="flex flex-col gap-6 mt-2">
        {/* Tabs */}
        <div className="border-b border-[#d1e3e5]">
          <div className="flex gap-8">
            <button className="relative flex items-center gap-2 pb-4 text-primary after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-primary after:content-['']">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              <span className="text-sm font-bold tracking-wide">Active Content</span>
              <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-extrabold text-primary">{processedData.length}</span>
            </button>
            <Tooltip content="View deleted pages">
              <button 
                onClick={() => onNavigate('RECYCLE_BIN')}
                className="group flex items-center gap-2 pb-4 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
                <span className="text-sm font-bold tracking-wide">Recycle Bin</span>
              </button>
            </Tooltip>
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
              <Tooltip content="Filter pages by status">
                <button 
                  onClick={() => toggleDropdown('filter')}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold shadow-sm transition-colors ${activeDropdown === 'filter' ? 'bg-primary/10 border-primary text-primary ring-2 ring-primary/20' : 'bg-primary/5 border-primary/30 text-primary hover:bg-primary/10'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  Filter
                  {filterStatus !== 'All' && <span className="ml-1 rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px]">{filterStatus}</span>}
                  <span className={`material-symbols-outlined text-[18px] transition-transform ${activeDropdown === 'filter' ? 'rotate-180' : ''}`}>expand_less</span>
                </button>
              </Tooltip>
              
              {activeDropdown === 'filter' && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="mb-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-50">Filter by Status</div>
                  {['All', 'Published', 'Draft'].map((opt) => (
                    <button 
                      key={opt} 
                      onClick={() => { setFilterStatus(opt as any); setActiveDropdown(null); }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${filterStatus === opt ? 'bg-slate-50 text-slate-900' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      {opt === 'All' ? 'All Pages' : opt}
                      {filterStatus === opt && <span className="material-symbols-outlined text-[16px] text-primary">check</span>}
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
              <Tooltip content="Sort pages">
                <button 
                  onClick={() => toggleDropdown('sort')}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold shadow-sm transition-colors ${activeDropdown === 'sort' ? 'bg-primary/10 border-primary text-primary ring-2 ring-primary/20' : 'bg-primary/5 border-primary/30 text-primary hover:bg-primary/10'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">sort</span>
                  Sort
                  <span className={`material-symbols-outlined text-[18px] transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`}>expand_less</span>
                </button>
              </Tooltip>

              {activeDropdown === 'sort' && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="mb-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-50">Sort Order</div>
                  {[
                    { label: 'Last Modified', icon: 'schedule' },
                    { label: 'Alphabetical', icon: 'sort_by_alpha' },
                    { label: 'Status', icon: 'flag' }
                  ].map((opt) => (
                    <button 
                      key={opt.label} 
                      onClick={() => { setSortOption(opt.label as any); setActiveDropdown(null); }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${sortOption === opt.label ? 'bg-slate-50 text-slate-900' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[18px] text-slate-400">{opt.icon}</span>
                        {opt.label}
                      </div>
                      {sortOption === opt.label && <span className="material-symbols-outlined text-[16px] text-primary">check</span>}
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
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[160px]">Actions</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Page Title</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">URL Slug</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Last Modified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processedData.length > 0 ? processedData.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className={`group hover:bg-slate-50 transition-colors ${expandedRowId === item.id ? 'bg-slate-50 border-l-[3px] border-primary' : ''}`}>
                      <td className="whitespace-nowrap px-6 py-5">
                        <ActionButtons
                          onEdit={() => onEdit('EDITOR_GLOBAL', item)}
                          onDelete={() => setItemToDelete(item.id)}
                          onSettings={() => toggleRow(item.id)}
                          onPreview={() => console.log('Previewing item', item.id)}
                          isExpanded={expandedRowId === item.id}
                          tooltips={{
                            edit: "Edit Global Content",
                            delete: "Move to Trash",
                            settings: "Configure Page & Regions",
                            preview: "Preview Page"
                          }}
                        />
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
                        <StatusDropdown 
                          currentStatus={item.status}
                          onSelectStatus={(newStatus) => handleStatusSelect(item.id, item.title, newStatus)}
                        />
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
                            
                            {/* Section 1: Page Configuration */}
                            <div className="mb-6 px-4">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">tune</span>
                                Page Configuration
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                <button 
                                  onClick={() => openSeoSettings(item)}
                                  className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                                >
                                  <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                                  SEO Settings
                                </button>
                                <button 
                                    onClick={() => openHistory(item)}
                                    className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                                >
                                  <span className="material-symbols-outlined text-[18px]">history</span>
                                  View History
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
                                  <button 
                                    onClick={() => handleAddCountryClick(item.id)}
                                    className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1 hover:bg-primary/5 px-2 py-1 rounded"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                                    Add Country
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {/* Dynamic Regions Render */}
                                  {pageRegions[item.id]?.map((region) => (
                                    <div 
                                      key={region.id}
                                      onClick={() => onNavigate('LOCAL_LIST')}
                                      className="flex flex-col p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group relative"
                                    >
                                      <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2.5">
                                          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${region.colorClass} ${region.textClass}`}>
                                            {region.code}
                                          </div>
                                          <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{region.name}</div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          {(region.sourceType === 'ai' || region.sourceType === 'copy') && (
                                            <Tooltip content={region.sourceType === 'ai' ? "AI Translated" : "Cloned from Global"}>
                                              <button className={`flex items-center gap-1 rounded px-1.5 py-1 text-[10px] font-bold border ${region.sourceType === 'ai' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                <span className="material-symbols-outlined text-[16px] icon-filled">{region.sourceType === 'ai' ? 'auto_awesome' : 'content_copy'}</span>
                                                {region.sourceType === 'ai' ? 'AI' : 'Copy'}
                                              </button>
                                            </Tooltip>
                                          )}
                                          
                                          <Tooltip content="Edit Local Content">
                                            <button 
                                              className="rounded p-1 text-slate-300 group-hover:text-primary hover:bg-primary/10 transition-colors"
                                            >
                                              <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                          </Tooltip>

                                          {/* Nested Settings for Region */}
                                          <div className="relative">
                                            <Tooltip content="Regional Settings">
                                              <button 
                                                onClick={(e) => toggleLocalCardSettings(e, region.id)}
                                                className={`rounded p-1 transition-colors ${openLocalCardSettingsId === region.id ? 'bg-primary/10 text-primary' : 'text-slate-300 group-hover:text-primary hover:bg-primary/10'}`}
                                              >
                                                <span className="material-symbols-outlined text-[18px]">settings</span>
                                              </button>
                                            </Tooltip>
                                            {openLocalCardSettingsId === region.id && (
                                                <div className="absolute right-0 top-6 z-[120] w-48 rounded-lg border border-slate-100 bg-white p-1 shadow-lg ring-1 ring-slate-900/5 animate-in fade-in zoom-in-95 duration-100">
                                                  <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                                    <span className="material-symbols-outlined text-[16px]">edit</span> Edit Content
                                                  </button>
                                                  <button 
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          openHistory(item, region.name);
                                                          setOpenLocalCardSettingsId(null);
                                                      }}
                                                      className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                                  >
                                                    <span className="material-symbols-outlined text-[16px]">history</span> View History
                                                  </button>
                                                  <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                                                    <span className="material-symbols-outlined text-[16px]">link_off</span> Unlink / Delete
                                                  </button>
                                                </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between mt-auto">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${region.status === 'Published' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'}`}>
                                          {region.status}
                                        </span>
                                        <span className="text-[10px] text-slate-500">{region.lastUpdated}</span>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {/* Empty State if no regions */}
                                  {(!pageRegions[item.id] || pageRegions[item.id].length === 0) && (
                                    <div 
                                      onClick={() => handleAddCountryClick(item.id)}
                                      className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-slate-50 transition-all cursor-pointer text-slate-400 hover:text-primary gap-2"
                                    >
                                      <span className="material-symbols-outlined text-[24px]">add_location_alt</span>
                                      <span className="text-sm font-bold">Add First Region</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )) : (
                   <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      No pages found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
             <p className="text-sm text-slate-500">
              Showing <span className="font-bold text-slate-900">{processedData.length > 0 ? 1 : 0}</span> to <span className="font-bold text-slate-900">{Math.min(3, processedData.length)}</span> of <span className="font-bold text-slate-900">{processedData.length}</span> results for <span className="font-bold text-primary">Global</span>
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

      {/* Status Change Confirmation Modal */}
      <StatusChangeModal 
        isOpen={!!statusToChange}
        itemTitle={statusToChange?.title || ''}
        newStatus={statusToChange?.newStatus || 'Draft'}
        onClose={() => setStatusToChange(null)}
        onConfirm={confirmStatusChange}
      />

      {/* SEO Settings Modal */}
      <SeoSettingsModal 
        isOpen={seoModalOpen}
        onClose={() => setSeoModalOpen(false)}
        onSave={() => {
            console.log('Saved SEO settings for', activeSeoItem);
            setSeoModalOpen(false);
        }}
        pageTitle={activeSeoItem?.title || ''}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        pageTitle={activeHistoryItem?.title || ''}
        onRestore={(version) => {
            console.log(`Restoring version ${version} for ${activeHistoryItem?.title}`);
            setHistoryModalOpen(false);
        }}
      />

      {/* Add Country Modal */}
      <AddCountryModal 
        isOpen={addCountryModalOpen}
        onClose={() => setAddCountryModalOpen(false)}
        onConfirm={handleAddCountryConfirm}
      />
    </main>
  );
};

export default GlobalList;