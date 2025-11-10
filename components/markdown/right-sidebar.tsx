import { Sidebar, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';

const RightSidebarTemplate = () => {
  return (
    <Sidebar
      side="right"
      className="right-0 border-l p-0 w-full"
      collapsible="none"
      variant="inset"
    >
      <div className="min-h-screen">
        <SidebarContent className="ml-0 p-0">
          <div className="flex w-full justify-center">
            <span className="text-[16px] pl-2 font-medium text-left w-full">Comments</span>
          </div>
        </SidebarContent>
        <SidebarFooter className="hidden"></SidebarFooter>
      </div>
    </Sidebar>
  );
};

export default RightSidebarTemplate;
