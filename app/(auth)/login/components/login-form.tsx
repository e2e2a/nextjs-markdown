'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldSeparator } from '@/components/ui/field';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { redirect, useSearchParams } from 'next/navigation';
import { makeToastError, makeToastSucess } from '@/lib/toast';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/lib/validators/login';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { useAuthMutations } from '@/hooks/auth/useAuthMutations';
import OauthField from '@/components/oauth-field';

type IProps = React.ComponentProps<'div'> & {
  className?: string;
};

type RegisterInput = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: IProps) {
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const error = params.get('error');
  const mutation = useAuthMutations();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (error) makeToastError(error);
  }, [error]);

  const onSubmit = async (values: RegisterInput) => {
    const { email, password } = values;
    setLoading(true);
    mutation.login.mutate(
      { email, password },
      {
        onSuccess: async data => {
          if (data && data.token) {
            redirect(`/verify?token=${encodeURIComponent(data.token)}`);
          } else {
            await signIn('credentials', {
              email: data.email,
              callbackUrl: '/login',
            });
            makeToastSucess('Redirecting To Workspace!');
          }
        },
        onError: err => {
          makeToastError(err.message);
          setLoading(false);
          return;
        },
      }
    );
  };
  return (
    <div className={cn('flex flex-col gap-6 max-w-md w-full', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            <h1 className="font-semibold text-2xl md:text-3xl">Log in to your account</h1>
          </CardTitle>
          <CardDescription>
            <span>Don&apos;t have an account?</span>{' '}
            <Link href={'/register'} className="underline text-primary">
              Sign Up
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="johndoe@domain.com"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="******"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full text-center">
                    <Button
                      type="submit"
                      disabled={loading}
                      variant={'default'}
                      className="w-full cursor-pointer"
                    >
                      Login
                    </Button>
                  </div>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>
                <OauthField callbackUrl="/login" loading={loading} setLoading={setLoading} />
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking above, you agree to our <Link href="/terms">Terms of Service</Link> and{' '}
        <Link href="/privacy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
