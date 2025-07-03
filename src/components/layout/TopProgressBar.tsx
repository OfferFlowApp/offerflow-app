
"use client";

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // This component will re-render when the path changes.
    // We use a state to briefly show the loading bar on each navigation.
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // The loading bar will be visible for this duration

    return () => {
      clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  return isLoading ? <div className="page-loading-bar" /> : null;
}

// Wrap in Suspense because `usePathname` and `useSearchParams` can suspend.
export default function TopProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBar />
    </Suspense>
  );
}
