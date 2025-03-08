
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "ios";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  isIOS?: boolean;
}

const CustomButton = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className,
  isIOS = true,
  ...props
}: CustomButtonProps) => {
  // Map custom variants to shadcn/ui variants
  const variantMap = {
    default: "default",
    primary: "default",
    secondary: "secondary",
    outline: "outline",
    ghost: "ghost",
    ios: "default",
  };

  // Map custom sizes to tailwind classes
  const sizeClasses = {
    sm: "text-xs px-4 py-1.5 h-8",
    md: "text-sm px-5 py-2 h-10",
    lg: "text-base px-7 py-2.5 h-12",
  };

  if (isIOS) {
    return (
      <button
        className={cn(
          "ios-button relative overflow-hidden transition-all duration-200",
          variant === "ios" && "bg-ios-blue text-white hover:bg-ios-blue/90",
          variant === "primary" && "bg-ios-blue text-white hover:bg-ios-blue/90",
          variant === "secondary" && "bg-secondary/80 text-foreground hover:bg-secondary",
          variant === "outline" && "bg-transparent border border-ios-gray-4 text-foreground hover:bg-secondary/50",
          variant === "ghost" && "bg-transparent text-foreground hover:bg-secondary/50",
          sizeClasses[size],
          isLoading && "opacity-80 pointer-events-none",
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </span>
        )}
        <span className={cn("flex items-center justify-center gap-2", isLoading && "opacity-0")}>
          {icon && <span>{icon}</span>}
          {children}
        </span>
      </button>
    );
  }

  return (
    <Button
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        variant === "primary" && "bg-primary hover:bg-primary/90 text-white",
        sizeClasses[size],
        className
      )}
      variant={variantMap[variant] as any}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {!isLoading && icon && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 transition-opacity hover:opacity-100" />
    </Button>
  );
};

export default CustomButton;
