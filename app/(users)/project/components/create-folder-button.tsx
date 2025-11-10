import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FolderPlus, FolderX } from 'lucide-react';
import React from 'react';
interface IProps {
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
}
export function CreateFolderButton({ isCreating, setIsCreating }: IProps) {
  if (!isCreating) {
    return (
      <Button
        className={cn(
          'w-auto rounded-sm border border-blue-600 p-2 text-blue-600 hover:bg-blue-600/20 hover:text-blue-600'
        )}
        variant="ghost"
        size="icon"
        aria-label="Grid Layout"
        onClick={() => setIsCreating(true)}
      >
        <span className="inline-flex items-center w-full gap-2">
          <FolderPlus /> Create Folder
        </span>
      </Button>
    );
  }
  return (
    <Button
      className={cn(
        'w-auto rounded-sm border border-red-600 p-2 text-red-600 hover:bg-red-600/20 hover:text-red-600'
      )}
      variant="ghost"
      size="icon"
      aria-label="Grid Layout"
      onClick={() => setIsCreating(false)}
    >
      <span className="inline-flex items-center w-full gap-2">
        <FolderX /> Cancel
      </span>
    </Button>
  );
}
