import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-1">Sreeragam Exports</p>
          <h1 className="text-2xl font-bold text-slate-800">Tariff Converter</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
