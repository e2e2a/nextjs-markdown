'use client';
import { handleMouseClick } from '@/hooks/handle-mouse-click';
import { NavMain } from './nav-main';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu } from '@/components/ui/sidebar';
import { CopyMinus, FilePlus2, FolderPlus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SidebarContextMenu } from './sidebar-context-menu';
import { useNodeMutations } from '@/hooks/node/useNodeMutations';
import { INode } from '@/types';
import { makeToastError } from '@/lib/toast';
import { useProjectByIdQuery } from '@/hooks/project/useProjectQuery';
import { useParams } from 'next/navigation';
import { Button } from '../ui/button';
import { useNodeStore } from '@/features/editor/stores/nodes';

interface IProps {
  active: INode | null;
  setActive: React.Dispatch<React.SetStateAction<INode | null>>;
}

export function AppSidebar({ active, setActive }: IProps) {
  const params = useParams();
  const pid = params.pid as string;
  const { data: pData, isLoading: pLoading } = useProjectByIdQuery(pid);

  const [isCreating, setIsCreating] = useState(false);
  const { setCollapseAll } = useNodeStore();
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
        node={null}
        setActive={setActive}
      >
        <div className="h-screen overflow-hidden flex flex-col">
          <SidebarHeader className="h-6 p-0">
            <SidebarMenu className="h-6 flex w-full flex-row items-center justify-center px-1 border-b border-border">
              <div className="font-bold truncate uppercase text-sm w-full text-accent-foreground ">
                {pData?.project.title}
              </div>
              <div className="hidden w-full bg-transparent flex-row items-center justify-end h-full gap-x-2 group-hover:flex">
                <Button
                  className="p-0! h-auto cursor-pointer bg-transparent text-inherit hover:text-accent-foreground hover:bg-transparent"
                  onClick={() => setIsCreating(true)}
                >
                  <FilePlus2 className="h-4! w-4!" />
                </Button>
                <Button
                  className="p-0! h-auto cursor-pointer bg-transparent text-inherit hover:text-accent-foreground hover:bg-transparent"
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
                <Button
                  className="p-0! h-auto cursor-pointer bg-transparent text-inherit hover:text-accent-foreground hover:bg-transparent"
                  onClick={() => setCollapseAll(true)}
                >
                  <CopyMinus className="h-4 w-4" />
                </Button>
              </div>
            </SidebarMenu>
          </SidebarHeader>

          <div
            className="h-full overflow-y-auto"
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
            <SidebarContent className="ml-0 p-0! space-y-0! overflow-y-hidden pb-20">
              <NavMain
                submit={submit}
                updateTitle={updateTitle}
                file={file}
                isCreating={isCreating}
                setIsCreating={setIsCreating}
                inputRef={inputRef}
                setFile={setFile}
                active={active}
                setActive={setActive}
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
