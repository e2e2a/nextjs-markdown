'use client';
import * as React from 'react';
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
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IWorkspaceMember, TableMeta } from '@/types';
import { Table } from '@tanstack/react-table';

const roles: readonly ['owner', 'editor', 'viewer'] = ['owner', 'editor', 'viewer'];

interface IProps {
  item: IWorkspaceMember;
  table: Table<IWorkspaceMember>;
}

export function RoleDropdown({ item, table }: IProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<'owner' | 'editor' | 'viewer'>('owner');
  const meta = table.options.meta as TableMeta;
  const { editingMemberId, setEditingMemberId } = meta;
  const isEditing = editingMemberId === item._id;
  if (!isEditing)
    return <span className="uppercase font-semibold">{(item.role as string) || 'owner'}</span>;
  return (
    <div className="flex flex-row gap-x-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size={'sm'} className="w-[150px] justify-between uppercase">
            {selectedRole}
            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[150px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search project..." className="h-9" />
            <CommandList>
              <CommandEmpty>No project found.</CommandEmpty>
              <CommandGroup>
                {roles.map((role, idx) => (
                  <CommandItem
                    key={idx}
                    value={role}
                    onSelect={() => {
                      setSelectedRole(role);
                      setOpen(false);
                    }}
                    className="uppercase"
                  >
                    {role}
                    <Check
                      className={cn('ml-auto', selectedRole === role ? 'opacity-100' : 'opacity-0')}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button size={'sm'} variant={'default'}>
        <Check />
      </Button>
      <Button size={'sm'} variant={'outline'} onClick={() => setEditingMemberId(null)}>
        <X />
      </Button>
    </div>
  );
}
