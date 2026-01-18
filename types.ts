export type ViewState = 
  | 'GLOBAL_LIST' 
  | 'LOCAL_LIST' 
  | 'EDITOR_GLOBAL' 
  | 'EDITOR_LOCAL' 
  | 'CREATE' 
  | 'COMPARE' 
  | 'RECYCLE_BIN';

export interface PageItem {
  id: string;
  title: string;
  slug: string;
  status: 'Published' | 'Draft';
  lastModified: string;
  author: string;
  source?: 'Global' | 'Local' | 'Translated';
  syncStatus?: 'Synced' | 'Overridden' | 'Local';
  locale?: string;
}

export const MOCK_DATA_GLOBAL: PageItem[] = [
  { id: '1', title: 'Company History', slug: '/about/history', status: 'Published', lastModified: 'Oct 24, 2023', author: 'Alex M.' },
  { id: '2', title: 'Leadership Team', slug: '/about/team', status: 'Published', lastModified: 'Oct 20, 2023', author: 'Sarah J.' },
  { id: '3', title: 'Mission Statement', slug: '/about/mission', status: 'Draft', lastModified: 'Sep 15, 2023', author: 'Alex M.' },
];

export const MOCK_DATA_LOCAL: PageItem[] = [
  { id: '1', title: 'Company History', slug: '/tw/about/history', status: 'Published', lastModified: 'Oct 24, 2023', author: 'Alex M.', source: 'Translated', syncStatus: 'Synced', locale: 'TW' },
  { id: '2', title: 'Taiwan Team', slug: '/tw/about/team', status: 'Published', lastModified: 'Oct 20, 2023', author: 'Wei-Ling C.', source: 'Local', syncStatus: 'Local', locale: 'TW' },
  { id: '3', title: 'Mission Statement', slug: '/tw/about/mission', status: 'Draft', lastModified: 'Sep 15, 2023', author: 'Alex M.', source: 'Translated', syncStatus: 'Overridden', locale: 'TW' },
];

export const MOCK_DATA_DELETED: PageItem[] = [
  { id: '10', title: 'Summer Campaign Landing', slug: '/about/summer-promo', status: 'Published', lastModified: 'Today, 10:42 AM', author: 'Alex M.', source: 'Global' },
  { id: '11', title: 'Old Team Bios', slug: '/de/about/team-legacy', status: 'Published', lastModified: 'Yesterday, 04:15 PM', author: 'Sarah J.', source: 'Translated', locale: 'DE' },
  { id: '12', title: "Founder's Story V1", slug: '/tw/about/founders-v1', status: 'Published', lastModified: 'Oct 21, 2023', author: 'Alex M.', source: 'Local', locale: 'TW' },
];