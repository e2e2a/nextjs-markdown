// 'use client';
// import { AppSidebar } from '@/components/app-sidebar';
// import { SiteHeader } from '@/components/site-header';
// import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
// import { sidebarData } from '@/data/sidebar/users';

// export default function Page() {
//   return (
//     <SidebarProvider
//       style={
//         {
//           '--sidebar-width': 'calc(var(--spacing) * 72)',
//           '--header-height': 'calc(var(--spacing) * 12)',
//         } as React.CSSProperties
//       }
//     >
//       <AppSidebar data={sidebarData} className="p-0" variant="inset" />
//       <SidebarInset>
//         <SiteHeader title="dashboard" />
//         <div className="flex flex-1 flex-col">
//           <div className="@container/main flex flex-1 flex-col gap-2">
//             <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">dashboard</div>
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }
import React from 'react';

const Page = () => {
  return <div>Page</div>;
};

export default Page;
