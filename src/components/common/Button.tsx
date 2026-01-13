import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-core-1 text-white hover:brightness-105",
  secondary: "bg-core-2 text-core-1 hover:bg-core-3",
  outline: "bg-white border border-text-gray4 text-text-black hover:bg-bluegray-1",
  ghost: "bg-transparent text-text-gray2 hover:text-text-black hover:bg-bluegray-1",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-callout2 rounded-lg",
  md: "h-12 px-5 text-title2 rounded-xl",
  lg: "h-14 px-6 text-title rounded-2xl",
};

const disabledStyles = "bg-text-gray5 text-text-gray4 cursor-not-allowed hover:brightness-100";

function Button({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  disabled = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "font-semibold transition-all active:scale-[0.98] flex items-center justify-center";
  const widthStyle = fullWidth ? "w-full" : "";

  const combinedStyles = disabled
    ? `${baseStyles} ${sizeStyles[size]} ${disabledStyles} ${widthStyle} ${className}`
    : `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`;

  return (
    <button className={combinedStyles} disabled={disabled} {...props}>
      {children}
    </button>
  );
}

export default Button;
