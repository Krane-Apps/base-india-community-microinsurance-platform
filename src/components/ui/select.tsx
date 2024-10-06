import React, { useState } from "react";

interface SelectProps {
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  value?: string;
}

export const Select: React.FC<SelectProps> = ({
  onValueChange,
  children,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <SelectTrigger onClick={() => setIsOpen(!isOpen)}>
        <SelectValue>{selectedValue || "Select..."}</SelectValue>
      </SelectTrigger>
      {isOpen && (
        <SelectContent>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === SelectItem) {
              return React.cloneElement(child, {
                onSelect: () => handleSelect(child.props.value),
              } as React.HTMLAttributes<HTMLDivElement>);
            }
            return child;
          })}
        </SelectContent>
      )}
    </div>
  );
};

export const SelectTrigger: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <div
      className={`flex items-center justify-between p-2 border border-gray-300 rounded-md cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const SelectValue: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <span className={`text-gray-700 ${className}`} {...props}>
      {children}
    </span>
  );
};

export const SelectContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <div
      className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const SelectItem: React.FC<any> = ({
  className = "",
  children,
  value,
  onSelect,
  ...props
}) => {
  return (
    <div
      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${className}`}
      onClick={() => onSelect && onSelect(value)}
      {...props}
    >
      {children}
    </div>
  );
};
