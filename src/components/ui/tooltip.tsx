export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

export const Tooltip: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

export const TooltipTrigger: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <div className={`inline-block ${className}`} {...props}>
      {children}
    </div>
  );
};

export const TooltipContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <div
      className={`absolute z-10 px-2 py-1 text-sm text-white bg-black rounded shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
