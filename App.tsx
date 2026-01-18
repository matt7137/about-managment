import React, { useState } from 'react';
import GlobalList from './views/GlobalList';
import LocalList from './views/LocalList';
import Editor from './views/Editor';
import RecycleBin from './views/RecycleBin';
import CompareView from './views/CompareView';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('GLOBAL_LIST');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const navigate = (view: ViewState) => {
    setCurrentView(view);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background-light font-display">
      {currentView === 'GLOBAL_LIST' && <GlobalList onNavigate={navigate} />}
      {currentView === 'LOCAL_LIST' && <LocalList onNavigate={navigate} />}
      
      {currentView === 'EDITOR_GLOBAL' && (
        <Editor 
          mode="read-only" 
          title="Our Company History" 
          slug="history" 
          onNavigate={navigate} 
          onSave={() => triggerToast('Global content updated successfully.')}
        />
      )}
      
      {currentView === 'CREATE' && (
        <Editor 
          mode="create" 
          title="" 
          slug="" 
          onNavigate={navigate} 
          onSave={() => {
            triggerToast('New page created successfully.');
            navigate('GLOBAL_LIST');
          }}
        />
      )}
      
      {currentView === 'EDITOR_LOCAL' && (
        <Editor 
          mode="edit" 
          title="Company History (Taiwan)" 
          slug="history" 
          context="Taiwan" 
          onNavigate={navigate} 
          onSave={() => {
            triggerToast('Local content updated successfully.');
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