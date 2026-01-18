import React, { useState } from 'react';
import { ViewState, MOCK_DATA_DELETED } from '../types';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

interface Props {
  onNavigate: (view: ViewState) => void;
  onRestore: () => void;
}

const RecycleBin: React.FC<Props> = ({ onNavigate, onRestore }) => {
  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    type: 'single' | 'bulk' | 'empty' | null;
  }>({ isOpen: false, type: null });

  const confirmDelete = () => {
    // Here you would implement actual delete logic
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
          title: "Permanently Delete Selected?",
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
        <button 
          onClick={() => setDeleteState({ isOpen: true, type: 'empty' })}
          className="group flex items-center justify-center gap-2 rounded-lg bg-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-300 active:scale-95 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px]">delete_forever</span>
          Empty Recycle Bin
        </button>
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
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[140px]">Actions</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Page Title</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">URL Slug</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Deleted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_DATA_DELETED.map((item, index) => (
                  <tr key={item.id} className={`group hover:bg-slate-50 transition-colors ${index > 0 ? 'bg-primary/5' : ''}`}>
                    <td className="whitespace-nowrap pl-6 py-5">
                       <input type="checkbox" checked={index > 0} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                      <div className="flex items-center justify-start gap-2">
                        <button 
                          onClick={onRestore}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors" title="Restore"
                        >
                          <span className="material-symbols-outlined text-[20px]">undo</span>
                        </button>
                        <button 
                          onClick={() => setDeleteState({ isOpen: true, type: 'single' })}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors" 
                          title="Permanent Delete"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                        </button>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                      <div className="opacity-75">
                        <div className="text-sm font-bold text-slate-900">{item.title}</div>
                        <div className="text-xs text-slate-500">Seasonal promotion</div>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Floating Bulk Action Bar */}
      <div className="fixed bottom-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 pl-4 shadow-2xl ring-1 ring-black/5">
        <div className="mr-2 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm">2</span>
          <span className="text-sm font-bold text-slate-900">Selected</span>
        </div>
        <div className="h-6 w-px bg-slate-200 mx-1"></div>
        <button 
          onClick={onRestore}
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