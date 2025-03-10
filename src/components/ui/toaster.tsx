
// This is now just a wrapper around the sonner Toaster
import { Toaster as SonnerToaster } from "sonner";
import { Sparkles, Star, Lightbulb, Award, PartyPopper } from "lucide-react";

export function Toaster() {
  return (
    <SonnerToaster 
      position="top-right"
      closeButton
      richColors
      icons={{
        success: <PartyPopper className="h-5 w-5 text-wonder-green" />,
        error: <Lightbulb className="h-5 w-5 text-wonder-coral" />,
        info: <Star className="h-5 w-5 text-wonder-yellow" />,
        warning: <Sparkles className="h-5 w-5 text-wonder-purple" />,
        // Fix: Use a supported icon type instead of 'normal'
        default: <Award className="h-5 w-5 text-wonder-blue" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:border-wonder-purple/20 group-[.toaster]:py-3 group-[.toaster]:font-comic",
          title: "group-[.toast]:text-foreground group-[.toast]:font-bubbly group-[.toast]:text-lg",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-[15px]",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-full",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-full",
          success: "group-[.toast]:bg-gradient-to-br group-[.toast]:from-wonder-green/10 group-[.toast]:to-wonder-green-light/5 group-[.toast]:border-wonder-green/20",
          error: "group-[.toast]:bg-gradient-to-br group-[.toast]:from-wonder-coral/10 group-[.toast]:to-wonder-coral-light/5 group-[.toast]:border-wonder-coral/20",
          info: "group-[.toast]:bg-gradient-to-br group-[.toast]:from-wonder-yellow/10 group-[.toast]:to-wonder-yellow-light/5 group-[.toast]:border-wonder-yellow/20",
          warning: "group-[.toast]:bg-gradient-to-br group-[.toast]:from-wonder-purple/10 group-[.toast]:to-wonder-purple-light/5 group-[.toast]:border-wonder-purple/20",
        },
        duration: 4000,
        // Removed unsupported 'animationDuration' property
      }}
    />
  );
}
