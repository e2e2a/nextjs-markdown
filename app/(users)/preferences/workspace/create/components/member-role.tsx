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
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IWorkspaceMemberCreateDTO } from '@/types';

const roles: readonly ['owner', 'member', 'viewer'] = ['owner', 'member', 'viewer'];

interface IProps {
  targetMember: IWorkspaceMemberCreateDTO;
  setMembers: React.Dispatch<React.SetStateAction<IWorkspaceMemberCreateDTO[]>>;
}

export function MemberRole({ targetMember, setMembers }: IProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<'owner' | 'member' | 'viewer'>('owner');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start capitalize">
          {selectedRole}
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
                    setMembers((prevMembers: IWorkspaceMemberCreateDTO[]) =>
                      prevMembers.map((member: IWorkspaceMemberCreateDTO) =>
                        member.email === targetMember.email
                          ? { ...member, role: selectedRole }
                          : member
                      )
                    );
                    setSelectedRole(role);
                    setOpen(false);
                  }}
                  className="capitalize"
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
  );
}
