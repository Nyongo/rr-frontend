
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const EnhancedTabs = TabsPrimitive.Root;

const EnhancedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "grid w-fit bg-white shadow-md border rounded-md",
      className
    )}
    {...props}
  />
));
EnhancedTabsList.displayName = TabsPrimitive.List.displayName;

const EnhancedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    gradientFrom?: string;
    gradientTo?: string;
    useCustomGreen?: boolean;
  }
>(({ className, gradientFrom = "blue-500", gradientTo = "purple-600", useCustomGreen = false, ...props }, ref) => {
  const activeClasses = useCustomGreen 
    ? "data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-blue-500 data-[state=active]:text-white"
    : `data-[state=active]:bg-gradient-to-r data-[state=active]:from-${gradientFrom} data-[state=active]:to-${gradientTo} data-[state=active]:text-white`;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        activeClasses,
        className
      )}
      {...props}
    />
  );
});
EnhancedTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const EnhancedTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
EnhancedTabsContent.displayName = TabsPrimitive.Content.displayName;

export { EnhancedTabs, EnhancedTabsList, EnhancedTabsTrigger, EnhancedTabsContent };
