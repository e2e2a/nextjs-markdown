'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DraggableButtons() {
  const [buttons] = useState([
    { id: 1, label: 'Button 1' },
    { id: 2, label: 'Button 2' },
    { id: 3, label: 'Button 3' },
  ]);

  const [activeDragId, setActiveDragId] = useState<number | null>(null);
  const targetIdRef = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setActiveDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id.toString());
    // e.preventDefault();
  };

  const handleDragEnd = () => {
    console.log('Final Result: Dragged', activeDragId, 'Dropped on', targetIdRef.current);
    setActiveDragId(null);
    targetIdRef.current = null;
  };

  // Allow drop everywhere inside container
  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // e.stopPropagation();
    // e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="flex h-screen bg-white p-10">
      <div
        className="flex flex-col w-64 bg-amber-300 border border-amber-600 shadow-sm"
        onDragLeave={allowDrop}
        // onDragCapture={allowDrop}
        onDragEnter={e => e.preventDefault()}
        onDragOver={e => e.preventDefault()}
      >
        {buttons.map(item => (
          <div
            key={item.id}
            onDragEnter={() => {
              targetIdRef.current = item.id;
              console.log('Targeting:', item.id);
            }}
            onDragOver={allowDrop} // ✅ CRITICAL FIX
            className={cn(
              'relative w-full border-b border-amber-600/30 last:border-b-0',
              activeDragId === item.id ? 'bg-amber-400/50' : 'bg-transparent'
            )}
          >
            <Button
              draggable
              onDragStart={e => handleDragStart(e, item.id)}
              onDragEnd={handleDragEnd}
              variant="ghost"
              className={cn(
                'w-full justify-start rounded-none h-12 m-0 border-none',
                activeDragId !== null ? '[&>*]:pointer-events-none' : ''
              )}
              style={{
                opacity: activeDragId === item.id ? 0.5 : 1,
              }}
            >
              {item.label}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
