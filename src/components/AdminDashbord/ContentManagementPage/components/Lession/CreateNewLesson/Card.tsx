// Card.tsx
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  status: 'completed' | 'required' | 'none';
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, status, children }) => {
  const borderClass =
    status === 'completed'
      ? 'border-2 border-emerald-500 dark:border-emerald-400'
      : status === 'required'
        ? 'border-2 border-amber-400 dark:border-amber-500'
        : 'border border-gray-200 dark:border-gray-700';

  const badgeContent =
    status === 'completed'
      ? 'Complete ✓'
      : status === 'required'
        ? 'Required'
        : null;

  const badgeClasses =
    status === 'completed'
      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300'
      : 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300';

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 ${borderClass} rounded-2xl p-7 shadow-sm dark:shadow-gray-900/20`}
    >
      {badgeContent && (
        <span
          className={`absolute top-4 right-4 text-[11px] font-semibold px-2.5 py-1 rounded uppercase tracking-wider ${badgeClasses}`}
        >
          {badgeContent}
        </span>
      )}
      <h2 className="font-serif text-xl font-bold mb-1.5 text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{description}</p>
      {children}
    </div>
  );
};

export default Card;