import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FolderOpenDot } from 'lucide-react';
import Link from 'next/link';

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Link href={'dashboard/1'}>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>
              <FolderOpenDot className="" />
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <h3>Name</h3>
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
      </Link>
    </div>
  );
}
