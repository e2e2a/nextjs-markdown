'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { notFound } from 'next/navigation';
import { useUserQuery } from '@/hooks/user/useUserQuery';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export function OnboardComplete() {
  const { data: session, status } = useSession();
  const { data: user, isLoading } = useUserQuery(session?.user?._id as string);

  if (status === 'loading' || isLoading) return;
  if (!user) return notFound();

  return (
    <div className="w-full flex justify-center">
      <Card className="w-full max-w-2xl p-4 rounded-xl shadow-lg">
        <CardContent className="py-3">
          <AnimatePresence mode="wait">
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
              <Link href={'/workspace'} className="">
                <Button variant={'default'} className="cursor-pointer">
                  Go to Workspaces
                </Button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
