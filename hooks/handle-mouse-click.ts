import { INode } from '@/types';

export function handleMouseClick(
  file: { name: string; oldName?: string; type: string },
  updateTitle: (data: { name: string; oldName?: string; type: string }) => void,
  e: React.MouseEvent,
  data: { _id?: string; parentId?: string } | null,
  active: Partial<INode> | null,
  setActive: React.Dispatch<React.SetStateAction<Partial<INode> | null>>,
  isCreating: boolean,
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>,
  updateNode: boolean,
  setUpdateNode: React.Dispatch<React.SetStateAction<boolean>>
) {
  e.stopPropagation();

  if (e.button === 0 || e.button === 1) {
    if (active?._id !== data?._id) {
      if (isCreating) {
        setIsCreating(false);
      }
      if (updateNode) {
        updateTitle(file);
        setUpdateNode(false);
      }
      setActive(data);
    }
  }
  return;
}
