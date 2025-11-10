import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Fragment } from 'react';

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItemType[] }) {
  return (
    <div className="w-full">
      <Breadcrumb className="flex w-max px-2">
        <BreadcrumbList className="flex items-center sm:gap-0">
          {breadcrumbs &&
            breadcrumbs.length > 0 &&
            breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <Fragment key={index}>
                  <BreadcrumbItem className="max-w-32 shrink-0">
                    <BreadcrumbLink asChild>
                      <p
                        className={cn(
                          `block truncate cursor-pointer hover:underline`,
                          isLast ? 'text-muted-foreground pointer-events-none font-medium' : ''
                        )}
                      >
                        {item.title}
                      </p>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
