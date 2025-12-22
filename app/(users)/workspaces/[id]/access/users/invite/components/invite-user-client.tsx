'use client';
import { SidebarInset } from '@/components/ui/sidebar';
import { ArrowLeft, SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { emailSchema } from '@/lib/validators/email';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { MemberRole } from './member-role';
import { useSession } from 'next-auth/react';
import { notFound, redirect, useParams, useRouter } from 'next/navigation';
import { workspaceSchema } from '@/lib/validators/workspace';
import { makeToastError } from '@/lib/toast';
import { useProjectMutations } from '@/hooks/project/useProjectMutations';
import Link from 'next/link';
import { useGetMyWorkspaceMembership } from '@/hooks/workspasceMember/useQueries';

export const InviteUserClient = () => {
  const { data: session, status } = useSession();
  const params = useParams();
  const workspaceId = params.id as string;
  const { data: membership, isLoading, error: mError } = useGetMyWorkspaceMembership(workspaceId);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<{ email: string; role: 'owner' | 'editor' | 'viewer' }[]>(
    []
  );
  const mutation = useProjectMutations();
  const router = useRouter();
  const form1 = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      title: '',
    },
  });

  const form2 = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async () => {
    const valid = await form2.trigger();
    if (!valid) return;
    if (session?.user.email === form2.getValues('email'))
      return form2.setError('email', { message: `Can't invite yourself.` });
    const existMember = await members.find(mem => mem.email === form2.getValues('email'));
    if (existMember) return form2.setError('email', { message: 'This email is already a exist.' });
    const email = form2.getValues('email');
    setMembers(prev => [...prev, { email, role: 'owner' }]);
    form2.setValue('email', '');
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...form1.getValues(),
      workspaceId,
      members,
    };

    mutation.create.mutate(payload, {
      onSuccess: data => {
        return router.push(`/workspace/${data.workspaceId}/projects`);
      },
      onError: err => {
        return makeToastError(err.message);
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  if (status === 'loading') return;
  if (isLoading) return;
  if (mError) return notFound();

  return (
    <SidebarInset className="flex flex-col items-center h-full w-full overflow-y-auto">
      <div className="px-3 py-4 w-full flex-1 max-w-2xl">
        <div className="">
          <Link href={`/workspaces/${workspaceId}/access/users`}>
            <Button variant={'link'} className="px-0! cursor-pointer text-blue-500">
              <ArrowLeft />
              Go back to Users
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold drop-shadow-xs mb-2">
            Invite to Workspace
          </h1>
        </div>
        <div className="flex flex-col gap-y-2 max-w-2xl mt-5">
          <div className="">
            <motion.form
              key="InviteMembers"
              onSubmit={e => {
                e.preventDefault();
                handleSubmit();
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex flex-col text-sm space-y-4">
                <div className="flex flex-col gap-y-4">
                  <Label className="text-lg font-semibold">
                    Add new users to your organization below.
                  </Label>
                  <div className="flex gap-x-1">
                    <Input
                      {...form2.register('email')}
                      placeholder="Invite new or existing user via email address..."
                    />
                    <Button
                      type="button"
                      title="Send Invite"
                      onClick={onSubmit}
                      className="bg-secondary hover:bg-primary text-primary hover:text-secondary cursor-pointer"
                    >
                      <SendHorizontal />
                    </Button>
                  </div>
                  <p className="text-red-500 text-sm">{form2.formState.errors.email?.message}</p>
                </div>
                Give your members access permissions below.
                <Separator orientation="horizontal" />
                <div className="flex">
                  <Table>
                    <TableBody>
                      {members.length > 0 &&
                        members.map((member, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>
                              <MemberRole setMembers={setMembers} targetMember={member} />
                            </TableCell>
                            <TableCell className="text-red-500 hover:underline">
                              <button
                                type="button"
                                className="cursor-pointer"
                                disabled={loading}
                                onClick={() => {
                                  setMembers(prev => prev.filter((_, i) => i !== idx));
                                }}
                              >
                                Remove
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="text-end">
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant={'outline'}
                    disabled={loading}
                    onClick={() => {
                      redirect(`/workspaces/${workspaceId}/access/users`);
                    }}
                    className="text-end bg-secondary border-primary/70 text-primary-foreground cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="text-end cursor-pointer">
                    Invite Members
                  </Button>
                </div>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};
