'use client';
import React from 'react';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset } from '@/components/ui/sidebar';

const Page = () => {
  return (
    <SidebarInset className="flex flex-col h-screen w-full">
      <SiteHeader title={'Workspace Name'} />
      <div className="flex-1 overflow-y-auto">
        <div className="container px-3 py-4">
          <h1 className="text-2xl md:text-3xl font-bold drop-shadow-sm mb-2">Workspace Name</h1>
        </div>
      </div>
    </SidebarInset>
  );
};

export default Page;
