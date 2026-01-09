import { Button } from '../ui/button';
import { INode } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { useState } from 'react';
import Image from 'next/image';
import { Input } from '../ui/input';
import { useNodeMutations } from '@/hooks/node/useNodeMutations';
import { makeToastError } from '@/lib/toast';

interface IProps {
  item: INode;
  isOpen: boolean;
  depth: number;
}

const SidebarFolderItem = ({ item, isOpen, depth }: IProps) => {
  const {
    activeNode,
    isUpdatingNode,
    setActiveNode,
    setIsCreating,
    setIsUpdatingNode,
    selectedNode,
  } = useNodeStore();
  const [title, setTitle] = useState('');

  const handleNodeClick = (node: INode) => {
    setActiveNode(node);
    setIsCreating(false);
  };

  const mutation = useNodeMutations();

  const update = () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const payload = {
      _id: item._id,
      pid: item.projectId,
      title: title as string,
    };
    mutation.update.mutate(payload, {
      onSuccess: () => {
        setIsCreating(false);
        return;
      },
      onError: err => {
        setIsCreating(false);
        makeToastError(err.message);
        return;
      },
    });
  };

  if (isUpdatingNode && isUpdatingNode._id === item._id)
    return (
      <div
        id={`sidebar-edit-item-${item._id}`}
        className={cn(
          "[&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
          'inline-flex items-center transition-none shrink-0 gap-0 duration-0 h-4.5 rounded-none bg-transparent active:ring-0 hover:bg-accent text-inherit border-none outline-none shadow-none focus:outline-none ring-0 focus:ring-0 cursor-pointer w-full justify-start truncate'
        )}
        style={{
          paddingLeft: `${depth * 8}px`,
        }}
      >
        <ChevronRight className={`${isOpen ? 'rotate-90' : 'rotate-0'}`} />
        <Image
          src={isOpen ? '/images/opened-folder.svg' : '/images/closed-folder.svg'}
          alt="Folder Icon"
          width={20}
          height={20}
        />
        <div className="truncate bg-transparent w-full">
          <Input
            onBlur={() => {
              update();
              setIsUpdatingNode(null);
            }}
            autoFocus
            value={title || item?.title || ''}
            onChange={e => setTitle(e.target.value)}
            className="h-4 text-sm text-primary-foreground text-start w-full px-0 focus-visible:ring-0 rounded-none"
          />
        </div>
      </div>
    );

  return (
    <Button
      onClick={() => handleNodeClick(item)}
      tabIndex={0}
      className={cn(
        'transition-none gap-0 flex duration-0 h-4.5 rounded-none bg-transparent active:ring-0 hover:bg-accent text-inherit border-none outline-none shadow-none focus:outline-none ring-0 focus:ring-0 cursor-pointer w-full justify-start truncate',
        activeNode?._id === item._id
          ? 'bg-accent text-foreground focus:bg-primary focus:text-primary-foreground focus:hover:bg-primary'
          : 'hover:bg-accent hover:text-accent-foreground',
        selectedNode?._id === item._id
          ? 'ring-2 active:ring-2 hover:ring-2 ring-inset ring-primary shadow-md shadow-primary/20'
          : 'active:ring-0'
      )}
      style={{
        paddingLeft: `${depth * 8}px`,
      }}
    >
      <ChevronRight className={`${isOpen ? 'rotate-90' : 'rotate-0'}`} />
      <Image
        src={isOpen ? '/images/opened-folder.svg' : '/images/closed-folder.svg'}
        alt="Folder Icon"
        width={20}
        height={20}
      />
      <p className="truncate">{title || item.title}</p>
    </Button>
  );
};

export default SidebarFolderItem;
