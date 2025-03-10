
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-wonder-purple to-wonder-purple-dark text-primary-foreground shadow-magical hover:shadow-magical-hover hover:-translate-y-0.5 active:translate-y-0",
        destructive: "bg-gradient-to-br from-destructive to-destructive/90 text-destructive-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        outline: "border-2 border-input bg-background hover:bg-accent/50 hover:text-accent-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        secondary: "bg-gradient-to-br from-wonder-coral to-wonder-coral-dark text-secondary-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground hover:-translate-y-0.5 active:translate-y-0",
        link: "text-primary underline-offset-4 hover:underline",
        // New Disney-inspired style
        disney: "bg-gradient-to-br from-disney-purple to-disney-blue text-white shadow-[0_8px_20px_rgba(200,80,192,0.2)] hover:shadow-[0_10px_25px_rgba(200,80,192,0.3)] hover:-translate-y-0.5 active:translate-y-0",
        // New Pixar-inspired style
        pixar: "bg-gradient-to-br from-pixar-blue to-pixar-sky text-white shadow-[0_8px_20px_rgba(11,99,246,0.2)] hover:shadow-[0_10px_25px_rgba(11,99,246,0.3)] hover:-translate-y-0.5 active:translate-y-0",
        // New Chupa Chups inspired style
        chupa: "bg-gradient-to-br from-chupa-pink to-chupa-orange text-white shadow-[0_8px_20px_rgba(255,97,210,0.2)] hover:shadow-[0_10px_25px_rgba(255,97,210,0.3)] hover:-translate-y-0.5 active:translate-y-0",
        // New Apple-inspired style
        apple: "bg-white border border-gray-200 text-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_5px_15px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:translate-y-0",
        // New Kid-friendly style with fun colors
        kidFriendly: "bg-gradient-to-br from-wonder-yellow/80 to-wonder-yellow text-gray-800 shadow-[0_8px_15px_rgba(250,204,21,0.2)] hover:shadow-[0_10px_20px_rgba(250,204,21,0.3)] hover:-translate-y-0.5 active:translate-y-0 font-bubbly",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-xl",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-lg",
        icon: "h-10 w-10 rounded-full",
      },
      rounded: {
        default: "rounded-xl",
        full: "rounded-full",
        sm: "rounded-lg",
        lg: "rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
