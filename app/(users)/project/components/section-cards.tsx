import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FolderOpenDot, FolderPen, X } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '../../../../components/ui/skeleton';
import { CreateSectionCard } from './create-section-card';
import { CardOptions } from './card-options';
import { useCallback, useRef, useState } from 'react';
import { IProject } from '@/types';
import { Button } from '@/components/ui/button';
import { useProjectMutations } from '@/hooks/project/useProjectMutations';
import { makeToastError } from '@/lib/toast';

export function SectionCards({
  isCreating,
  setIsCreating,
  loading,
  projects,
}: {
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  projects: IProject[];
}) {
  const [update, setUpdate] = useState<{ _id: string; oldTitle: string; isUpdating: boolean }>({
    _id: '',
    oldTitle: '',
    isUpdating: false,
  });
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const mutation = useProjectMutations();

  const cancel = useCallback(() => {
    setUpdate({
      _id: '',
      oldTitle: '',
      isUpdating: false,
    });
    return;
  }, []);

  const handleUpdate = useCallback(
    (data: {
      _id: string;
      oldTitle?: string;
      title?: string;
      archived?: { isArchived: boolean; archivedAt: Date };
    }) => {
      if (data.oldTitle && data.title && data.oldTitle.toLowerCase() === data.title.toLowerCase())
        return cancel();
      const payload = {
        _id: data._id,
        ...(data.title ? { title: data.title } : {}),
        ...(data.archived ? { archived: data.archived } : {}),
      };

      mutation.update.mutate(payload, {
        onSuccess: () => {
          cancel();
          return;
        },
        onError: err => {
          cancel();
          makeToastError(err.message);
          return;
        },
      });
    },

    [mutation, cancel]
  );
  if (loading) {
    return (
      <div className="w-full *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="@container/card gap-3">
            <CardHeader className="gap-0">
              <CardDescription>
                <Skeleton className="h-7 w-7 rounded-sm" />
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <Skeleton className="h-4 w-full" />
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <Skeleton className="h-4 w-[50px]" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!isCreating && (!projects || projects.length === 0)) {
    return (
      <div className="w-full">
        {!isCreating && <div className="text-center">No Projects Found</div>}
      </div>
    );
  }
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {isCreating && <CreateSectionCard setIsCreating={setIsCreating} />}

      {projects && projects.length > 0 && (
        <>
          {projects.map((project, idx) => (
            <div key={idx}>
              {!update.isUpdating || (update.isUpdating && update._id !== project._id) ? (
                <Link href={`project/${project._id}`}>
                  <Card className="@container/card gap-3">
                    <CardHeader className="gap-0">
                      <CardDescription className="flex items-center justify-between">
                        <FolderOpenDot className="" />
                        <div className="">
                          <CardOptions
                            project={project as IProject}
                            setUpdate={setUpdate}
                            setValue={setValue}
                            handleUpdate={handleUpdate}
                          />
                        </div>
                      </CardDescription>

                      <CardTitle
                        title={project.title}
                        className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl truncate"
                      >
                        <h3 className="truncate">{project.title}</h3>
                      </CardTitle>
                    </CardHeader>

                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>2025-05-03</span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Last updated: 2025-05-03</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardFooter>
                  </Card>
                </Link>
              ) : (
                <Card className="@container/card">
                  <CardHeader className="gap-1">
                    <CardDescription className="flex items-center justify-between">
                      <FolderPen className="" />
                      <div
                        onClick={cancel}
                        className="text-red-600 hover:text-red-600/80 cursor-pointer"
                      >
                        <X />
                      </div>
                    </CardDescription>

                    <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
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
                        onClick={() =>
                          handleUpdate({ _id: update._id, oldTitle: update.oldTitle, title: value })
                        }
                      >
                        Update
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
