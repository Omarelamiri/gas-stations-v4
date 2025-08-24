import React from 'react';

export type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="text-red-600 text-sm p-2 bg-red-50 border border-red-200 rounded">
      {message}
    </div>
  );
}
