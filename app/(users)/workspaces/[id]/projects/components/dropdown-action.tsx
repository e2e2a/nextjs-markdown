import { IProject } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditProjectAction } from './edit-project-action';
import { useGetMyWorkspaceMembership } from '@/hooks/workspasceMember/useQueries';
import { useState } from 'react';
import { makeToastSucess } from '@/lib/toast';
import { MoveProjectAction } from './move-project-action';

interface IProps {
  item: IProject;
  workspaceId: string;
}

const DropdownActions = ({ item, workspaceId }: IProps) => {
  const { data: membership } = useGetMyWorkspaceMembership(workspaceId);
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <div className="action-button w-full items-center flex size-4 px-2 gap-1.5 h-8">
          <Ellipsis className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-40">
        {membership.role !== 'viewer' && (
          <>
            <Button
              variant={'ghost'}
              className="w-full justify-start px-2 font-normal cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(item._id);
                makeToastSucess('ID copied to clipboard!');
                setOpen(false);
              }}
            >
              Copy Project ID
            </Button>
            <EditProjectAction item={item} />
            <MoveProjectAction item={item} />
            <Button
              variant={'ghost'}
              className="w-full justify-start px-2 font-normal cursor-pointer"
            >
              Move Project
            </Button>
          </>
        )}

        <DropdownMenuSeparator />
        <Button
          variant={'ghost'}
          className="w-full text-red-600 hover:text-red-500 justify-start px-2 font-normal cursor-pointer"
        >
          Leave Project
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownActions;
