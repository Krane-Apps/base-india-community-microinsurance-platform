import React, { useState, useRef, useEffect } from "react";

interface SelectProps {
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  value?: string;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  onValueChange,
  children,
  value,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onValueChange(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <SelectTrigger onClick={() => setIsOpen(!isOpen)}>
        <SelectValue>{selectedValue || placeholder || "Select..."}</SelectValue>
      </SelectTrigger>
      {isOpen && (
        <SelectContent>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === SelectItem) {
              return React.cloneElement(child, {
                onSelect: () => handleSelect(child.props.value),
              });
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
