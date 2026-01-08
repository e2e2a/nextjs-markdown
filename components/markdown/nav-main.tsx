import { SidebarGroup, SidebarMenuButton } from '@/components/ui/sidebar';
import SidebarItem from './sidebar-item';
import { ChevronRight, Folder, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { INode } from '@/types';
import { useNodesProjectIdQuery } from '@/hooks/node/useNodeQuery';
import { useParams } from 'next/navigation';

export function NavMain({
  submit,
  updateTitle,
  file = { name: '', type: '' },
  isCreating,
  setIsCreating,
  inputRef,
  setFile,
  active,
  setActive,
  updateNode,
  setUpdateNode,
}: {
  submit: (data: { name: string; type: string }) => void;
  updateTitle: (data: { name: string; oldName?: string; type: string }) => void;
  file: { name: string; type: string };
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  setFile: React.Dispatch<React.SetStateAction<{ name: string; oldName?: string; type: string }>>;
  active: INode | null;
  setActive: React.Dispatch<React.SetStateAction<INode | null>>;
  //** For updating */
  updateNode: boolean;
  setUpdateNode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const params = useParams();
  const pid = params.pid as string;
  const { data: nData, isLoading: nLoading, error: nError } = useNodesProjectIdQuery(pid);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (isCreating) submit(file);
      if (updateNode) updateTitle(file);
    }
    if (e.key === 'Escape') {
      setIsCreating(false);
      setFile({ name: '', oldName: '', type: '' });
    }
  };

  if (nLoading) return <div>Loading...</div>;
  if (nError) return;

  return (
    <SidebarGroup className="gap-0! p-0! m-0! space-y-0! h-auto! px-0!">
      {nData?.nodes.map((item: INode, index: number) => {
        return (
          <div className="" key={index}>
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
              item={item as INode}
              /** For updating */
              updateNode={updateNode}
              setUpdateNode={setUpdateNode}
              depth={0}
            />
          </div>
        );
      })}
      {isCreating && active == null && (
        <div className="gap-0 p-0 h-4.5 ">
          {file && file.type === 'folder' ? (
            <SidebarMenuButton
              className={cn('p-0 gap-0 h-4.5 font-medium rounded-none text-black')}
              style={{
                paddingLeft: `${0 * 8}px`,
              }}
            >
              <ChevronRight className={''} />
              <div className="flex items-center gap-0.5">
                <Folder className={`w-4 h-4 min-w-4 min-h-4`} />
                <div className="truncate pr-5">
                  <input
                    ref={inputRef}
                    value={file.name}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    onChange={e => setFile({ name: e.target.value, type: file.type })}
                    className="w-full flex pb-1.5 font-normal h-4 border focus:outline-none focus:ring-0 focus:ring-none focus:ring-offset-2 border-blue-300 text-sm text-black px-2 py-1 rounded-none"
                  />
                </div>
              </div>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton className="m-0 h-4.5 gap-0 rounded-none cursor-point bg-transparent text-black">
              <div className="flex items-center m-0 pl-2">
                <File className={`min-w-4 min-h-4 h-4 w-4`} />
                <input
                  ref={inputRef}
                  value={file.name}
                  autoFocus
                  onKeyDown={handleKeyDown}
                  onChange={e => setFile({ name: e.target.value, type: file.type })}
                  className="w-full flex pb-1.5 font-normal h-4 border focus:outline-none focus:ring-0 focus:ring-none focus:ring-offset-2 border-blue-300 text-sm text-black px-2 py-1 rounded-none"
                />
              </div>
            </SidebarMenuButton>
          )}
        </div>
      )}
    </SidebarGroup>
  );
}
