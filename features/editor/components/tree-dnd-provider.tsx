'use client';
import React, { ReactNode, useState, createContext } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  Modifier,
  useDroppable,
  pointerWithin, // Import Modifier type
} from '@dnd-kit/core';
import { INode } from '@/types';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { cn } from '@/lib/utils';
const isDescendant = (nodes: INode[], potentialAncestorId: string, targetNode: INode): boolean => {
  let currentParentId: string | null = targetNode.parentId;

  while (currentParentId) {
    if (currentParentId === potentialAncestorId) return true;
    const parent = nodes.find(n => n._id === currentParentId);
    currentParentId = parent ? parent.parentId : null;
  }

  return false;
};
export const DragContext = createContext<{ activeNode: INode | null }>({
  activeNode: null,
});

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
        // delay: 1,
        // tolerance: 1,
        distance: 1, // Instant activation
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const node = event.active.data.current as INode;
    if (node) setActiveNode(node);
  };

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
    <DragContext.Provider value={{ activeNode }}>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        // collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="h-full">{children}</div>

        <DragOverlay
          className="bg-background h-4!"
          style={{
            width: 'fit-content',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '13px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            margin: 0,
            transition: 'none', // Disables CSS transitions
            animation: 'none', // Disables CSS keyframes
          }}
          modifiers={[snapCenterToCursor]}
          dropAnimation={null}
        >
          <span>{activeNode?.title}</span>
        </DragOverlay>
      </DndContext>
    </DragContext.Provider>
  );
}
