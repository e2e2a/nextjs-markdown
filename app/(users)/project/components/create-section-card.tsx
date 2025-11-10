import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectMutations } from '@/hooks/project/useProjectMutations';
import { makeToastError } from '@/lib/toast';
import { FolderPlus } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
interface IProps {
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
}
export function CreateSectionCard({ setIsCreating }: IProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const mutation = useProjectMutations();

  const submit = useCallback(
    (data: { name: string }) => {
      const payload = {
        userId: '665b09bf080766539a81e938',
        title: data.name,
      };

      mutation.create.mutate(payload, {
        onSuccess: () => {
          setIsCreating(false);
          return;
        },
        onError: err => {
          setIsCreating(false);
          makeToastError(err.message);
          return;
        },
      });
    },
    [mutation, setIsCreating]
  );

  return (
    <div className="">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            <FolderPlus className="" />
          </CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <input
              type="text"
              ref={inputRef}
              value={value}
              autoFocus
              onChange={e => setValue(e.target.value)}
              className="bg-transparent border-0 w-full outline-none focus-visible:ring-0 focus:ring-0 p-0 m-0 border-b border-blue-400"
            />
          </CardTitle>
          <div className="flex items-center justify-end text-sm w-full">
            <Button
              size={'sm'}
              className="bg-blue-600 hover:bg-blue-600/90 text-white cursor-pointer py-[3px] text-sm"
              onClick={() => submit({ name: value })}
            >
              Submit
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
