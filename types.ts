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
  version?: string;
}

export const MOCK_DATA_GLOBAL: PageItem[] = [
  { id: '1', title: 'Company History', slug: '/about/history', status: 'Published', lastModified: 'Oct 24, 2023', author: 'Alex M.', version: 'v14' },
  { id: '2', title: 'Leadership Team', slug: '/about/team', status: 'Published', lastModified: 'Oct 20, 2023', author: 'Sarah J.', version: 'v8' },
  { id: '3', title: 'Mission Statement', slug: '/about/mission', status: 'Draft', lastModified: 'Sep 15, 2023', author: 'Alex M.', version: 'v3' },
  { id: '4', title: 'Careers Overview', slug: '/careers', status: 'Published', lastModified: 'Nov 01, 2023', author: 'Jessica L.', version: 'v5' },
  { id: '5', title: 'Engineering Culture', slug: '/careers/engineering', status: 'Published', lastModified: 'Oct 28, 2023', author: 'David K.', version: 'v2' },
  { id: '6', title: 'Investor Relations', slug: '/investors', status: 'Published', lastModified: 'Nov 05, 2023', author: 'Sarah J.', version: 'v12' },
  { id: '7', title: 'Q3 2023 Financial Results', slug: '/investors/q3-2023', status: 'Draft', lastModified: 'Nov 02, 2023', author: 'Sarah J.', version: 'v1' },
  { id: '8', title: 'Sustainability Goals 2030', slug: '/sustainability', status: 'Published', lastModified: 'Sep 30, 2023', author: 'Alex M.', version: 'v4' },
  { id: '9', title: 'Press Release: New Product Launch', slug: '/news/product-x-launch', status: 'Draft', lastModified: 'Nov 06, 2023', author: 'Jessica L.', version: 'v1' },
  { id: '13', title: 'Contact Us', slug: '/contact', status: 'Published', lastModified: 'Aug 15, 2023', author: 'System', version: 'v1' },
  { id: '14', title: 'Privacy Policy', slug: '/legal/privacy', status: 'Published', lastModified: 'Jan 10, 2023', author: 'Legal Team', version: 'v22' },
  { id: '15', title: 'Terms of Service', slug: '/legal/terms', status: 'Published', lastModified: 'Jan 10, 2023', author: 'Legal Team', version: 'v18' },
  { id: '16', title: 'Product Overview: Cloud', slug: '/products/cloud', status: 'Published', lastModified: 'Oct 05, 2023', author: 'David K.', version: 'v7' },
  { id: '17', title: 'Product Overview: Mobile', slug: '/products/mobile', status: 'Draft', lastModified: 'Oct 12, 2023', author: 'David K.', version: 'v8' },
  { id: '18', title: 'Diversity & Inclusion', slug: '/about/diversity', status: 'Published', lastModified: 'Sep 20, 2023', author: 'Jessica L.', version: 'v3' },
  { id: '19', title: 'Global Office Locations', slug: '/about/locations', status: 'Published', lastModified: 'Oct 15, 2023', author: 'System', version: 'v6' },
  { id: '20', title: 'Media Kit', slug: '/news/media-kit', status: 'Draft', lastModified: 'Nov 04, 2023', author: 'Jessica L.', version: 'v2' },
];

export const MOCK_DATA_LOCAL: PageItem[] = [
  { id: '1', title: 'Company History', slug: '/tw/about/history', status: 'Published', lastModified: 'Oct 24, 2023', author: 'Alex M.', source: 'Translated', syncStatus: 'Synced', locale: 'TW', version: 'v14' },
  { id: '2', title: 'Taiwan Team', slug: '/tw/about/team', status: 'Published', lastModified: 'Oct 20, 2023', author: 'Wei-Ling C.', source: 'Local', syncStatus: 'Local', locale: 'TW', version: 'v2' },
  { id: '3', title: 'Mission Statement', slug: '/tw/about/mission', status: 'Draft', lastModified: 'Sep 15, 2023', author: 'Alex M.', source: 'Translated', syncStatus: 'Overridden', locale: 'TW', version: 'v4' },
  { id: '21', title: 'Taipei Office Open House', slug: '/tw/news/taipei-opening', status: 'Published', lastModified: 'Nov 01, 2023', author: 'Wei-Ling C.', source: 'Local', syncStatus: 'Local', locale: 'TW', version: 'v1' },
  { id: '22', title: 'Careers (Taiwan)', slug: '/tw/careers', status: 'Published', lastModified: 'Nov 03, 2023', author: 'System', source: 'Translated', syncStatus: 'Synced', locale: 'TW', version: 'v5' },
  { id: '23', title: 'Local Compliance', slug: '/tw/legal/compliance', status: 'Draft', lastModified: 'Oct 30, 2023', author: 'Legal TW', source: 'Local', syncStatus: 'Local', locale: 'TW', version: 'v1' },
  { id: '24', title: 'Product: Mobile (Taiwan)', slug: '/tw/products/mobile', status: 'Published', lastModified: 'Oct 15, 2023', author: 'David K.', source: 'Translated', syncStatus: 'Synced', locale: 'TW', version: 'v8' },
  { id: '25', title: 'Privacy Policy (TW)', slug: '/tw/legal/privacy', status: 'Published', lastModified: 'Feb 12, 2023', author: 'Legal TW', source: 'Translated', syncStatus: 'Overridden', locale: 'TW', version: 'v22' },
  { id: '26', title: 'Local Partnerships', slug: '/tw/partners', status: 'Draft', lastModified: 'Oct 05, 2023', author: 'Wei-Ling C.', source: 'Local', syncStatus: 'Local', locale: 'TW', version: 'v1' },
  { id: '27', title: 'Contact Us (Taiwan)', slug: '/tw/contact', status: 'Published', lastModified: 'Aug 20, 2023', author: 'System', source: 'Translated', syncStatus: 'Synced', locale: 'TW', version: 'v1' },
  { id: '28', title: 'Lunar New Year Promo', slug: '/tw/promo/lny-2024', status: 'Draft', lastModified: 'Nov 06, 2023', author: 'Marketing TW', source: 'Local', syncStatus: 'Local', locale: 'TW', version: 'v1' },
  { id: '29', title: 'Sustainability (TW)', slug: '/tw/sustainability', status: 'Published', lastModified: 'Oct 01, 2023', author: 'Alex M.', source: 'Translated', syncStatus: 'Synced', locale: 'TW', version: 'v4' },
];

export const MOCK_DATA_DELETED: PageItem[] = [
  { id: '10', title: 'Summer Campaign Landing', slug: '/about/summer-promo', status: 'Published', lastModified: 'Today, 10:42 AM', author: 'Alex M.', source: 'Global', version: 'v1' },
  { id: '11', title: 'Old Team Bios', slug: '/de/about/team-legacy', status: 'Published', lastModified: 'Yesterday, 04:15 PM', author: 'Sarah J.', source: 'Translated', locale: 'DE', version: 'v5' },
  { id: '12', title: "Founder's Story V1", slug: '/tw/about/founders-v1', status: 'Published', lastModified: 'Oct 21, 2023', author: 'Alex M.', source: 'Local', locale: 'TW', version: 'v1' },
  { id: '30', title: 'Q2 2023 Report', slug: '/investors/q2-2023', status: 'Published', lastModified: 'Aug 01, 2023', author: 'Sarah J.', source: 'Global', version: 'v1' },
  { id: '31', title: 'Legacy Product A', slug: '/products/legacy-a', status: 'Published', lastModified: 'Jul 15, 2023', author: 'David K.', source: 'Global', version: 'v12' },
  { id: '32', title: 'Deprecated API Docs', slug: '/dev/api-v1', status: 'Published', lastModified: 'Jun 20, 2023', author: 'Dev Team', source: 'Global', version: 'v4' },
  { id: '33', title: 'Halloween Special (TW)', slug: '/tw/promo/halloween', status: 'Published', lastModified: 'Nov 01, 2023', author: 'Marketing TW', source: 'Local', locale: 'TW', version: 'v1' },
  { id: '34', title: 'Tokyo Event Landing', slug: '/jp/events/tokyo-summit', status: 'Published', lastModified: 'Sep 10, 2023', author: 'Marketing JP', source: 'Local', locale: 'JP', version: 'v3' },
  { id: '35', title: 'Beta Signup Form', slug: '/beta-signup', status: 'Published', lastModified: 'May 05, 2023', author: 'Product', source: 'Global', version: 'v2' },
  { id: '36', title: 'Old Contact Form', slug: '/contact-old', status: 'Published', lastModified: 'Mar 12, 2023', author: 'System', source: 'Global', version: 'v1' },
];