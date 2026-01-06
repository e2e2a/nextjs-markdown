'use client';
import { handleMouseClick } from '@/hooks/handle-mouse-click';
import { NavMain } from './nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { CopyMinus, FilePlus2, FolderPlus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SidebarContextMenu } from './sidebar-context-menu';
import { useNodeMutations } from '@/hooks/node/useNodeMutations';
import { INode } from '@/types';
import { makeToastError } from '@/lib/toast';
import { useProjectByIdQuery } from '@/hooks/project/useProjectQuery';
import { useParams } from 'next/navigation';
import { Button } from '../ui/button';

interface IProps {
  active: Partial<INode> | null;
  setActive: React.Dispatch<React.SetStateAction<Partial<INode> | null>>;
  nodes: INode[];
}

export function AppSidebar({ active, setActive, nodes }: IProps) {
  const params = useParams();
  const pid = params.pid as string;
  const { data: pData, isLoading: pLoading } = useProjectByIdQuery(pid);

  const [isCreating, setIsCreating] = useState(false);
  const [collapseAll, setCollapseAll] = useState(false);
  const [file, setFile] = useState<{
    name: string;
    type: string;
    oldName?: string;
  }>({ name: '', type: '' });

  const [updateNode, setUpdateNode] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mutation = useNodeMutations();

  const submit = useCallback(
    (data: { name: string; type: string }) => {
      const trimmed = data.name.trim();
      if (!trimmed) {
        setIsCreating(false);
        setFile({ name: '', oldName: '', type: '' });
        return;
      }

      const payload = {
        projectId: pData?.project._id.toString(),
        parentId: active?.type === 'folder' ? active._id : active?.parentId,
        title: data.name,
        type: data.type,
      };

      mutation.create.mutate(payload, {
        onSuccess: () => {
          setIsCreating(false);
          setFile({ name: '', type: '' });
          return;
        },
        onError: err => {
          setIsCreating(false);
          makeToastError(err.message);
          setFile({ name: '', type: '' });
          return;
        },
      });
    },
    [mutation, pData, active]
  );

  const updateTitle = useCallback(
    (data: { name: string; oldName?: string; type: string }) => {
      const trimmed = data.name.trim();
      if (!trimmed) {
        setIsCreating(false);
        setFile({ name: '', oldName: '', type: '' });
        return;
      }
      if (data.name && data.oldName && data.oldName === data.name) {
        setUpdateNode(false);
        setFile({ name: '', oldName: '', type: '' });
        return;
      }
      const payload = {
        projectId: active?.projectId as string,
        _id: active?._id as string,
        type: active?.type,
        title: data.name,
        content: null,
      };

      mutation.update.mutate(payload, {
        onSuccess: () => {
          setUpdateNode(false);
          setFile({ name: '', oldName: '', type: '' });
          return;
        },
        onError: err => {
          makeToastError(err.message);
          setUpdateNode(false);
          setFile({ name: '', oldName: '', type: '' });
          return;
        },
      });
    },
    [active, mutation]
  );

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const input = inputRef.current;
      if (input && input.contains(e.target as Node)) return;
      if (input && !input.contains(e.target as Node)) {
        if (!input.value) {
          setIsCreating(false);
          setUpdateNode(false);
          setFile({ name: '', oldName: '', type: '' });
          return;
        }
        if (isCreating) submit(file);

        if (updateNode) {
          updateTitle(file);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('contextmenu', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('contextmenu', handleOutsideClick);
    };
  }, [updateTitle, isCreating, updateNode, file, inputRef, submit]);

  useEffect(() => {
    if (isCreating || updateNode) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          requestAnimationFrame(() => {
            inputRef.current?.focus();
          });
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isCreating, updateNode]);

  if (pLoading) return;
  return (
    <Sidebar
      className="group left-12 w-full border-r bg-none p-0 text-neutral-400"
      collapsible="none"
      variant="inset"
    >
      <SidebarContextMenu
        setFile={setFile}
        setIsCreating={setIsCreating}
        itemType={''}
        /** For updating */
        node={null}
        setActive={setActive}
        setUpdateNode={setUpdateNode}
      >
        <div className="min-h-screen">
          <SidebarHeader className="h-6 p-0">
            <SidebarMenu className="h-6 flex w-full flex-row items-center justify-center">
              <div className="font-bold truncate uppercase text-sm w-full text-accent-foreground">
                {pData?.project.title}
              </div>
              <div className="hidden w-full flex-row items-center justify-end h-full gap-x-2 group-hover:flex">
                <SidebarMenuItem className="p-0">
                  <Button
                    className="p-0! cursor-pointer"
                    variant={'ghost'}
                    onClick={() => setIsCreating(true)}
                  >
                    <FilePlus2 className="h-4! w-4!" />
                  </Button>
                </SidebarMenuItem>
                <SidebarMenuItem className="p-0">
                  <Button
                    className="p-0! cursor-pointer"
                    variant={'ghost'}
                    onClick={() => {
                      setIsCreating(true);
                      setFile(val => ({
                        name: val.name,
                        oldName: '',
                        type: 'folder',
                      }));
                    }}
                  >
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </SidebarMenuItem>
                <SidebarMenuItem className="p-0">
                  <Button
                    className="p-0! cursor-pointer"
                    variant={'ghost'}
                    onClick={() => setCollapseAll(true)}
                  >
                    <CopyMinus className="h-4 w-4" />
                  </Button>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarHeader>

          <div
            className="h-[calc(100vh-20px)] overflow-y-auto text-neutral-400"
            onMouseDown={e =>
              handleMouseClick(
                file,
                updateTitle,
                e,
                null,
                active,
                setActive,
                isCreating,
                setIsCreating,
                updateNode,
                setUpdateNode
              )
            }
          >
            <SidebarContent className="ml-0 p-0 overflow-y-hidden pb-20">
              <NavMain
                collapseAll={collapseAll}
                setCollapseAll={setCollapseAll}
                submit={submit}
                updateTitle={updateTitle}
                file={file}
                isCreating={isCreating}
                setIsCreating={setIsCreating}
                inputRef={inputRef}
                setFile={setFile}
                active={active}
                setActive={setActive}
                items={nodes as INode[]}
                /** For updating */
                updateNode={updateNode}
                setUpdateNode={setUpdateNode}
              />
            </SidebarContent>
          </div>
        </div>
      </SidebarContextMenu>
    </Sidebar>
  );
}
