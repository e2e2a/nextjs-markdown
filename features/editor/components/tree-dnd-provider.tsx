import { INode } from '@/types';
import {
  DndContext,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  DragOverlay,
  DragEndEvent,
} from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { ReactNode, useState } from 'react';
const isDescendant = (nodes: INode[], potentialAncestorId: string, targetNode: INode): boolean => {
  let currentParentId: string | null = targetNode.parentId;

  while (currentParentId) {
    if (currentParentId === potentialAncestorId) return true;
    const parent = nodes.find(n => n._id === currentParentId);
    currentParentId = parent ? parent.parentId : null;
  }

  return false;
};

export function TreeDndProvider({
  children,
  allNodes,
}: {
  children: ReactNode;
  allNodes: INode[];
}) {
  const [activeNode, setActiveNode] = useState<INode | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // delay: 10,
        // tolerance: 0,
        distance: 2, // Don't start drag immediately on click, wait for 3px move
      },
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveNode(null);

    // 1. Validate Drop Target
    if (!over || !over.data.current) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeData = active.data.current as INode;
    const overData = over.data.current as INode;

    // 2. Production Guards (VS Code Style)
    if (activeId === overId) return; // Dropped on self
    if (overData.type === 'file') return; // Cannot drop INTO a file
    if (activeData.parentId === overId) return; // Already in this folder

    // 3. Prevent Circular References (Moving Parent into Child)
    // We get the full list of nodes from your store to check lineage
    // const allNodes = useNodeStore.getState().nodes;
    if (isDescendant(allNodes, activeId, overData)) {
      console.warn('Invalid Move: Cannot move a folder into its own subdirectory.');
      return;
    }

    // 4. Optimistic UI Update
    // Update the local state immediately so the UI feels "snappy"
    // const originalNodes = [...useNodeStore.getState().nodes];
    try {
      // This function should update the parentId of activeId to overId in your Zustand store
      // useNodeStore.getState().moveNode(activeId, overId);

      // 5. Backend Sync
      const response = await fetch(`/api/nodes/${activeId}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newParentId: overId,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      // 6. Optional: Success Notification
      // toast.success(`Moved ${activeData.name} to ${overData.name}`);
    } catch (error) {
      console.error('Failed to move node:', error);

      // 7. Rollback on Failure
      // If the server fails, revert the store to the original state
      // useNodeStore.setState({ nodes: originalNodes });
      // toast.error("Failed to move item. Reverting changes.");
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin} // can we use any other method that is light but the detection will be the end of drag
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.BeforeDragging,
        },
      }}
      onDragStart={e => setActiveNode(e.active.data.current as INode)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveNode(null)}
    >
      {children}

      <DragOverlay modifiers={[snapCenterToCursor]} transition={undefined} dropAnimation={null}>
        {activeNode ? (
          <div
            style={{
              willChange: 'transform',
              pointerEvents: 'none',
              transform: 'translate3d(0, 0, 0)',
            }}
            className="bg-background border px-2 py-1 rounded shadow-xl text-[13px] w-fit h-fit whitespace-nowrap opacity-90"
          >
            {activeNode.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
