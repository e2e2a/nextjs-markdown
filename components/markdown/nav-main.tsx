'use client';
import { useRef } from 'react';
import { useParams } from 'next/navigation';
import { useNodeStore } from '@/features/editor/stores/nodes';
import { groupNodes } from '@/utils/node-utils';
import { useNodesProjectIdQuery } from '@/hooks/node/useNodeQuery';
import { SidebarGroup } from '@/components/ui/sidebar';
import SidebarItem from '../project/nodes/sidebar-item';
import { INode } from '@/types';
import { cn } from '@/lib/utils';

export function NavMain() {
  const params = useParams();
  const pid = params.pid as string;
  const { data: nData, isLoading: nLoading } = useNodesProjectIdQuery(pid);
  const { activeDrag, activeOver, setActiveDrag, setActiveOver } = useNodeStore();

  // Ref for the final drop logic to avoid unnecessary re-renders
  const targetIdRef = useRef<string | null>(null);

  if (nLoading) return <div>Loading...</div>;
  const { folders, files } = groupNodes(nData?.nodes || []);

  const handleDragFinished = (dragged: INode | null) => {
    if (dragged && targetIdRef.current) {
      console.log(`Moving ${dragged.title} -> ${targetIdRef.current}`);
      // API Call here
    }
    setActiveOver(null);
    setActiveDrag(null);
    targetIdRef.current = null;
  };

  return (
    <div
      data-id={'root'}
      className={cn(
        'h-full w-full',
        activeDrag &&
          activeDrag.parentId &&
          'data-[drag-over=true]:bg-accent/50 data-[drag-over=true]:ring-1 data-[drag-over=true]:ring-inset data-[drag-over=true]:ring-accent'
      )}
    >
      <SidebarGroup className="p-0! h-auto">
        {folders.map(item => (
          <SidebarItem
            key={item._id}
            item={item}
            depth={0}
            targetIdRef={targetIdRef}
            activeDrag={activeDrag}
            activeOver={activeOver}
            onDragStart={setActiveDrag}
            onDragEnd={handleDragFinished}
          />
        ))}
        {/* Render Files */}
        {files.map(item => (
          <SidebarItem
            key={item._id}
            item={item}
            depth={2}
            targetIdRef={targetIdRef}
            activeDrag={activeDrag}
            activeOver={activeOver}
            onDragStart={setActiveDrag}
            onDragEnd={handleDragFinished}
          />
        ))}
      </SidebarGroup>
    </div>
  );
}
