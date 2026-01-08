import { Button } from '../ui/button';
import { INode } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { useState } from 'react';
import Image from 'next/image';
import { Input } from '../ui/input';

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
    setSelectedNode,
    selectedNode,
  } = useNodeStore();
  const [title, setTitle] = useState(item.title || '');

  const handleNodeClick = (node: INode) => {
    setActiveNode(node);
    setIsCreating(false);
    setIsUpdatingNode(null);
  };

  console.log('SidebarFolderItem onMouseDown, setting selectedNode to', selectedNode);

  if (isUpdatingNode && isUpdatingNode._id === item._id)
    return (
      <Button
        variant={'ghost'}
        id={`sidebar-edit-item-${item._id}`}
        className={
          'bg-transparent text-inherit border-none outline-none shadow-none focus:outline-none focus:ring-0 cursor-pointer h-full w-full justify-start truncate p-0 rounded-none gap-0 font-normal'
        }
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
            // ref={inputRef}
            onBlur={e => {
              if (!e.relatedTarget) {
                console.log('Input lost focus, cancel update if needed');
                setIsUpdatingNode(null);
                setIsCreating(false);
              }
            }}
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="h-4 text-inherit text-start w-full px-0"
          />
        </div>
      </Button>
    );

  return (
    <div className="">
      <Button
        onPointerDown={e => {
          // e.stopPropagation();
          e.preventDefault();
          if (selectedNode?._id === item._id) return;
          setSelectedNode(item);
        }}
        onClick={() => handleNodeClick(item)}
        className={cn(
          'h-4.5 bg-transparent text-inherit border-none outline-none shadow-none focus:outline-none focus:ring-0 cursor-pointer w-full justify-start truncate',
          'p-0 rounded-none gap-0 font-normal',
          activeNode?._id === item._id
            ? 'bg-primary text-foreground hover:bg-none!'
            : 'hover:bg-accent hover:text-accent-foreground',
          selectedNode?._id === item._id ? 'ring-2 ring-inset ring-blue-500' : ''
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
        <p className="truncate">{title}</p>
      </Button>
    </div>
  );
};

export default SidebarFolderItem;
