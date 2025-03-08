
// This is now just a wrapper around the sonner Toaster
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="top-right"
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-magical group-[.toaster]:rounded-xl group-[.toaster]:px-5 group-[.toaster]:py-4",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:mt-1",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg",
          title: "group-[.toast]:font-semibold group-[.toast]:text-base group-[.toast]:flex group-[.toast]:items-center group-[.toast]:gap-2",
          info: "group-[.toast]:bg-blue-50 group-[.toast]:border-blue-100 group-[.toast]:text-blue-700 group-[.toast]:before:content-['✨'] group-[.toast]:before:mr-2 group-[.toast]:before:text-xl",
          success: "group-[.toast]:bg-green-50 group-[.toast]:border-green-100 group-[.toast]:text-green-700 group-[.toast]:before:content-['🎉'] group-[.toast]:before:mr-2 group-[.toast]:before:text-xl",
          warning: "group-[.toast]:bg-yellow-50 group-[.toast]:border-yellow-100 group-[.toast]:text-yellow-800 group-[.toast]:before:content-['⚠️'] group-[.toast]:before:mr-2 group-[.toast]:before:text-xl",
          error: "group-[.toast]:bg-red-50 group-[.toast]:border-red-100 group-[.toast]:text-red-700 group-[.toast]:before:content-['❌'] group-[.toast]:before:mr-2 group-[.toast]:before:text-xl",
          // Removed the 'animation' property since it's not supported in the ToastClassnames type
        },
        unstyled: false,
        closeButton: true,
      }}
      richColors
      closeButton
    />
  );
}
