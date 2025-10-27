import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import Link from 'next/link';
import { Fragment } from 'react';

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItemType[] }) {
  return (
    <div className="w-full">
      <Breadcrumb className="flex w-max px-2">
        <BreadcrumbList className="flex items-center space-x-1">
          {breadcrumbs &&
            breadcrumbs.length > 0 &&
            breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <Fragment key={index}>
                  <BreadcrumbItem className="max-w-[8rem] flex-shrink-0">
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.href}
                        className={`block truncate ${
                          isLast ? 'text-muted-foreground pointer-events-none font-medium' : ''
                        }`}
                      >
                        {item.title}
                      </Link>
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
