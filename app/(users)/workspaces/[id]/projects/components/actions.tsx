import { IProject } from '@/types';
import TrashDialog from './trash-dialog';
import DropdownActions from './dropdown-action';
import { useParams } from 'next/navigation';

interface IProps {
  item: IProject;
}

export function Actions({ item }: IProps) {
  const params = useParams();
  const workspaceId = params.id as string;
  return (
    <div className="inline-flex flex-row gap-x-1.5 items-center justify-center ">
      <DropdownActions item={item} workspaceId={workspaceId} />
      <TrashDialog item={item} workspaceId={workspaceId} />
    </div>
  );
}
