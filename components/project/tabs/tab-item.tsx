'use client';
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tab, useTabStore } from '@/features/editor/stores/tabs';

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  isDropBefore: boolean;
  pid: string;
  draggedTabId: string | null;
  onDragStart: (e: React.DragEvent, tabId: string) => void;
}

export const TabItem = ({ tab, isActive, draggedTabId, isDropBefore, pid, onDragStart }: TabItemProps) => {
  const { setActiveTab, closeTab, pinTab } = useTabStore();
  console.log('draggedTabId', draggedTabId);
  return (
    <div
      key={tab.nodeId}
      data-tab-id={tab.nodeId}
      draggable
      onDragStart={e => onDragStart(e, tab.nodeId)}
      onMouseDown={() => setActiveTab(pid, tab.nodeId)}
      onDoubleClick={() => pinTab(pid, tab.nodeId)}
      onDragEnter={e => e.preventDefault()}
    >
      <div
        className={cn(
          'group relative flex  select-none items-center h-6 px-3 min-w-[120px] max-w-[200px] border-r cursor-pointer transition-colors',
          isActive ? 'bg-background text-foreground' : 'bg-muted/40 text-muted-foreground hover:bg-muted/80'
        )}
      >
        {isActive && <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500 " />}

        {isDropBefore && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-blue-500 z-50" />}

        <span className={cn('text-xs truncate flex-1 select-none', tab.isPreview && 'italic opacity-80')}>{tab.title}</span>

        <div className={cn('ml-2 flex items-center justify-center w-4 h-4', draggedTabId ? 'pointer-events-none' : 'pointer-events-auto')}>
          <X
            className={cn(
              'w-3 h-3 opacity-0 group-hover:opacity-100 hover:bg-accent rounded-sm transition-opacity '
              // !isActive && !isDropBefore ? 'pointer-events-auto' : 'pointer-events-none'
            )}
            onClick={e => {
              e.stopPropagation();
              closeTab(pid, tab.nodeId);
            }}
          />
          {/* {tab.isDirty ? (
            <div className="w-2 h-2 rounded-full bg-foreground/60" />
          ) : (
            <X
              className="w-3 h-3 opacity-0 group-hover:opacity-100 hover:bg-accent rounded-sm transition-opacity"
              onClick={e => {
                e.stopPropagation();
                closeTab(pid, tab.nodeId);
              }}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};
