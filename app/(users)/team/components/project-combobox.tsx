'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IProject } from '@/types';

type IProps = {
  projects: IProject[];
  value: string;
  onChange: (value: string) => void;
};

export function ProjectCombobox({ projects, value, onChange }: IProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = projects.find(framework => framework._id === value)?.title;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selectedLabel || 'Select framework...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search project..." className="h-9" />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup>
              {projects.map(framework => (
                <CommandItem
                  key={framework._id}
                  value={framework._id}
                  onSelect={() => {
                    onChange(framework._id);
                    setOpen(false);
                  }}
                >
                  {framework.title}
                  <Check
                    className={cn('ml-auto', value === framework._id ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
