
import { ReactNode } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface LayoutProps {
  children: ReactNode;
}

const LayoutContent = ({ children }: LayoutProps) => {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppSidebar />
      <SidebarInset>
        {/* Main Content with conditional sidebar trigger */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 bg-gray-50/50 relative">
          {(isCollapsed || isMobile) && (
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
              <SidebarTrigger />
            </div>
          )}
          <div className={(isCollapsed || isMobile) ? "pt-10 sm:pt-12" : ""}>
            {children}
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};

export default Layout;
