"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loginFormState, setLoginFormState] = useState({
    email: "",
    password: "",
    showPassword: false,
    error: "",
    loading: false,
  });

  const handleSingInButtonClick = () => {
    console.log(loginFormState);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-surface/80 border border-border rounded-2xl p-9 backdrop-blur-md shadow-2xl">
          <div className="mb-7">
            <h1 className="font-playfair text-2xl font-bold text-text mb-1">
              Welcome back
            </h1>
            <p className="text-subtle text-sm">
              Sign in to your Folio workspace
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-subtext tracking-wider block mb-2">
                EMAIL
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={loginFormState.email}
                onChange={(e) => {
                  setLoginFormState({
                    ...loginFormState,
                    email: e.target.value,
                  });
                }}
                className={`w-full bg-surface/60 border rounded-xl px-4 py-3 text-text text-sm placeholder-muted transition-colors focus:border-purple focus:outline-none`}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-subtext tracking-wider block mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  placeholder="••••••••"
                  type={loginFormState.showPassword ? "text" : "password"}
                  value={loginFormState.password}
                  onChange={(e) => {
                    setLoginFormState({
                      ...loginFormState,
                      password: e.target.value,
                    });
                  }}
                  className={`w-full bg-surface/60 border rounded-xl px-4 py-3 text-text text-sm placeholder-muted transition-colors focus:border-purple focus:outline-none pr-11`}
                />
                <button
                  onClick={() =>
                    setLoginFormState({
                      ...loginFormState,
                      showPassword: !loginFormState.showPassword,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-subtext transition-colors"
                >
                  {loginFormState.showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSingInButtonClick}
              className="w-full bg-purple text-card font-semibold py-3 rounded-xl hover:bg-purple/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple/20 mt-1"
            >
              Sign in
            </button>
          </div>
        </div>
        <p className="text-center text-sm text-subtle mt-5">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-purple font-semibold hover:underline"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
