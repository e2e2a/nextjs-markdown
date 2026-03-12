// stores/project-presence.ts
import { create } from 'zustand';

interface UserInfo {
  id: string;
  name: string;
  color: string;
}

interface ProjectPresenceState {
  activeUsers: Map<string, UserInfo>;
  userCount: number;
  setActiveUsers: (users: Map<string, UserInfo>) => void;
}

export const useProjectPresence = create<ProjectPresenceState>(set => ({
  activeUsers: new Map(),
  userCount: 0,
  setActiveUsers: users =>
    set({
      activeUsers: users,
      userCount: users.size,
    }),
}));
