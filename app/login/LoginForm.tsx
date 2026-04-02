"use client";

import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const params = useSearchParams();
  const from = params.get("from") || "/";
  const error = params.get("error");

  return (
    <form method="POST" action="/api/login" className="space-y-4">
      <input type="hidden" name="from" value={from} />
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">
          Access Code
        </label>
        <input
          type="password"
          name="code"
          autoFocus
          autoComplete="off"
          placeholder="Enter access code"
          className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-800 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">Incorrect access code. Try again.</p>
      )}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
      >
        Enter
      </button>
    </form>
  );
}
