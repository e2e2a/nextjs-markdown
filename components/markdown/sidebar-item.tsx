'use client';
import React, { useEffect, useState } from 'react';
import { ChevronRight, Folder, FolderOpen, File } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';
import { SidebarContextMenu } from './sidebar-context-menu';
import { cn } from '@/lib/utils';
import { handleMouseClick } from '@/hooks/handle-mouse-click';
import { INode } from '@/types';

interface IProps {
  updateTitle: (data: { name: string; oldName?: string; type: string }) => void;
  collapseAll: boolean;
  setCollapseAll: React.Dispatch<React.SetStateAction<boolean>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  file: { name: string; oldName?: string; type: string };
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  setFile: React.Dispatch<React.SetStateAction<{ name: string; oldName?: string; type: string }>>;
  item: INode;
  active: Partial<INode> | null;
  setActive: React.Dispatch<React.SetStateAction<Partial<INode> | null>>;
  //** For updating */
  updateNode: boolean;
  setUpdateNode: React.Dispatch<React.SetStateAction<boolean>>;
  depth: number;
}

export default function SidebarItem({
  updateTitle,
  collapseAll,
  setCollapseAll,
  handleKeyDown,
  file = { name: '', oldName: '', type: '' },
  isCreating,
  setIsCreating,
  inputRef,
  setFile,
  item,
  active,
  setActive,
  updateNode,
  setUpdateNode,
  depth,
}: IProps) {
  const localStorageKey = `sidebar-open-${item._id}`;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(localStorageKey);
      if (stored === 'true') {
        setTimeout(() => {
          setIsOpen(true);
        }, 50);
      }
    } catch {
      return; // ignore read errors
    }
  }, [localStorageKey]);

  useEffect(() => {
    if (collapseAll) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('folder-')) localStorage.setItem(key, 'false');
      });
      requestAnimationFrame(() => {
        setIsOpen(false);
        setCollapseAll(false);
      });
    }
    return;
  }, [collapseAll]);

  useEffect(() => {
    localStorage.setItem(localStorageKey, String(isOpen));
  }, [localStorageKey, isOpen]);
  useEffect(() => {
    if (isCreating)
      if (item._id === active?._id) {
        requestAnimationFrame(() => {
          setIsOpen(true);
        });
        return;
      }
  }, [isCreating]);

  const handleKeyF2 = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'F2') {
      setUpdateNode(true);
      setFile({
        name: item?.title || '',
        oldName: item?.title || '',
        type: item?.type || '',
      });
      e.preventDefault();
    }
  };

  if (item.type === 'file' && item.parentId && !item.children?.length) {
    return (
      <SidebarMenuButton
        tooltip={{ children: item.title }}
        onKeyDown={handleKeyF2}
        onMouseDown={e =>
          handleMouseClick(
            file,
            updateTitle,
            e,
            {
              ...item,
              ...(item.parentId ? { parentId: String(item.parentId) } : {}),
            },
            active,
            setActive,
            isCreating,
            setIsCreating,
            updateNode,
            setUpdateNode
          )
        }
        className={cn(
          active && active._id == item._id ? 'bg-gray-200 text-black' : '',
          'm-0 h-4.5 gap-0 hover:bg-gray-200 pl-5 rounded-none cursor-pointer active:bg-transparent hover:text-black focus-visible:outline-none focus-visible:ring-0'
        )}
        style={{
          paddingLeft: `${15 + depth * 8}px`,
        }}
      >
        <div className="flex items-center m-0 p-0 truncate w-full">
          <File className={`w-4 h-4 min-w-4 min-h-4`} />
          {updateNode && active && active._id === item._id ? (
            <input
              ref={inputRef}
              value={file.name}
              autoFocus
              onMouseDown={e => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              onClick={e => e.stopPropagation()}
              onChange={e => setFile({ name: e.target.value, type: file.type })}
              className="w-full flex pb-1.5 font-normal h-4 z-100 border focus:outline-none focus:ring-0 focus:ring-none focus:ring-offset-2 border-blue-300 text-sm text-black py-1 rounded-none"
            />
          ) : (
            <p className="truncate">{item.title}</p>
          )}
        </div>
      </SidebarMenuButton>
    );
  }

  if (item.type === 'file' && !item.parentId && !item.children?.length) {
    return (
      <SidebarContextMenu
        setFile={setFile}
        setIsCreating={setIsCreating}
        itemType={item.type}
        /** For updating */
        node={item}
        active={active}
        setActive={setActive}
        updateNode={updateNode}
        setUpdateNode={setUpdateNode}
        setIsOpen={setIsOpen}
      >
        <SidebarMenuItem
          className={cn(
            'pl-2 hover:bg-gray-200 active:bg-gray-200 text-sidebar-foreground/70 font-medium text-sm rounded-none',
            active && active._id == item._id ? 'bg-gray-200 text-black' : ''
          )}
          onKeyDown={handleKeyF2}
        >
          <SidebarMenuButton
            tooltip={{ children: item.title }}
            onMouseDown={e =>
              handleMouseClick(
                file,
                updateTitle,
                e,
                {
                  ...item,
                  ...(item.parentId ? { parentId: String(item.parentId) } : {}),
                },
                active,
                setActive,
                isCreating,
                setIsCreating,
                updateNode,
                setUpdateNode
              )
            }
            className="m-0 pr-0 h-4.5 gap-0 rounded-none active:bg-transparent cursor-pointer hover:bg-transparent hover:text-black focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="flex items-center m-0 p-0 truncate w-full">
              <File className={`w-4 h-4 min-w-4 min-h-4`} />
              {updateNode && active && active._id === item._id ? (
                <input
                  ref={inputRef}
                  onMouseDown={e => e.stopPropagation()}
                  value={file.name}
                  autoFocus
                  onClick={e => e.stopPropagation()}
                  onKeyDown={handleKeyDown}
                  onChange={e => setFile({ name: e.target.value, type: file.type })}
                  className="w-full flex pb-1.5 font-normal h-4 z-100 border focus:outline-none focus:ring-0 focus:ring-none focus:ring-offset-2 border-blue-300 text-sm text-black py-1 rounded-none"
                />
              ) : (
                <p className="truncate">{item.title}</p>
              )}
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarContextMenu>
    );
  }

  return (
    <>
      <SidebarMenu className="gap-0">
        <Collapsible key={item.title} open={isOpen} onOpenChange={setIsOpen} className="gap-0">
          <SidebarGroup className="p-0">
            <SidebarGroupLabel asChild className="rounded-none text-sm">
              <CollapsibleTrigger
                disabled={updateNode}
                asChild
                className={cn(
                  'bg-transparent border-none outline-none shadow-none hover:bg-transparent! focus:outline-none focus:ring-0',
                  'overflow-hidden cursor-pointer p-0'
                )}
              >
                <SidebarMenuItem
                  className={cn(
                    'gap-0 p-0 h-4.5 w-full  focus:outline-none',
                    active?._id === item._id ? 'bg-gray-200 text-black' : ''
                  )}
                  tabIndex={0}
                  onKeyDown={handleKeyF2}
                >
                  <SidebarContextMenu
                    setFile={setFile}
                    setIsCreating={setIsCreating}
                    itemType={item.type}
                    /** For updating */
                    node={item}
                    active={active}
                    setActive={setActive}
                    updateNode={updateNode}
                    setUpdateNode={setUpdateNode}
                    setIsOpen={setIsOpen}
                  >
                    <SidebarMenuButton
                      onMouseDown={e =>
                        handleMouseClick(
                          file,
                          updateTitle,
                          e,
                          {
                            ...item,
                            ...(item.parentId
                              ? {
                                  parentId:
                                    item.type === 'folder'
                                      ? (item._id as string)
                                      : item.parentId
                                      ? String(item.parentId)
                                      : '',
                                }
                              : {}),
                          },
                          active,
                          setActive,
                          isCreating,
                          setIsCreating,
                          updateNode,
                          setUpdateNode
                        )
                      }
                      className={cn(
                        'bg-transparent border-none outline-none shadow-none focus:outline-none focus:ring-0',
                        'w-full p-0 gap-0 h-4.5 font-medium active:bg-gray-200 hover:bg-gray-200 rounded-none cursor-pointer **:hover:text-black'
                      )}
                      style={{
                        paddingLeft: `${depth * 8}px`, // indentation
                      }}
                    >
                      <ChevronRight className={`${isOpen ? 'rotate-90' : 'rotate-0'}`} />
                      <div className="flex items-center p-0 text-sidebar-foreground/70 truncate w-full">
                        {updateNode && active && active._id === item._id ? (
                          <>
                            <Folder className={`w-4 h-4 min-w-4 min-h-4`} />
                            <div className="truncate bg-transparent w-full">
                              <input
                                ref={inputRef}
                                autoFocus
                                onMouseDown={e => e.stopPropagation()}
                                onKeyDown={handleKeyDown}
                                value={file.name}
                                onFocus={e => e.stopPropagation()}
                                onClick={e => e.stopPropagation()}
                                onChange={e => setFile({ name: e.target.value, type: file.type })}
                                className="w-full flex px-0 pb-1.5 font-normal h-4 border focus:outline-none focus:ring-0 focus:ring-none focus:ring-offset-2 border-blue-300 text-sm text-black py-1 rounded-none"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            {isOpen ? (
                              <FolderOpen className={`w-4 h-4 min-w-4 min-h-4`} />
                            ) : (
                              <Folder className={`w-4 h-4 min-w-4 min-h-4`} />
                            )}
                            <p className="truncate">{item.title}</p>
                          </>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarContextMenu>
                </SidebarMenuItem>
              </CollapsibleTrigger>
            </SidebarGroupLabel>

            <CollapsibleContent className="gap-0">
              <SidebarGroupContent className="gap-0">
                <SidebarMenu className="gap-0">
                  {isCreating &&
                    active &&
                    ((active.type === 'folder' && active._id === item._id) ||
                      (active.type === 'file' &&
                        active.parentId &&
                        active.parentId === item._id)) && (
                      <SidebarContextMenu
                        setFile={setFile}
                        setIsCreating={setIsCreating}
                        itemType={item.type}
                        /** For updating */
                        node={item}
                        active={active}
                        setActive={setActive}
                        updateNode={updateNode}
                        setUpdateNode={setUpdateNode}
                        setIsOpen={setIsOpen}
                      >
                        <SidebarMenuItem
                          className={cn(
                            'hover:bg-gray-200 text-sidebar-foreground/70 font-medium text-sm rounded-none'
                          )}
                          style={{
                            paddingLeft: `${(file.type === 'folder' ? 8 : 15) + depth * 8}px`,
                          }}
                        >
                          {file && file.type === 'folder' ? (
                            <SidebarMenuButton
                              className={cn(
                                'p-0 gap-0 h-4.5 font-medium rounded-none cursor-pointer active:bg-transparent text-black'
                              )}
                            >
                              <ChevronRight className={''} />
                              <div className="flex items-center gap-0.5">
                                <Folder className={`w-4 h-4 min-w-4 min-h-4`} />
                                <p className="truncate pr-5">
                                  <input
                                    ref={inputRef}
                                    autoFocus
                                    onMouseDown={e => e.stopPropagation()}
                                    value={file.name}
                                    onClick={e => e.stopPropagation()}
                                    onKeyDown={handleKeyDown}
                                    onChange={e =>
                                      setFile({ name: e.target.value, type: file.type })
                                    }
                                    className="w-full flex pb-1.5 font-normal h-4 border focus:outline-none focus:ring-0 focus:ring-none active:bg-transparent focus:ring-offset-2 border-blue-300 text-sm text-black py-1 rounded-none"
                                  />
                                </p>
                              </div>
                            </SidebarMenuButton>
                          ) : (
                            <SidebarMenuButton className="m-0 h-4.5 gap-0 rounded-none cursor-pointer hover:bg-transparent hover:text-black active:bg-transparent">
                              <div className="flex items-center m-0 p-0">
                                <File className={`min-w-4 min-h-4 h-4 w-4`} />
                                <input
                                  ref={inputRef}
                                  value={file.name}
                                  autoFocus
                                  onMouseDown={e => e.stopPropagation()}
                                  onKeyDown={handleKeyDown}
                                  onClick={e => e.stopPropagation()}
                                  onChange={e => setFile({ name: e.target.value, type: file.type })}
                                  className="w-full flex pb-1.5 font-normal h-4 z-100 border focus:outline-none focus:ring-0 focus:ring-none focus:ring-offset-2 border-blue-300 text-sm text-black py-1 rounded-none"
                                />
                              </div>
                            </SidebarMenuButton>
                          )}
                        </SidebarMenuItem>
                      </SidebarContextMenu>
                    )}
                  {item.children.map((child, i) => {
                    return (
                      <SidebarContextMenu
                        setFile={setFile}
                        setIsCreating={setIsCreating}
                        key={i}
                        itemType={child.type as string}
                        /** For updating */
                        node={child}
                        active={active}
                        setActive={setActive}
                        updateNode={updateNode}
                        setUpdateNode={setUpdateNode}
                        setIsOpen={setIsOpen}
                      >
                        <SidebarMenuItem
                          className={cn(
                            'flex text-sidebar-foreground/70 font-medium text-sm rounded-none focus:outline-none outline-none focus:ring-0'
                          )}
                        >
                          <SidebarItem
                            updateTitle={updateTitle}
                            collapseAll={collapseAll}
                            setCollapseAll={setCollapseAll}
                            handleKeyDown={handleKeyDown}
                            file={file}
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            inputRef={inputRef}
                            setFile={setFile}
                            active={active}
                            setActive={setActive}
                            item={child as INode}
                            updateNode={updateNode}
                            setUpdateNode={setUpdateNode}
                            depth={depth + 1}
                          />
                        </SidebarMenuItem>
                      </SidebarContextMenu>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarMenu>
    </>
  );
}
