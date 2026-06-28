"use client";

import { useFormStatus } from "react-dom";

interface LoginButtonProps {
  loginText: string;
  loggingInText: string;
}

export function LoginButton({ loginText, loggingInText }: LoginButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-lg bg-tide px-4 py-2.5 text-sm font-medium text-pearl transition-colors hover:bg-tide-dark disabled:opacity-60"
    >
      {pending ? loggingInText : loginText}
    </button>
  );
}
