'use client';
import React, { useEffect, useState } from 'react';
import { ChevronRight, Folder, File } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { SidebarGroupContent, SidebarMenu, SidebarMenuButton } from '../ui/sidebar';
import { SidebarContextMenu } from './sidebar-context-menu';
import { cn } from '@/lib/utils';
import { handleMouseClick } from '@/hooks/handle-mouse-click';
import { INode } from '@/types';
import SidebarFolderItem from './sidebar-folder-item';
import { useNodeStore } from '@/features/editor/stores/nodes';

interface IProps {
  updateTitle: (data: { name: string; oldName?: string; type: string }) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  file: { name: string; oldName?: string; type: string };
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  setFile: React.Dispatch<React.SetStateAction<{ name: string; oldName?: string; type: string }>>;
  item: INode;
  active: INode | null;
  setActive: React.Dispatch<React.SetStateAction<INode | null>>;
  //** For updating */
  updateNode: boolean;
  setUpdateNode: React.Dispatch<React.SetStateAction<boolean>>;
  depth: number;
}

export default function SidebarItem({
  updateTitle,
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
  const localStorageKey = `sidebar-folder-open-${item._id}`;
  const { collapseVersion } = useNodeStore();
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return localStorage.getItem(localStorageKey) === 'true';
    } catch {
      return false;
    }
  });
  const [prevVersion, setPrevVersion] = useState(collapseVersion);

  if (collapseVersion !== prevVersion) {
    setPrevVersion(collapseVersion);
    setIsOpen(false);
  }

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

  if (item.type === 'file' && item.parentId && !item.children?.length) {
    return (
      <SidebarMenuButton
        tooltip={{ children: item.title }}
        // onKeyDown={handleKeyF2}
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
        /** For updating */
        node={item}
        setActive={setActive}
        setIsOpen={setIsOpen}
      >
        <div
          className={cn(
            'pl-2 hover:bg-gray-200 active:bg-gray-200 text-sidebar-foreground/70 font-medium text-sm rounded-none',
            active && active._id == item._id ? 'bg-gray-200 text-black' : ''
          )}
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
        </div>
      </SidebarContextMenu>
    );
  }

  return (
    <>
      <SidebarMenu className="gap-0! p-0! ">
        <Collapsible
          key={item.title}
          open={isOpen}
          onOpenChange={setIsOpen}
          className={cn('leading-none')}
        >
          <CollapsibleTrigger disabled={updateNode} asChild>
            <div className={cn('w-full focus:outline-none')}>
              <SidebarContextMenu
                setFile={setFile}
                setIsCreating={setIsCreating}
                node={item}
                setActive={setActive}
                setIsOpen={setIsOpen}
              >
                <div className="">
                  <SidebarFolderItem item={item} isOpen={isOpen} depth={depth} />
                </div>
              </SidebarContextMenu>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="gap-0 m-0! p-0!">
            <SidebarGroupContent className="gap-0 m-0! space-0! p-0!">
              <SidebarMenu className="gap-0 m-0! space-0! p-0!">
                {isCreating &&
                  active &&
                  ((active.type === 'folder' && active._id === item._id) ||
                    (active.type === 'file' &&
                      active.parentId &&
                      active.parentId === item._id)) && (
                    <SidebarContextMenu
                      setFile={setFile}
                      setIsCreating={setIsCreating}
                      /** For updating */
                      node={item}
                      setActive={setActive}
                      setIsOpen={setIsOpen}
                    >
                      <div
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
                                  onChange={e => setFile({ name: e.target.value, type: file.type })}
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
                      </div>
                    </SidebarContextMenu>
                  )}
                {item.children.map((child, i) => {
                  return (
                    <SidebarContextMenu
                      setFile={setFile}
                      setIsCreating={setIsCreating}
                      key={i}
                      /** For updating */
                      node={child}
                      setActive={setActive}
                      setIsOpen={setIsOpen}
                    >
                      <div
                        className={cn(
                          'flex text-sidebar-foreground/70 font-medium text-sm rounded-none focus:outline-none outline-none focus:ring-0'
                        )}
                      >
                        <SidebarItem
                          updateTitle={updateTitle}
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
                      </div>
                    </SidebarContextMenu>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>
    </>
  );
}
