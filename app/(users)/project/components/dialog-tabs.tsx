import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from './data-table';
import { columns } from './columns';
import { IProject, MembersInvited } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from 'lucide-react';
import { emailSchema } from '@/lib/validators/email';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { makeToastError } from '@/lib/toast';
import { useMemberMutations } from '@/hooks/member/useMemberMutations';
import { useMembersByProjectIdQuery } from '@/hooks/member/useMemberQuery';

interface IProps {
  project: IProject;
}

export function DialogTabs({ project }: IProps) {
  const mutation = useMemberMutations();
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const { data: members, isLoading: loading } = useMembersByProjectIdQuery(project?._id as string);

  const onSubmit = async (values: z.infer<typeof emailSchema>) => {
    const payload = {
      projectId: project._id,
      email: values.email,
    };

    mutation.inviteMember.mutate(payload, {
      onSuccess: async () => {
        return;
      },
      onError: err => {
        makeToastError(err.message);
        return;
      },
    });
  };

  return (
    <div className="flex w-full flex-col flex-1 gap-6 h-auto overflow-hidden">
      <Tabs defaultValue="invite" className="flex flex-col h-auto overflow-hidden">
        <TabsList>
          <TabsTrigger value="invite">Invite</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        <TabsContent value="invite" className="overflow-y-auto h-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row w-full gap-x-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        id="email"
                        className="w-full focus:border focus:border-blue-500"
                        placeholder="Invite Members..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
                disabled={false}
                onClick={form.handleSubmit(onSubmit)}
              >
                <SendHorizontal />
              </Button>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="members" className="overflow-y-auto h-auto">
          <div className="grid grid-cols-1 gap-2 overflow">
            <DataTable columns={columns} data={(members || []) as MembersInvited[]} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
