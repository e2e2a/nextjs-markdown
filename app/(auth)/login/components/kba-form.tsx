'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { kbaSchema } from '@/lib/validators/kba';
import { useProfileMutations } from '@/hooks/profile/useProfileMutations';
import { makeToastError } from '@/lib/toast';

type IProps = {
  session: Session;
};

export function KBAForm({ session }: IProps) {
  const mutation = useProfileMutations();

  const form = useForm<z.infer<typeof kbaSchema>>({
    resolver: zodResolver(kbaSchema),
    defaultValues: {
      kbaQuestion: 'What is your favorite song?',
      kbaAnswer: '',
    },
  });

  const [loading, setLoading] = useState(false);

  const question = 'What is your favorite song?';

  const onSubmit = async (values: z.infer<typeof kbaSchema>) => {
    setLoading(true);
    try {
      const payload = {
        _id: session?.user._id as string,
        kbaQuestion: values.kbaQuestion,
        kbaAnswer: values.kbaAnswer,
      };

      mutation.updateKBA.mutate(payload, {
        onSuccess: async () => {
          setLoading(false);
          if (session.user.role === 'admin') redirect('/admin');
          redirect('/project');
        },
        onError: err => {
          makeToastError(err.message);
          return;
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col max-w-md gap-6')}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            <div className="text-right w-full pb-4">
              <Button
                variant={'ghost'}
                type="button"
                className="cursor-pointer hover:underline hover:bg-transparent"
                onClick={async () => {
                  try {
                    setLoading(true);
                    await signOut();
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setLoading(false);
                  }
                  return;
                }}
              >
                <ArrowLeft />
                Go back
              </Button>
            </div>
            <div className="">Security Verification</div>
          </CardTitle>
          <CardDescription>Please answer the following question:</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="kbaAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{question}</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        className="w-full rounded border px-3 py-2"
                        placeholder="Your answer"
                      />
                    </FormControl>
                    <FormDescription>Provide an answer to your security question.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full items-center justify-end">
                <Button type="submit" className="cursor-pointer" disabled={loading}>
                  {loading ? 'Saving...' : 'Submit'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
