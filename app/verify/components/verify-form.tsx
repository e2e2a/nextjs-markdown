import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup } from '@/components/ui/field';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
  FormLabel,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifySchema } from '@/lib/validators/verify';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTokenMutations } from '@/hooks/token/userTokenMutations';
import { makeToastError } from '@/lib/toast';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useAuthMutations } from '@/hooks/auth/useAuthMutations';

type IProps = {
  tokenValue: string;
  expiresCode: Date;
} & React.ComponentProps<'div'> & {
    className?: string;
  };
type VerifyInput = z.infer<typeof verifySchema>;

export function VerifyForm({ tokenValue, expiresCode, className, ...props }: IProps) {
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const userMutate = useAuthMutations();
  const mutation = useTokenMutations();

  useEffect(() => {
    const calculateRemainingTime = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresCode).getTime();
      // const expiry = new Date(Date.now()).getTime();
      const difference = expiry - now;

      if (difference > 0) {
        setTimeRemaining(Math.floor(difference / 1000));
      } else {
        setTimeRemaining(0);
      }
    };

    // Calculate immediately and then every second
    calculateRemainingTime();
    const timerId = setInterval(calculateRemainingTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timerId);
  }, [expiresCode]);

  const form = useForm<VerifyInput>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: '' },
  });

  const onSubmit = async (values: VerifyInput) => {
    setLoading(true);

    userMutate.verifyEmail.mutate(
      { token: tokenValue, code: values.code },
      {
        onSuccess: async data => {
          await signIn('credentials', {
            email: data.email,
            redirect: false,
          });
          redirect('/preferences/workspaces');
        },
        onError: err => {
          form.setError('code', {}, { shouldFocus: true });
          setLoading(false);

          makeToastError(err.message);
          return;
        },
      }
    );
  };

  const handleResend = async () => {
    setLoading(true);
    mutation.resendCode.mutate(tokenValue, {
      onSuccess: () => {
        setLoading(false);
        return;
      },
      onError: err => {
        makeToastError(err.message);
        setLoading(true);
        return;
      },
    });
  };

  return (
    <div
      className={cn('flex flex-col gap-6 max-w-md w-full overflow-hidden', className)}
      {...props}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            <h1 className="font-semibold text-2xl md:text-3xl">Verify your email</h1>
          </CardTitle>
          <CardDescription>Enter the 6-digit code sent to your email.</CardDescription>
        </CardHeader>

        <CardContent className="px-3 sm:px-12 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field className="mb-0 pb-0!">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <InputOTP
                            maxLength={6}
                            disabled={loading || timeRemaining <= 0}
                            value={field.value}
                            onChange={val => {
                              const cleaned = val.replace(/[^A-Z0-9]/gi, '').toUpperCase();
                              field.onChange(cleaned);
                              console.log('cleaned', cleaned.length);
                              if (cleaned.length === 6) {
                                // Use form.handleSubmit(onSubmit) to trigger validation and submission
                                // Note: We don't need to pass the raw value here since it's already set
                                // via field.onChange(cleaned) and will be picked up by form.handleSubmit.
                                form.handleSubmit(onSubmit)();
                              }
                            }}
                          >
                            <InputOTPGroup className="flex items-center justify-center w-full mx-auto gap-1 sm:gap-2">
                              {[0, 1, 2, 3, 4, 5].map(idx => (
                                <InputOTPSlot
                                  key={idx}
                                  index={idx}
                                  className={cn(
                                    'grow bg-gray-100 border rounded-md aspect-square h-full text-[16px] sm:text-xl md:text-2xl font-medium uppercase flex items-center justify-center min-h-5 min-w-5',
                                    {
                                      // The Shadcn default error class is usually border-destructive
                                      // or border-red-500, depending on your tailwind config.
                                      // We check fieldState.invalid to see if there's an error.
                                      'border-red-500 ring-red-500 focus:ring-red-500':
                                        fieldState.invalid,
                                    }
                                  )}
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full text-sm mt-3">
                    <span className="text-muted-foreground flex gap-2 w-full">
                      Didn’t receive the code?
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto font-medium cursor-pointer"
                        disabled={loading || timeRemaining > 0}
                        onClick={handleResend}
                      >
                        {timeRemaining > 0 ? `Resend in ${timeRemaining}s` : 'Resend'}
                      </Button>
                    </span>
                  </div>
                </Field>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
