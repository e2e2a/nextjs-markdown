'use client';
import React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { INavItem } from '@/types';

type IProps = {
  data: INavItem[];
  children: React.ReactNode;
};

export function SidebarWrapper({ data, children }: IProps) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar data={data} variant="sidebar" />
      {children}
    </SidebarProvider>
  );
}
