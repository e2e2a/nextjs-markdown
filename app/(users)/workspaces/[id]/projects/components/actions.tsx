import { IProject } from '@/types';
import TrashDialog from './trash-dialog';
import DropdownActions from './dropdown-action';

interface IProps {
  item: IProject;
}

export function Actions({ item }: IProps) {
  return (
    <div className="inline-flex flex-row gap-x-1 items-center justify-center ">
      <DropdownActions item={item} />
      <TrashDialog item={item} />
    </div>
  );
}
