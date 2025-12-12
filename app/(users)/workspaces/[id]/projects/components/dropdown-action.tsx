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

interface IProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  loading: boolean;

  item: IProject;
}

const DropdownActions = ({ isOpen, setIsOpen, loading, item }: IProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="bg-secondary w-full items-center border border-primary/20 flex size-4 px-2 gap-1.5 whitespace-nowrap shrink-0 text-sm h-8 text-primary font-normal rounded-xl hover:text-none cursor-pointer">
          <Ellipsis className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-40">
        <Button variant={'ghost'} className="w-full justify-start px-2 font-normal cursor-pointer">
          Copy Project ID
        </Button>
        {/* <Button variant={'ghost'} className="w-full justify-start px-2 font-normal cursor-pointer">
          Edit Project Name
        </Button> */}
        <EditProjectAction item={item} />
        <Button variant={'ghost'} className="w-full justify-start px-2 font-normal cursor-pointer">
          Move Project
        </Button>
        <DropdownMenuSeparator />
        <Button
          variant={'ghost'}
          className="w-full text-red-500 hover:text-none justify-start px-2 font-normal cursor-pointer"
        >
          Leave Project
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownActions;
