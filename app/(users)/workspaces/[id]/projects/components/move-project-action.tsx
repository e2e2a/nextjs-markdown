import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { FormField, FormItem, FormControl, FormMessage, Form } from '@/components/ui/form';
import { Field, FieldGroup } from '@/components/ui/field';
import { projectSchema } from '@/lib/validators/project';
import { IProject, IWorkspace } from '@/types';
import { useProjectMutations } from '@/hooks/project/useProjectMutations';
import { makeToastError, makeToastSucess } from '@/lib/toast';
import { useState } from 'react';
import { useGetUserWorkspaces } from '@/hooks/workspace/useQuery';
import { useSession } from 'next-auth/react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface IProps {
  item: IProject;
}

export function MoveProjectAction({ item }: IProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('');

  const { data: session } = useSession();
  const { data: wData, isLoading: wLoading } = useGetUserWorkspaces(session?.user?._id as string);
  const mutation = useProjectMutations();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    setLoading(true);
    const { title } = values;
    mutation.update.mutate(
      { wid: item.workspaceId, title, pid: item._id },
      {
        onSuccess: () => {
          setOpen(false);
          makeToastSucess('Project Name has been updated.');
          return;
        },
        onError: err => {
          makeToastError(err.message);
          return;
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  const title = useWatch({
    control: form.control,
    name: 'title',
  });
  if (wLoading) return;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start px-2 font-normal cursor-pointer">
          Move Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] top-[5%] translate-y-0 rounded-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Move Project</DialogTitle>
              <DialogDescription>
                You are about to move this project to another organization.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="title" placeholder={item.title} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>
            </FieldGroup>
            <Command>
              <CommandInput placeholder="Search project..." className="h-9" />
              <CommandList>
                <CommandEmpty>No project found.</CommandEmpty>
                <CommandGroup>
                  {wData &&
                    wData.workspaces.length > 0 &&
                    wData.workspaces.map((w: IWorkspace) => (
                      <CommandItem
                        key={w._id}
                        value={w._id}
                        onSelect={() => {
                          setSelectedWorkspace(w._id);
                          setOpen(false);
                        }}
                        className="uppercase"
                      >
                        {w.title}
                        <Check
                          className={cn(
                            'ml-auto',
                            selectedWorkspace === w._id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="cursor-pointer" disabled={!title || loading}>
                Rename Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
