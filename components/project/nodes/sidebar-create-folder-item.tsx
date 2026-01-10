import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { useState } from 'react';
import Image from 'next/image';
import { useNodeMutations } from '@/hooks/node/useNodeMutations';
import { makeToastError } from '@/lib/toast';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';

interface IProps {
  depth: number;
}

const SidebarCreateFolderItem = ({ depth }: IProps) => {
  const { isCreating, setIsCreating } = useNodeStore();
  const params = useParams();
  const pid = params.pid as string;
  const [title, setTitle] = useState('');
  const [disabled, setDisabled] = useState(false);

  const mutation = useNodeMutations();

  const create = () => {
    if (!isCreating) return;
    setDisabled(true);
    const trimmed = title.trim();
    if (!trimmed) {
      setIsCreating(null);
      return;
    }

    const payload = {
      projectId: pid,
      parentId: isCreating.parentId,
      type: isCreating.type,
      title: title as string,
    };
    mutation.create.mutate(payload, {
      onSuccess: () => {
        setTimeout(() => {
          setIsCreating(null);
        }, 100);
        return;
      },
      onError: err => {
        makeToastError(err.message);
        return;
      },
      onSettled: () => {
        setDisabled(false);
      },
    });
  };

  return (
    <div
      id={`sidebar-creating-folder-item`}
      className={cn(
        "[&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
        'inline-flex items-center transition-none shrink-0 gap-0 duration-0 h-auto leading-none py-0.5 rounded-none bg-transparent active:ring-0 hover:bg-accent text-inherit border-none outline-none shadow-none focus:outline-none ring-0 focus:ring-0 cursor-pointer w-full justify-start truncate'
      )}
      style={{
        paddingLeft: `${depth * 8}px`,
      }}
    >
      <ChevronRight className="rotate-0" />
      <Image
        src="/images/closed-folder.svg"
        alt="Folder Icon"
        className="w-4.5 h-4.5"
        width={20}
        height={20}
      />
      <div className="truncate bg-transparent w-full">
        <Input
          onBlur={create}
          autoFocus
          disabled={disabled}
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="h-4 text-sm text-primary-foreground text-start w-full px-0 focus-visible:ring-0 rounded-none"
        />
      </div>
    </div>
  );
};

export default SidebarCreateFolderItem;
