import React, { useState, useMemo } from 'react';
import { ViewState, MOCK_DATA_LOCAL } from '../types';
import ContextSwitcher from '../components/ContextSwitcher';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import StatusDropdown from '../components/StatusDropdown';
import StatusChangeModal from '../components/StatusChangeModal';

interface Props {
  onNavigate: (view: ViewState) => void;
}

const LocalList: React.FC<Props> = ({ onNavigate }) => {
  const [activeDropdown, setActiveDropdown] = useState<'filter' | 'sort' | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [isSyncPanelOpen, setIsSyncPanelOpen] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Filter & Sort State
  const [filterType, setFilterType] = useState<'All' | 'Synced' | 'Overridden' | 'Local'>('All');
  const [sortOption, setSortOption] = useState<'Last Modified' | 'Title' | 'Sync Status'>('Last Modified');

  // Status Change State
  const [statusToChange, setStatusToChange] = useState<{
    id: string;
    title: string;
    newStatus: 'Published' | 'Draft';
  } | null>(null);

  // Derived Data
  const processedData = useMemo(() => {
    let data = [...MOCK_DATA_LOCAL];

    // Filter
    if (filterType !== 'All') {
      data = data.filter(item => {
        if (filterType === 'Synced') return item.syncStatus === 'Synced';
        if (filterType === 'Overridden') return item.syncStatus === 'Overridden';
        if (filterType === 'Local') return item.syncStatus === 'Local';
        return true;
      });
    }

    // Sort
    data.sort((a, b) => {
      switch (sortOption) {
        case 'Title':
          return a.title.localeCompare(b.title);
        case 'Sync Status':
           const statusOrder: Record<string, number> = { 'Synced': 1, 'Overridden': 2, 'Local': 3 };
           const aStatus = a.syncStatus || 'Local';
           const bStatus = b.syncStatus || 'Local';
           return (statusOrder[aStatus] || 99) - (statusOrder[bStatus] || 99);
        case 'Last Modified':
        default:
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      }
    });

    return data;
  }, [filterType, sortOption]);

  const toggleDropdown = (name: 'filter' | 'sort') => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const toggleRow = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const handleStatusSelect = (id: string, title: string, newStatus: 'Published' | 'Draft') => {
    setStatusToChange({ id, title, newStatus });
  };

  const confirmStatusChange = () => {
    console.log(`Changing status of ${statusToChange?.id} to ${statusToChange?.newStatus}`);
    setStatusToChange(null);
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
            Manage local content and translations for the <span className="font-bold text-slate-900">Taiwan</span> region.
          </p>
        </div>
        <button 
          onClick={() => onNavigate('CREATE')}
          className="group flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-primary/30 active:scale-95 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Page (Local)
        </button>
      </div>

      <div className="flex flex-col gap-6 mt-2">
        {/* Tabs */}
        <div className="border-b border-[#d1e3e5]">
          <div className="flex gap-8">
            <button className="relative flex items-center gap-2 pb-4 text-primary after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-primary after:content-['']">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              <span className="text-sm font-bold tracking-wide">Taiwan Pages</span>
              <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-extrabold text-primary">{processedData.length}</span>
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
            <ContextSwitcher currentContext="Taiwan" onNavigate={onNavigate} />

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
                className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${activeDropdown === 'filter' ? 'bg-slate-50 border-slate-300 text-slate-900' : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'}`}
             >
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
              Filter
               {filterType !== 'All' && <span className="ml-1 rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px]">{filterType}</span>}
              <span className={`material-symbols-outlined text-[16px] transition-transform ${activeDropdown === 'filter' ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            
            {activeDropdown === 'filter' && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="mb-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-50">Filter Options</div>
                  {['All', 'Synced', 'Overridden', 'Local'].map((opt, i) => (
                    <button 
                      key={opt} 
                      onClick={() => { setFilterType(opt as any); setActiveDropdown(null); }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${filterType === opt ? 'bg-slate-50 text-slate-900' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      {opt === 'All' ? 'All Items' : opt === 'Local' ? 'Local Only' : opt}
                      {filterType === opt && <span className="material-symbols-outlined text-[16px] text-primary">check</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-none">
             <button 
                onClick={() => toggleDropdown('sort')}
                className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${activeDropdown === 'sort' ? 'bg-slate-50 border-slate-300 text-slate-900' : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'}`}
             >
              <span className="material-symbols-outlined text-[20px]">sort</span>
              Sort
              <span className={`material-symbols-outlined text-[16px] transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`}>expand_more</span>
            </button>

            {activeDropdown === 'sort' && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="mb-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-50">Sort By</div>
                   {[
                    { label: 'Last Modified', icon: 'update' },
                    { label: 'Title', icon: 'sort_by_alpha' },
                    { label: 'Sync Status', icon: 'sync_alt' }
                  ].map((opt, i) => (
                    <button 
                      key={opt.label} 
                      onClick={() => { setSortOption(opt.label as any); setActiveDropdown(null); }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${sortOption === opt.label ? 'bg-slate-50 text-slate-900' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-slate-400">{opt.icon}</span>
                      {opt.label}
                      {sortOption === opt.label && <span className="material-symbols-outlined text-[16px] text-primary ml-auto">check</span>}
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
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Source</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">URL Slug</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Last Modified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processedData.length > 0 ? processedData.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className={`group hover:bg-slate-50 transition-colors ${expandedRowId === item.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}>
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center justify-start gap-1 relative">
                          <button 
                            onClick={() => onNavigate('EDITOR_LOCAL')}
                            className="rounded-lg p-2 text-slate-500 hover:bg-primary/10 hover:text-primary transition-colors" title="Edit"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button 
                            onClick={() => setItemToDelete(item.id)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors" title="Move to Trash"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                          {item.source !== 'Local' && (
                            <button 
                              onClick={() => onNavigate('COMPARE')}
                              className="rounded-lg p-2 text-slate-500 hover:bg-primary/10 hover:text-primary transition-colors" title="Compare with Global"
                            >
                              <span className="material-symbols-outlined text-[20px]">difference</span>
                            </button>
                          )}
                          
                          {/* Settings Button - Now toggles Expansion */}
                          <div className="relative">
                            <button 
                              onClick={() => toggleRow(item.id)}
                              className={`rounded-lg p-2 transition-colors ${expandedRowId === item.id ? 'bg-slate-100 text-slate-700' : 'text-slate-500 hover:bg-slate-100'}`} 
                              title="Settings & Details"
                            >
                              <span className="material-symbols-outlined text-[20px]">settings</span>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <div>
                          <div className="text-sm font-bold text-slate-900">{item.title}</div>
                          <div className="text-xs text-slate-500">{item.source === 'Translated' ? 'Traditional Chinese' : 'Regional Leadership'}</div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                         {item.source === 'Translated' ? (
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                              <span className="material-symbols-outlined text-[18px]">public</span>
                              <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-100 ring-2 ring-white">
                                <span className="material-symbols-outlined text-[10px] text-amber-600">auto_awesome</span>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-900">Translated from Global</span>
                              <div className={`flex items-center gap-1 mt-0.5 ${item.syncStatus === 'Synced' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                <span className="material-symbols-outlined text-[14px]">{item.syncStatus === 'Synced' ? 'check_circle' : 'edit'}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wide">{item.syncStatus === 'Synced' ? 'Auto-synced' : 'Overridden'}</span>
                              </div>
                            </div>
                          </div>
                         ) : (
                           <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                              <span className="material-symbols-outlined text-[18px]">domain</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-900">Local Original</span>
                              <span className="text-[10px] text-slate-500">Created locally</span>
                            </div>
                          </div>
                         )}
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
                       <tr className="bg-slate-50/50 shadow-inner animate-in fade-in zoom-in-[0.99] duration-200">
                        <td className="px-6 py-4" colSpan={6}>
                          <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4">
                            
                            {/* Local Actions Toolbar (Moved from Dropdown) */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                               <div className="flex gap-2">
                                <button className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-primary transition-all shadow-sm">
                                  <span className="material-symbols-outlined text-[18px]">link_off</span>
                                  Unlink
                                </button>
                                <button className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-primary transition-all shadow-sm">
                                  <span className="material-symbols-outlined text-[18px]">history</span>
                                  Translation History
                                </button>
                                <button className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm">
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                  Delete Translation
                                </button>
                              </div>
                            </div>

                            {/* Sync Status Panel */}
                            <div 
                                className="flex items-center justify-between cursor-pointer select-none bg-slate-50 p-3 rounded-lg border border-slate-200/50 hover:border-slate-300 transition-colors"
                                onClick={() => setIsSyncPanelOpen(!isSyncPanelOpen)}
                            >
                              <div className="flex items-center gap-4">
                                <h4 className="text-sm font-bold text-slate-900">Sync Status</h4>
                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Up to date
                                </span>
                                <span className="text-xs text-slate-500">Last synced: 2 hours ago</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-400">
                                <span className="text-xs font-medium">Compare</span>
                                <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${isSyncPanelOpen ? 'rotate-180' : ''}`}>
                                    expand_more
                                </span>
                              </div>
                            </div>
                            
                            {isSyncPanelOpen && (
                                <div className="flex items-start gap-4 animate-in slide-in-from-top-2 duration-200 px-2">
                                  <div className="flex-1">
                                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                                      <span className="material-symbols-outlined text-[16px]">public</span> Global Source (v14)
                                      </div>
                                      <p className="mt-1 text-sm text-slate-900 line-clamp-2">
                                      Our company was founded in 1990 with a mission to innovate and lead the technology sector...
                                      </p>
                                  </div>
                                  <div className="flex items-center justify-center self-center text-slate-400">
                                      <span className="material-symbols-outlined">arrow_forward</span>
                                  </div>
                                  <div className="flex-1">
                                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                                      <span className="material-symbols-outlined text-[16px]">translate</span> Taiwan Translation (v14)
                                      </div>
                                      <p className="mt-1 text-sm text-slate-900 line-clamp-2">
                                      我們公司成立於1990年，其使命是創新並引領科技行業...
                                      </p>
                                  </div>
                                </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No pages found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 rounded-b-xl">
             <p className="text-sm text-slate-500">
              Showing <span className="font-bold text-slate-900">{processedData.length > 0 ? 1 : 0}</span> to <span className="font-bold text-slate-900">{Math.min(3, processedData.length)}</span> of <span className="font-bold text-slate-900">{processedData.length}</span> results for <span className="font-bold text-primary">Taiwan</span>
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
    </main>
  );
};

export default LocalList;