'use client';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ChevronRight, SendHorizontal } from 'lucide-react';
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
import { redirect, useParams, useRouter } from 'next/navigation';
import { workspaceSchema } from '@/lib/validators/workspace';
import { useWorkspaceMutations } from '@/hooks/workspace/useMutation';
import { makeToastError } from '@/lib/toast';

export const WorkspaceCreateClient = () => {
  const { data: session, status } = useSession();
  const params = useParams();
  const workspaceId = params.id as string;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<{ email: string; role: 'owner' | 'editor' | 'viewer' }[]>(
    []
  );
  const mutation = useWorkspaceMutations();
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

  const next = async () => {
    if (step === 1) {
      const valid = await form1.trigger();
      if (!valid) return;
      setStep(2);
    }

    if (step === 2) {
      setLoading(true);
      const payload = {
        ...form1.getValues(),
        workspaceId,
        members,
      };
      console.log('payload', payload);
      mutation.createProject.mutate(payload, {
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
    }
  };

  if (status === 'loading') return;

  return (
    <SidebarInset className="flex flex-col h-screen w-full">
      <SiteHeader title={'Create Project'} />
      <div className="px-3 py-4 w-full flex-1 overflow-y-auto">
        <div className="">
          <h1 className="text-2xl md:text-3xl font-bold drop-shadow-xs mb-2">Create Project</h1>
        </div>
        <div className="flex flex-col gap-y-2 max-w-2xl mt-5">
          <div className="flex items-center text-[12px] font-bold max-w-lg">
            <div className="bg-primary text-white px-2 py-1">Name</div>
            <span className="text-gray-500 font-extrabold text-[12px]">
              <ChevronRight />
            </span>
            <div className={cn('bg-secondary text-gray-700 px-4 py-1')}>Members and security</div>
          </div>
          <div className="">
            {step === 1 && (
              <motion.form
                key="step1"
                onSubmit={e => {
                  e.preventDefault();
                  next();
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className=" gap-4">
                  <div>
                    <Label className="text-lg font-semibold">Name Your Organization</Label>
                    <span className="">
                      Project names have to be unique within the workspace (and other restrictions).
                    </span>
                    <Input {...form1.register('title')} />
                    <p className="text-red-500 text-sm">{form1.formState.errors.title?.message}</p>
                  </div>
                </div>
                <div className="text-end">
                  <Button type="submit" className="text-end cursor-pointer">
                    Next
                  </Button>
                </div>
              </motion.form>
            )}
            {step === 2 && (
              <motion.form
                key="step2"
                onSubmit={e => {
                  e.preventDefault();
                  next();
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex flex-col text-sm space-y-4 mt-5">
                  <div className="flex flex-col gap-y-4">
                    <Label className="text-lg font-semibold">Add Members and Set Permissions</Label>
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
                        <TableRow>
                          <TableCell>{session?.user.email}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              disabled={true}
                              type="button"
                              className="w-[150px] justify-start capitalize"
                            >
                              Owner
                            </Button>
                          </TableCell>
                          <TableCell className=""></TableCell>
                        </TableRow>
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
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant={'outline'}
                    disabled={loading}
                    onClick={() => setStep(1)}
                    className="text-end bg-secondary border-primary/70 text-primary cursor-pointer"
                  >
                    Back
                  </Button>
                  <div className="space-x-2">
                    <Button
                      type="button"
                      variant={'outline'}
                      disabled={loading}
                      onClick={() => {
                        redirect('/preferences/workspace');
                      }}
                      className="text-end bg-secondary border-primary/70 text-primary cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="text-end cursor-pointer">
                      Create Workspace
                    </Button>
                  </div>
                </div>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};
