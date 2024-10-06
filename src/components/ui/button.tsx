import { forwardRef, ButtonHTMLAttributes } from "react";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "ghost";
  }
>(({ children, className = "", variant = "default", ...props }, ref) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
  const variantStyles = {
    default: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    outline:
      "border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500",
    ghost: "text-green-600 hover:bg-green-50 focus:ring-green-500",
  };
  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";
