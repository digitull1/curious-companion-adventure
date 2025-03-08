
// This is now just a wrapper around the sonner Toaster
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="top-right"
      toastOptions={{
        duration: 3000,
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:px-4 group-[.toaster]:py-3",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-md",
          title: "group-[.toast]:font-semibold group-[.toast]:text-base",
          info: "group-[.toast]:bg-blue-50 group-[.toast]:border-blue-100 group-[.toast]:text-blue-700",
          success: "group-[.toast]:bg-green-50 group-[.toast]:border-green-100 group-[.toast]:text-green-700",
          warning: "group-[.toast]:bg-yellow-50 group-[.toast]:border-yellow-100 group-[.toast]:text-yellow-800",
          error: "group-[.toast]:bg-red-50 group-[.toast]:border-red-100 group-[.toast]:text-red-700",
        },
      }}
    />
  );
}
