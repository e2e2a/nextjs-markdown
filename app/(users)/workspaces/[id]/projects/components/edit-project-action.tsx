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
import { registerSchema } from '@/lib/validators/register';
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
import { Field, FieldGroup } from '@/components/ui/field';
import { projectSchema } from '@/lib/validators/project';
import { IProject } from '@/types';

interface IProps {
  item: IProject;
}

export function EditProjectAction({ item }: IProps) {
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
    <Dialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start px-2 font-normal cursor-pointer"
            >
              Open Dialog
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] top-[5%] translate-y-0">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>Change the name of the project markdown below.</DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="title" placeholder={item.title} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Rename Project</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
