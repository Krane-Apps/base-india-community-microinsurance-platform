export const Calendar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => {
  return (
    <div
      className={`p-4 bg-white border border-gray-300 rounded-md shadow-sm ${className}`}
      {...props}
    >
      <p className="text-center text-gray-500">Calendar</p>
    </div>
  );
};
