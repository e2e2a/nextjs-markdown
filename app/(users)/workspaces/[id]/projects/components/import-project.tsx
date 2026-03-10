import React from 'react';
import { useProjectMutations } from '@/hooks/project/useProjectMutations';
import { makeToastError, makeToastSucess } from '@/lib/toast';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FolderDownIcon } from 'lucide-react';
const ImportProject = ({ workspaceId }: { workspaceId: string }) => {
  const { importProject } = useProjectMutations();
  const [status, setStatus] = useState<'idle' | 'scanning' | 'uploading'>('idle');
  const [count, setCount] = useState(0);

  type NodeItem = {
    name: string;
    path: string;
    type: 'file' | 'folder';
    content?: string;
  };

  const handleFolderImport = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      setStatus('scanning');
      const nodes: NodeItem[] = [];

      const walkDirectory = async (dirHandle: FileSystemDirectoryHandle, currentPath: string = '') => {
        for await (const [name, handle] of dirHandle.entries()) {
          const fullPath = currentPath ? `${currentPath}/${name}` : name;

          if (handle.kind === 'directory') {
            nodes.push({
              name,
              path: fullPath,
              type: 'folder',
            });

            await walkDirectory(handle, fullPath);
          } else {
            const file = await handle.getFile();
            const content = await file.text();
            nodes.push({ name: handle.name, path: fullPath, type: 'file', content });

            setCount(prev => prev + 1);
          }

          if (handle.kind === 'file') {
            const file = await handle.getFile();
            const content = await file.text();
            console.log('contents', content);
            nodes.push({
              name,
              path: fullPath,
              type: 'file',
              content,
            });
          }
        }
      };

      await walkDirectory(dirHandle);
      setStatus('uploading');
      const payload = {
        workspaceId,
        title: dirHandle.name,
        nodes,
      };
      importProject.mutate(payload, {
        onSuccess: () => {
          makeToastSucess('Project Name has been updated.');
          return;
        },
        onError: err => {
          makeToastError(err.message);
          return;
        },
        onSettled: () => {
          setStatus('idle');
        },
      });
    } catch (err) {
      setStatus('idle');
      console.error('Folder import cancelled or failed', err);
    }
  };
  return (
    <Button className="cursor-pointer" type="button" onClick={handleFolderImport} disabled={status !== 'idle'}>
      <FolderDownIcon className={`h-4 w-4 ${status === 'uploading' ? 'animate-bounce' : ''}`} />
      {status === 'scanning' && `Scanning (${count})...`}
      {status === 'uploading' && 'Saving to Cloud...'}
      {status === 'idle' && 'Import Folder'}
    </Button>
  );
};

export default ImportProject;
