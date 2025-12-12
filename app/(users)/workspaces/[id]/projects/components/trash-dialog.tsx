import {
  AlertDialog,
  AlertDialogAction,
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

interface IProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  loading: boolean;

  item: IProject;
}
export default function TrashDialog({ isOpen, setIsOpen, loading, item }: IProps) {
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    const { title } = values;
    console.log('title', title);
    // setLoading(true);
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <AlertDialogTrigger
          className={'w-auto'}
          disabled={item.role === 'viewer'}
          onClick={() => setIsOpen(true)}
        >
          <TooltipTrigger asChild className="cursor-not-allowed h-auto w-auto">
            <span tabIndex={0} className="h-auto w-auto">
              <div
                className={`${
                  item.role && item.role === 'viewer' && 'opacity-50 cursor-not-allowed'
                } bg-secondary w-full items-center border border-primary/20 flex size-4 px-2 gap-1.5 whitespace-nowrap shrink-0 text-sm h-8 text-primary font-normal rounded-xl hover:text-none cursor-pointer`}
              >
                <Trash className="h-4 w-4" />
              </div>
            </span>
          </TooltipTrigger>
        </AlertDialogTrigger>
        <TooltipContent className="max-w-[200px]" side="top">
          You are about to delete the project. All the data inside of the project will be lost.
        </TooltipContent>
      </Tooltip>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AlertDialogContent
            className=""
            onClick={e => e.preventDefault()}
            onContextMenu={e => e.preventDefault()}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl sm:text-2xl font-bold text-start flex items-center gap-x-1">
                <TriangleAlert className="text-red-500 h-9 w-9" /> Are you sure you want to delete
                this project?
              </AlertDialogTitle>
              <AlertDialogDescription>
                All users will lose access to project{' '}
                <span className="font-bold">{item.title}</span> and all backup snapshots for this
                project will be removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <span>Are you sure you want to proceed?</span>
            <FieldGroup>
              <Field>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type {item.title} to confirm your action</FormLabel>
                      <FormControl>
                        <Input type="title" placeholder={item.title} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>
            </FieldGroup>
            <AlertDialogFooter>
              <AlertDialogCancel type="button" className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-500/90 cursor-pointer"
                disabled={loading}
                // onClick={() => handleDecline()}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </form>
      </Form>
    </AlertDialog>
  );
}
