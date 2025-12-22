'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldSeparator } from '@/components/ui/field';
import Link from 'next/link';
import { registerSchema } from '@/lib/validators/register';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useAuthMutations } from '@/hooks/auth/useAuthMutations';
import { makeToastError } from '@/lib/toast';
import { redirect } from 'next/navigation';
import { PasswordInputField } from './password-input-filed';
import { useState } from 'react';
import OauthField from '@/components/oauth-field';

type IProps = React.ComponentProps<'div'> & {
  className?: string;
};

type RegisterInput = z.infer<typeof registerSchema>;

export function RegisterForm({ className, ...props }: IProps) {
  const [loading, setLoading] = useState(false);
  const mutation = useAuthMutations();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    const { email, password } = values;
    setLoading(true);
    mutation.register.mutate(
      { email, password },
      {
        onSuccess: async data => {
          redirect(`/verify?token=${encodeURIComponent(data.token)}`);
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
            <h1 className="font-semibold text-2xl md:text-3xl">Sign in</h1>
          </CardTitle>
          <CardDescription>
            <span>Have an account?</span>{' '}
            <Link href={'/login'} className="underline text-primary">
              Log in now
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
                          <PasswordInputField disabled={loading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <PasswordInputField disabled={loading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full text-center">
                    <Button type="submit" disabled={loading} className="w-full cursor-pointer">
                      Register
                    </Button>
                  </div>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>
                <OauthField callbackUrl="/register" loading={loading} setLoading={setLoading} />
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
