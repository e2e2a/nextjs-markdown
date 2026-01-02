'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { FormField, FormItem } from '@/components/ui/form';
import { Step1Schema, Step2Schema } from '@/lib/validators/onboard';
import { makeToastError } from '@/lib/toast';
import { useUserMutations } from '@/hooks/user/useUserMutations';
import { notFound } from 'next/navigation';
import { useUserQuery } from '@/hooks/user/useUserQuery';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { workspaceSchema } from '@/lib/validators/workspace';

export function OnboardForms() {
  const { data: session, status, update } = useSession();
  const { data: user, isLoading } = useUserQuery(session?.user?._id as string);
  const [link, setLink] = useState('');
  const [step, setStep] = useState(1);
  const mutation = useUserMutations();
  const form1 = useForm({
    resolver: zodResolver(Step1Schema),
    defaultValues: {
      given_name: '',
      middle_name: '',
      family_name: '',
      company: '',
      country: '',
      phoneNumber: '',
    },
  });
  const form2 = useForm({
    resolver: zodResolver(Step2Schema),
    defaultValues: {
      goal: '',
    },
  });
  const form3 = useForm({ resolver: zodResolver(workspaceSchema) });

  const next = async () => {
    if (step === 1) {
      const valid = await form1.trigger();
      if (!valid) return;
      setStep(2);
    }

    if (step === 2) {
      const valid = await form2.trigger();
      if (!valid) return;
      setStep(3);
    }

    if (step === 3) {
      const valid = await form3.trigger();
      if (!valid) return;

      const payload = {
        step1: { ...form1.getValues() },
        step2: { ...form2.getValues() },
        step3: { ...form3.getValues() },
      };

      mutation.onboard.mutate(payload, {
        onSuccess: data => {
          update({
            name: `${payload.step1.given_name} ${payload.step1.family_name}`,
            isOnboard: true,
          });
          if (data.workspaceId) setLink(`/workspaces/${data.workspaceId}/projects`);
          setStep(4);
          return;
        },
        onError: err => {
          makeToastError(err.message);
          return;
        },
      });
    }
  };

  const back = () => setStep(s => Math.max(1, s - 1));
  if (status === 'loading' || isLoading) return;
  if (!user) return notFound();

  return (
    <div className="w-full flex justify-center p-6">
      <Card className="w-full max-w-2xl p-4 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Onboarding</CardTitle>
          <p className="text-sm text-muted-foreground">Step {step} of 4</p>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
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
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Given Name</Label>
                    <Input defaultValue={user.given_name || ''} {...form1.register('given_name')} />
                    <p className="text-red-500 text-sm">
                      {form1.formState.errors.given_name?.message}
                    </p>
                  </div>
                  <div>
                    <Label>
                      Middle Name <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      defaultValue={user.middle_name || ''}
                      {...form1.register('middle_name')}
                    />
                  </div>
                  <div>
                    <Label>Family Name</Label>
                    <Input {...form1.register('family_name')} />
                    <p className="text-red-500 text-sm">
                      {form1.formState.errors.family_name?.message}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>
                      Company <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input {...form1.register('company')} />
                  </div>
                  <div>
                    <Label>
                      Country <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input {...form1.register('country')} />
                  </div>
                  <div>
                    <Label>
                      Phone Number <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input {...form1.register('phoneNumber')} />
                  </div>
                </div>
                <Button type="submit" className="mt-4">
                  Next
                </Button>
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
                <h2 className="text-xl font-semibold">Getting to know you</h2>

                <Label className="block mb-1">What is your primary goal?</Label>
                <FormField
                  control={form2.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <input
                        {...field} // <-- includes value and onChange
                        list="goal-options"
                        className="border rounded px-3 py-2 w-full"
                        placeholder="Type or select your goal"
                      />
                      <p className="text-red-500 text-sm">{form2.formState.errors.goal?.message}</p>
                      <datalist id="goal-options">
                        <option value="Writing markdown notes" />
                        <option value="Real-time collaboration" />
                        <option value="Managing multiple projects" />
                        <option value="VS Code-like experience" />
                      </datalist>
                    </FormItem>
                  )}
                />
                <div className="flex justify-between mt-4">
                  <Button type="button" variant="outline" onClick={back}>
                    Back
                  </Button>
                  <Button type="submit">Next</Button>
                </div>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form
                key="step3"
                onSubmit={e => {
                  e.preventDefault();
                  next();
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <FormItem>
                  <h2 className="text-xl font-semibold">Create Your First Workspace</h2>
                  <Label>Workspace Name</Label>
                  <Input {...form3.register('title')} />
                  <p className="text-red-500 text-sm">{form3.formState.errors.title?.message}</p>
                </FormItem>
                <div className="flex justify-between mt-4">
                  <Button type="button" variant="outline" onClick={back}>
                    Back
                  </Button>
                  <Button type="submit">Next</Button>
                </div>
              </motion.form>
            )}

            {step === 4 && (
              <motion.div
                key="finish"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-4"
              >
                <h2 className="text-2xl font-semibold">You&apos;re all set! 🎉</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your onboarding is complete. You can now start collaborating on markdown files.
                </p>
                <Link href={link || '/workspaces'} className="">
                  <Button variant={'default'} className="cursor-pointer">
                    Go to Workspaces
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
