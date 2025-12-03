import { IconFolder } from '@tabler/icons-react';
import { MessageCircleMore } from 'lucide-react';

export const sidebarData = [
  {
    title: 'title 1',
    icon: IconFolder,
    items: [
      {
        title: 'My Projects',
        url: '/project',
      },
    ],
  },
  {
    title: 'title 2',
    icon: IconFolder,
    items: [
      {
        title: 'Comments',
        url: '#',
        icon: MessageCircleMore,
      },
      {
        title: 'My Trash',
        url: '/trash',
      },
    ],
  },
  {
    title: 'title 3',
    icon: IconFolder,
    items: [
      {
        title: 'Project Invitations',
        url: '/invite',
      },
      {
        title: 'Team',
        url: '/team',
      },
    ],
  },
];
