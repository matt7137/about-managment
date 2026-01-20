import React from 'react';
import { ViewState, MOCK_DATA_GLOBAL, PageItem } from '../types';
import ListPage from '../components/ListPage';

interface Props {
  onNavigate: (view: ViewState) => void;
  onEdit: (view: ViewState, item: PageItem) => void;
}

const GlobalList: React.FC<Props> = ({ onNavigate, onEdit }) => {
  return (
    <ListPage
      context="Global"
      data={MOCK_DATA_GLOBAL}
      onNavigate={onNavigate}
      onEdit={onEdit}
      title="About Us Management"
      description="Manage and localise your company's mission, history, and team pages."
      createButtonLabel="Create Page (Global)"
    />
  );
};

export default GlobalList;