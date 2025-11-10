'use client';
import { Grid2x2, TextAlignJustify } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function LayoutButtons() {
  const [clicked, setClicked] = useState<'grid' | 'row'>('grid');
  return (
    <div className="flex flex-row gap-x-0 border border-gray-400 p-1 rounded-sm">
      <Button
        className={cn('h-6 w-6 rounded-sm', { 'bg-slate-200': clicked === 'grid' })}
        variant="ghost"
        size="icon"
        aria-label="Grid Layout"
        onClick={() => setClicked('grid')}
      >
        <Grid2x2 className="" />
      </Button>
      <Button
        className={cn('h-6 w-6 rounded-sm', { 'bg-slate-200': clicked === 'row' })}
        variant="ghost"
        size="icon"
        aria-label="Row Layout"
        onClick={() => setClicked('row')}
      >
        <TextAlignJustify />
      </Button>
    </div>
  );
}
