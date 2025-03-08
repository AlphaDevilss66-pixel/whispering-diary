
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const CustomButton = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className,
  ...props
}: CustomButtonProps) => {
  // Map custom variants to shadcn/ui variants
  const variantMap = {
    default: "default",
    primary: "default",
    secondary: "secondary",
    outline: "outline",
    ghost: "ghost",
  };

  // Map custom sizes to tailwind classes
  const sizeClasses = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

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
