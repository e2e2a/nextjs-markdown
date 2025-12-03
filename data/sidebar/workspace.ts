import { CreditCard, Network, UserLock } from 'lucide-react';

export const sidebarData = [
  {
    title: 'Identity & Access',
    icon: UserLock,
    items: [
      {
        title: 'All Projects',
        url: '#',
      },
      {
        title: 'Users',
        url: '#',
      },
      {
        title: 'Teams',
        url: '#',
      },
    ],
  },
  {
    title: 'Billing',
    icon: CreditCard,
    items: [
      {
        title: 'Overview',
        url: '#',
      },
      {
        title: 'Invoices',
        url: '#',
      },
    ],
  },
  {
    title: 'Configurations',
    icon: Network,
    items: [
      {
        title: 'Resources Policies',
        url: '#',
      },
      {
        title: 'Activity Feed',
        url: '#',
      },
    ],
  },
];
