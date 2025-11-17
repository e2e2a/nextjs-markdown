import React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
interface IProps {
  children: React.ReactNode;
  description: string;
}
const Tooltips = ({ children, description }: IProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  );
};

export default Tooltips;
