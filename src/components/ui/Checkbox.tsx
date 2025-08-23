import React from 'react';

// Define the props for the Checkbox component
interface CheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
}

export function Checkbox({ id, checked, onCheckedChange, children }: CheckboxProps) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer items-center space-x-2 text-sm text-gray-700">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      {children}
    </label>
  );
}