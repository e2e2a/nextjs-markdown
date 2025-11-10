import { SidebarProvider } from '@/components/ui/sidebar';

interface AppShellProps {
  children: React.ReactNode;
  variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
  if (variant === 'header') {
    return (
      <div className="flex h-[calc(100vh-500px)] w-full flex-col p-0 overflow-y-hidden!">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider
      className="bg-gray-300 min-h-screen max-h-screen overflow-y-hidden!"
      defaultOpen={true}
    >
      {children}
    </SidebarProvider>
  );
}
