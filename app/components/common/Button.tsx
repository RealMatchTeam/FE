import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";
import MiniLogo from "../../assets/logo/mini-logo.svg";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "action";
type ButtonSize = "sm" | "md" | "lg" | "action";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  active?: boolean;
  withLogo?: boolean;
  to?: string;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-core-1 text-white hover:brightness-105",
  secondary: "bg-core-2 text-core-1 hover:bg-core-3",
  outline: "bg-white border hover:bg-bluegray-1",
  ghost: "bg-transparent text-text-gray2 hover:text-text-black hover:bg-bluegray-1",
  action: "bg-core-3 text-white hover:brightness-95",
};

const actionActiveStyles = "bg-core-1 text-white hover:brightness-95";

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-callout2 rounded-lg",
  md: "h-12 px-5 text-title2 rounded-xl",
  lg: "h-12 px-6 text-title7 rounded-2xl",
  action: "h-11 px-4 py-3 gap-2.5 text-callout1 rounded-xl",
};

const disabledStyles = "bg-text-gray5 text-text-gray4 cursor-not-allowed hover:brightness-100";

function Button({
  variant = "primary",
  size = "action",
  fullWidth = false,
  disabled = false,
  active = true,
  withLogo = false,
  to,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "font-semibold transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer";
  const widthStyle = fullWidth ? "w-full" : "";
  const logoStyles = withLogo ? "gap-1.5 shadow-[0_10px_24px_rgba(91,99,255,0.28)]" : "";

  const getVariantStyle = () => {
    if (variant === "action") {
      return active ? actionActiveStyles : variantStyles.action;
    }
    return variantStyles[variant];
  };

  const combinedStyles = disabled
    ? `${baseStyles} ${sizeStyles[size]} ${disabledStyles} ${widthStyle} ${logoStyles} ${className}`
    : `${baseStyles} ${sizeStyles[size]} ${getVariantStyle()} ${widthStyle} ${logoStyles} ${className}`;

  const content = (
    <>
      {withLogo && (
        <img
          src={MiniLogo}
          alt=""
          className="w-[26px] h-auto select-none"
          draggable={false}
        />
      )}
      {children}
    </>
  );

  // to가 있으면 Link로 렌더링
  if (to && !disabled) {
    return (
      <Link to={to} className={combinedStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedStyles} disabled={disabled} {...props}>
      {content}
    </button>
  );
}

export default Button;
