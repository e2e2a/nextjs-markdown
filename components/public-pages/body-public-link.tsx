import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface IProps {
  title: string;
  href: string;
  Icon?: LucideIcon;
  classname?: string;
}

export default function BodyPublicLink({ title, href, Icon, classname }: IProps) {
  return (
    <div>
      <Link
        href={href}
        className={cn(
          'cursor-pointer inline-flex items-center px-5 py-2 border-white font-semibold shadow-lg rounded-sm transform transition-all duration-300 ease-in-out bg-white text-black hover:scale-105 hover:shadow-xl',
          classname
        )}
      >
        {title}
        {Icon && <Icon className="w-5 h-5" />}
      </Link>
    </div>
  );
}
