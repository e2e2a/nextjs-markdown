import type { Config } from 'ziggy-js';

export interface Auth {
  user: User;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface DocumentTree {
  id: string;
  children: DocumentTree[];
  slug: string;
  content: string;
  projectId: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface NavItem {
  title: string;
  href?: string;
  type?: string;
  items?: NavItem[];
  isActive?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}
