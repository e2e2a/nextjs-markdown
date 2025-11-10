import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Breadcrumbs } from './breadcrumbs';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
  return (
    <header className="flex h-10 p-0 items-center border-b">
      <div className="grid grid-cols-1 items-center overflow-x-auto">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
    </header>
  );
}
