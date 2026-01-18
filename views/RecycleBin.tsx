import React, { useState, useEffect, useRef } from 'react';
import { ViewState, MOCK_DATA_DELETED } from '../types';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Tooltip from '../components/Tooltip';

interface Props {
  onNavigate: (view: ViewState) => void;
  onRestore: () => void;
}

const RecycleBin: React.FC<Props> = ({ onNavigate, onRestore }) => {
  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    type: 'single' | 'bulk' | 'empty' | null;
  }>({ isOpen: false, type: null });

  // Selection State
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const isAllSelected = MOCK_DATA_DELETED.length > 0 && selectedItems.size === MOCK_DATA_DELETED.length;
  const isIndeterminate = selectedItems.size > 0 && selectedItems.size < MOCK_DATA_DELETED.length;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(MOCK_DATA_DELETED.map(item => item.id));
      setSelectedItems(allIds);
    } else {
      setSelectedItems(new Set());
    }
  };

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const confirmDelete = () => {
    // Here you would implement actual delete logic
    console.log("Delete confirmed for type:", deleteState.type);
    if (deleteState.type === 'bulk') {
        console.log("Deleting items:", Array.from(selectedItems));
        setSelectedItems(new Set());
    }
    setDeleteState({ isOpen: false, type: null });
  };

  const getDeleteModalContent = () => {
    switch (deleteState.type) {
      case 'empty':
        return {
          title: "Empty Recycle Bin?",
          description: "Are you sure you want to permanently delete all items in the recycle bin? This action cannot be undone.",
          confirmText: "Empty Bin"
        };
      case 'bulk':
        return {
          title: `Permanently Delete ${selectedItems.size} Item${selectedItems.size !== 1 ? 's' : ''}?`,
          description: "Are you sure you want to permanently delete the selected items? This action cannot be undone.",
          confirmText: "Delete Forever"
        };
      default:
        return {
          title: "Permanently Delete?",
          description: "Are you sure you want to permanently delete this item? This action cannot be undone.",
          confirmText: "Delete Forever"
        };
    }
  };

  const renderSourceBadge = (source?: string, locale?: string) => {
    if (!source) return null;
    
    const configs = {
      'Global': { icon: 'public', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
      'Translated': { icon: 'translate', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
      'Local': { icon: 'domain', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
    };

    const config = configs[source as keyof typeof configs];
    if (!config) return null;

    return (
       <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold border ${config.bg} ${config.text} ${config.border}`}>
          <span className="material-symbols-outlined text-[14px] leading-none">{config.icon}</span>
          <span className="leading-none">{source}</span>
          {locale && (
             <>
               <span className="mx-0.5 opacity-30 leading-none">|</span>
               <span className="leading-none tracking-wider">{locale}</span>
             </>
          )}
       </span>
    );
  };

  const modalContent = getDeleteModalContent();

  return (
    <main className="flex min-h-screen w-full flex-col gap-6 p-6 md:p-8 lg:px-12 relative pb-24">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-2xl flex-col gap-2">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            About Us - Recycle Bin
          </h1>
          <p className="text-lg text-slate-500 font-normal">
            Recover deleted content or permanently remove items.
          </p>
        </div>
        <Tooltip content="Permanently delete all items">
          <button 
            onClick={() => setDeleteState({ isOpen: true, type: 'empty' })}
            className="group flex items-center justify-center gap-2 rounded-lg bg-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-300 active:scale-95 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
            Empty Recycle Bin
          </button>
        </Tooltip>
      </div>

      <div className="flex flex-col gap-6 mt-2">
        {/* Tabs */}
        <div className="border-b border-[#d1e3e5]">
          <div className="flex gap-8">
            <button 
              onClick={() => onNavigate('GLOBAL_LIST')}
              className="group flex items-center gap-2 pb-4 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              <span className="text-sm font-bold tracking-wide">Active Content</span>
            </button>
            <button className="relative flex items-center gap-2 pb-4 text-red-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-red-600 after:content-['']">
              <span className="material-symbols-outlined text-[20px]">delete</span>
              <span className="text-sm font-bold tracking-wide">Recycle Bin</span>
              <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-extrabold text-red-700">3</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto bg-white px-4 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">Filter Origin:</span>
              <div className="relative w-full">
                <select className="block w-full border-0 bg-transparent py-2 pl-0 pr-8 text-sm font-bold text-primary focus:ring-0 cursor-pointer">
                  <option selected>All Countries</option>
                  <option>United States</option>
                  <option>Taiwan</option>
                </select>
              </div>
            </div>
             <div className="relative w-full sm:w-64 lg:w-80">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
              </div>
              <input className="block w-full rounded-lg border-0 bg-white py-2.5 pl-10 pr-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" placeholder="Search deleted items..." type="text" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-red-50/50">
                <tr>
                  <th className="pl-6 py-4 w-[60px]">
                    <input 
                        type="checkbox" 
                        ref={headerCheckboxRef}
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" 
                    />
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[140px]">Actions</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Page Title</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">URL Slug</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Deleted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_DATA_DELETED.map((item, index) => {
                    const isSelected = selectedItems.has(item.id);
                    return (
                        <tr 
                            key={item.id} 
                            onClick={() => toggleItem(item.id)}
                            className={`group hover:bg-slate-50 transition-colors cursor-pointer ${isSelected ? 'bg-primary/5' : ''}`}
                        >
                            <td className="whitespace-nowrap pl-6 py-5">
                                <input 
                                    type="checkbox" 
                                    checked={isSelected}
                                    onChange={() => toggleItem(item.id)}
                                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" 
                                />
                            </td>
                            <td className="whitespace-nowrap px-6 py-5" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-start gap-1">
                                <Tooltip content="Restore">
                                  <button 
                                    onClick={onRestore}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-[20px]">undo</span>
                                  </button>
                                </Tooltip>
                                <Tooltip content="Delete Forever">
                                  <button 
                                    onClick={() => setDeleteState({ isOpen: true, type: 'single' })}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors" 
                                  >
                                    <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                                  </button>
                                </Tooltip>
                            </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-5">
                            <div className="opacity-75">
                                <div className="text-sm font-bold text-slate-900 mb-1">{item.title}</div>
                                <div className="flex items-center gap-2">
                                    {renderSourceBadge(item.source, item.locale)}
                                    <span className="text-xs text-slate-500 line-clamp-1 max-w-[150px]">{index === 0 ? 'Seasonal promotion' : index === 1 ? 'Legacy content' : 'Draft version'}</span>
                                </div>
                            </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-5">
                            <code className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 font-mono line-through">{item.slug}</code>
                            </td>
                            <td className="whitespace-nowrap px-6 py-5">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 ring-1 ring-inset ring-red-600/20">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                                Deleted
                            </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-5">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-900">{item.lastModified}</span>
                                <span className="text-xs text-slate-500">by {item.author}</span>
                            </div>
                            </td>
                        </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Floating Bulk Action Bar */}
      {selectedItems.size > 0 && (
        <div className="fixed bottom-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 pl-4 shadow-2xl ring-1 ring-black/5 animate-in slide-in-from-bottom-4 duration-300">
            <div className="mr-2 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm">{selectedItems.size}</span>
            <span className="text-sm font-bold text-slate-900">Selected</span>
            </div>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <button 
            onClick={() => {
                onRestore();
                setSelectedItems(new Set());
            }}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 hover:bg-slate-100 transition-colors"
            >
            <span className="material-symbols-outlined text-[20px]">undo</span>
            Bulk Restore
            </button>
            <button 
            onClick={() => setDeleteState({ isOpen: true, type: 'bulk' })}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
            Delete Forever
            </button>
        </div>
      )}

      <DeleteConfirmationModal 
        isOpen={deleteState.isOpen}
        onClose={() => setDeleteState({ ...deleteState, isOpen: false })}
        onConfirm={confirmDelete}
        title={modalContent.title}
        description={modalContent.description}
        confirmText={modalContent.confirmText}
      />
    </main>
  );
};

export default RecycleBin;