'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { Github } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { KBAForm } from './kba-form';
import Link from 'next/link';

type IProps = React.ComponentProps<'div'> & {
  className?: string;
};

export function LoginForm({ className, ...props }: IProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') return;
  if (session?.user && !session?.user.kbaVerified) {
    return <KBAForm session={session} />;
  }

  return (
    <div className={cn('flex flex-col gap-6 max-w-md w-full', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            <h1 className="font-semibold text-2xl md:text-3xl">Sign in</h1>
          </CardTitle>
          <CardDescription>Login with your Github or Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button" className="cursor-pointer">
                  <Github className="h-6 w-6 stroke-3" />
                  Login with Github
                </Button>
                <Button
                  onClick={() => signIn('google')}
                  variant="outline"
                  type="button"
                  className="cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking above, you agree to our <Link href="/terms">Terms of Service</Link> and{' '}
        <Link href="/privacy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
