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
        distance: 0.5, // Instant activation
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const node = event.active.data.current as INode;
    if (node) setActiveNode(node);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveNode(null);
    // ... (Your move mutation logic)
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
