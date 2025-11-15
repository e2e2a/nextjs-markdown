import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { EllipsisVertical, FolderOpenDot, FolderPen, X } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '../../../../components/ui/skeleton';
import { IProject } from '@/types';
import { Button } from '@/components/ui/button';

export function SectionCards({
  isCreating,
  setIsCreating,
  loading,
  projects,
}: {
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  projects: IProject[];
}) {
  if (loading) {
    return (
      <div className="w-full *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <CardDescription>
                <Skeleton className="h-7 w-7 rounded-sm" />
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <Skeleton className="h-4 w-full" />
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <Skeleton className="h-4 w-[50px]" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!isCreating && (!projects || projects.length === 0)) {
    return (
      <div className="w-full">
        {!isCreating && <div className="text-center">No Projects Found</div>}
      </div>
    );
  }
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            <FolderOpenDot className="" />
            <div className="">
              <Button variant="ghost" className="p-0! focus-visible:ring-0 outline-0">
                <EllipsisVertical />
              </Button>
            </div>
          </CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <h3>example</h3>
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>2025-05-03</span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Last updated: 2025-05-03</p>
            </TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
    </div>
  );
}
