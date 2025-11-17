import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Triangle } from 'lucide-react';

export type IProps = {
  pagination: { pageIndex: number; pageSize: number };
  setPagination: React.Dispatch<{ pageIndex: number; pageSize: number }>;
};

const number = [5, 10, 25, 50, 100];

const PaginationDropdown = ({ pagination, setPagination }: IProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-10">
          <div className="flex items-center gap-0.5">
            {pagination.pageSize} <Triangle className="h-2.5! w-2.5! rotate-180 fill-black" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {number.map((num, idx) => (
          <DropdownMenuCheckboxItem
            key={idx}
            checked={num === pagination.pageSize}
            onCheckedChange={() =>
              setPagination({ pageIndex: pagination.pageIndex, pageSize: num })
            }
          >
            {num}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PaginationDropdown;
