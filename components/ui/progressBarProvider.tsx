"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";

interface ProgressProvidersProps {
  children: ReactNode;
}

const ProgressProviders = ({ children }: ProgressProvidersProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [progress, setProgress] = useState(0);

  const rafRef = useRef<number | null>(null);
  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const routeKey = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);

    rafRef.current = requestAnimationFrame(() => {
      setProgress(10);

      startTimeoutRef.current = setTimeout(() => {
        setProgress(100);

        resetTimeoutRef.current = setTimeout(() => {
          setProgress(0);
        }, 300);
      }, 500);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [routeKey]);

  return (
    <>
      {progress > 0 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "3px",
            background: "#0D9488",
            width: `${progress}%`,
            transition: "width 0.3s ease-out",
            zIndex: 9999,
            boxShadow: "0 0 10px rgba(13, 148, 136, 0.5)",
          }}
        />
      )}

      {children}
    </>
  );
};

export default ProgressProviders;
