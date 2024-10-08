import React from 'react';
import clsx from 'clsx';
import {ProgressCircle} from '@ui/progress/progress-circle';

interface FullPageLoaderProps {
  className?: string;
  screen?: boolean;
}
export function FullPageLoader({className, screen}: FullPageLoaderProps) {
  return (
    <div
      className={clsx(
        'flex items-center justify-center flex-auto',
        screen ? 'h-screen w-screen' : 'h-full w-full',
        className
      )}
    >
      <ProgressCircle isIndeterminate aria-label="Loading page..." />
    </div>
  );
}
