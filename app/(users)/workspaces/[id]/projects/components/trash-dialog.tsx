import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { IProject } from '@/types';
import { Trash, TriangleAlert } from 'lucide-react';
import { Field, FieldGroup } from '@/components/ui/field';
import { projectSchema } from '@/lib/validators/project';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { makeToastError, makeToastSucess } from '@/lib/toast';
import { useProjectMutations } from '@/hooks/project/useProjectMutations';
import { useWorkspaceMember } from '@/context/WorkspaceMember';
import { useState } from 'react';

interface IProps {
  item: IProject;
}

export default function TrashDialog({ item }: IProps) {
  const { membership } = useWorkspaceMember();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [canTrash] = useState(membership.role !== 'viewer');

  const refinedSchema = projectSchema.refine(
    data => {
      if (!data.title) return false;
      return data.title.toLowerCase() === item.title;
    },
    {
      message: 'Please type the correct project name.',
      path: ['title'],
    }
  );
  const mutation = useProjectMutations();
  const form = useForm<z.infer<typeof refinedSchema>>({
    resolver: zodResolver(refinedSchema),
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    mutation.handleDelete.mutate(
      { pid: item._id },
      {
        onSuccess: () => {
          makeToastSucess('Project Name has been updated.');
          setIsOpen(false);
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
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <AlertDialogTrigger
          className={'w-auto'}
          disabled={!canTrash}
          onClick={() => setIsOpen(true)}
        >
          <TooltipTrigger asChild className="cursor-not-allowed h-auto w-auto">
            <span tabIndex={0} className="h-auto w-auto">
              <div
                className={`${
                  !canTrash && 'opacity-50 cursor-not-allowed'
                } bg-secondary w-full items-center border border-primary/20 flex size-4 px-2 gap-1.5 whitespace-nowrap shrink-0 text-sm h-8 text-primary font-normal rounded-lg hover:text-none cursor-pointer`}
              >
                <Trash className="h-4 w-4" />
              </div>
            </span>
          </TooltipTrigger>
        </AlertDialogTrigger>
        <TooltipContent className="max-w-[200px] rounded-lg" side="top">
          You are about to delete the project. All the data inside of the project will be lost.
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent className="flex flex-row gap-x-1">
        <div className=" ">
          <div className="bg-red-200 rounded-full p-1 flex items-center justify-center h-8 w-8">
            <TriangleAlert className="text-red-700 h-5 w-5" />
          </div>
        </div>
        <div className="flex flex-col">
          <AlertDialogHeader className="gap-y-3">
            <AlertDialogTitle className="sm:text-xl text-start font-bold">
              Are you sure you want to delete this project?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black text-start">
              This action cannot be undone. This will permanently delete the project{' '}
              <span className="font-bold">{item.title}</span>, including all associated tasks,
              files, and data. All team members will immediately lose access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="gap-y-3 flex flex-col mt-2">
              <span className="my-3">Are you sure you wish to proceed?</span>
              <FieldGroup>
                <Field>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          Type &quot;{item.title}&quot; to confirm your action
                        </FormLabel>
                        <FormControl>
                          <Input type="title" {...field} autoFocus />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>
              </FieldGroup>
              <AlertDialogFooter className="mt-5">
                <AlertDialogCancel type="button" className="cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <Button
                  className="bg-red-500 hover:bg-red-500/90 cursor-pointer"
                  disabled={loading}
                  type="submit"
                >
                  Continue
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
