import { IconFolder } from '@tabler/icons-react';
import { MessageCircleMore } from 'lucide-react';

export const sidebarData = [
  {
    title: 'Account',
    icon: IconFolder,
    items: [
      {
        title: 'Profile Info',
        url: '#',
      },
      {
        title: 'Security',
        url: '#',
      },
    ],
  },
  {
    title: 'Settings',
    icon: IconFolder,
    items: [
      {
        title: 'Invitations',
        url: '#',
        icon: MessageCircleMore,
      },
      {
        title: 'Workspaces',
        url: '#',
      },
      {
        title: 'Legacy 2FA',
        url: '#',
      },
    ],
  },
  {
    title: 'Configurations',
    icon: IconFolder,
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
