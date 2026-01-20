import React from 'react';
import { ViewState, MOCK_DATA_LOCAL, PageItem } from '../types';
import ListPage from '../components/ListPage';

interface Props {
  onNavigate: (view: ViewState) => void;
  onEdit: (view: ViewState, item: PageItem) => void;
}

const LocalList: React.FC<Props> = ({ onNavigate, onEdit }) => {
  return (
    <ListPage
      context="Local"
      data={MOCK_DATA_LOCAL}
      onNavigate={onNavigate}
      onEdit={onEdit}
      title="About Us Management"
      description={
        <span>
          Manage local content and translations for the <span className="font-bold text-slate-900">Taiwan</span> region.
        </span>
      }
      createButtonLabel="Create Page (Local)"
    />
  );
};

export default LocalList;