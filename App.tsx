import React, { useState } from 'react';
import GlobalList from './views/GlobalList';
import LocalList from './views/LocalList';
import Editor from './views/Editor';
import RecycleBin from './views/RecycleBin';
import CompareView from './views/CompareView';
import { ViewState, PageItem } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('GLOBAL_LIST');
  const [editorData, setEditorData] = useState<PageItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const navigate = (view: ViewState) => {
    // Clear editor data when navigating away or to a list
    if (view.includes('LIST')) {
      setEditorData(null);
    }
    setCurrentView(view);
  };

  const handleEdit = (view: ViewState, item: PageItem) => {
    let dataToEdit = { ...item };

    // If editing a Published item, switch to Draft and increment version
    if (dataToEdit.status === 'Published') {
      const currentVerStr = dataToEdit.version || 'v1';
      const currentVerNum = parseInt(currentVerStr.replace(/\D/g, '')) || 1;
      const newVersion = `v${currentVerNum + 1}`;
      
      dataToEdit = {
        ...dataToEdit,
        status: 'Draft',
        version: newVersion
      };
      
      triggerToast(`Created new draft version ${newVersion}`);
    }

    setEditorData(dataToEdit);
    setCurrentView(view);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background-light font-display">
      {currentView === 'GLOBAL_LIST' && <GlobalList onNavigate={navigate} onEdit={handleEdit} />}
      {currentView === 'LOCAL_LIST' && <LocalList onNavigate={navigate} onEdit={handleEdit} />}
      
      {currentView === 'EDITOR_GLOBAL' && (
        <Editor 
          // Global pages are read-only if Published, editable if Draft (handled by handleEdit logic above)
          mode={editorData?.status === 'Draft' ? 'edit' : 'read-only'} 
          title={editorData?.title || "Page Title"} 
          slug={editorData?.slug || "slug"} 
          version={editorData?.version}
          onNavigate={navigate} 
          onSave={() => triggerToast('Global content updated successfully.')}
          onPublish={() => {
            triggerToast('Page published successfully.');
            navigate('GLOBAL_LIST');
          }}
        />
      )}
      
      {currentView === 'CREATE' && (
        <Editor 
          mode="create" 
          title="" 
          slug="" 
          version="v1"
          onNavigate={navigate} 
          onSave={() => {
            triggerToast('New page created successfully.');
            navigate('GLOBAL_LIST');
          }}
          onPublish={() => {
            triggerToast('New page published successfully.');
            navigate('GLOBAL_LIST');
          }}
        />
      )}
      
      {currentView === 'EDITOR_LOCAL' && (
        <Editor 
          // Local pages are read-only if Published, editable if Draft
          mode={editorData?.status === 'Draft' ? 'edit' : 'read-only'} 
          title={editorData?.title || "Local Page"} 
          slug={editorData?.slug || "slug"} 
          version={editorData?.version}
          context={editorData?.locale === 'TW' || editorData?.slug.startsWith('/tw') ? 'Taiwan' : 'Local'} 
          onNavigate={navigate} 
          onSave={() => {
            triggerToast('Local content updated successfully.');
            navigate('LOCAL_LIST');
          }}
          onPublish={() => {
            triggerToast('Local page published successfully.');
            navigate('LOCAL_LIST');
          }}
        />
      )}
      
      {currentView === 'COMPARE' && (
        <CompareView 
          onNavigate={navigate} 
          onSave={() => {
            triggerToast('Changes merged and saved.');
            navigate('LOCAL_LIST');
          }} 
        />
      )}
      
      {currentView === 'RECYCLE_BIN' && (
        <RecycleBin 
          onNavigate={navigate} 
          onRestore={() => triggerToast('Items restored to active content.')} 
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[110] flex w-full max-w-[400px] flex-col gap-2 animate-[slide-up-fade_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <div className="flex items-start gap-4 rounded-xl border border-emerald-100 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-1 ring-black/5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <span className="material-symbols-outlined icon-filled text-[24px]">check_circle</span>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900">Success</p>
                <button onClick={() => setShowToast(false)} className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <p className="text-sm text-slate-600">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;