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
import { cn } from '@/lib/utils';
import { UserPlus } from 'lucide-react';
import { ProjectCombobox } from './project-combobox';
import { emailSchema } from '@/lib/validators/email';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { makeToastError, makeToastSucess } from '@/lib/toast';
import { projectIdSchema } from '@/lib/validators/projectId';
import { useProjectsByUserIdQuery } from '@/hooks/project/useProjectQuery';
import { useSession } from 'next-auth/react';
import { useMemberMutations } from '@/hooks/member/useMemberMutations';

const formSchema = z.object({}).merge(emailSchema).merge(projectIdSchema);

export function InviteDialog() {
  const { data: session, status } = useSession();
  const { data: projects } = useProjectsByUserIdQuery(session?.user?._id as string);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      projectId: '',
    },
  });

  const mutation = useMemberMutations();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutation.inviteMember.mutate(values, {
      onSuccess: async () => {
        form.reset();
        makeToastSucess('Invitation Send.');
        return;
      },
      onError: err => {
        makeToastError(err.message);
        return;
      },
    });
  };

  if (status === 'loading') return;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn(
            'w-auto flex-1 rounded-sm border border-blue-600 p-2 text-blue-600 hover:bg-blue-600/20 hover:text-blue-600'
          )}
          variant="ghost"
        >
          <span className="inline-flex items-center w-full gap-2">
            <UserPlus /> Invite Member
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] top-4 translate-y-0">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>Send an invitation to a project.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Project</FormLabel>
                  <FormControl>
                    <ProjectCombobox projects={projects || []} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Invite Email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button type="submit">Send Invite</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
