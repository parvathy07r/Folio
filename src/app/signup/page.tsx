"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [signUpFormState, setSignUpFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    error: "",
    loading: false,
  });

  const handleSingInButtonClick = () => {
    console.log(signUpFormState);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-surface/80 border border-border rounded-2xl p-9 backdrop-blur-md shadow-2xl">
          {/* heading */}
          <div className="mb-7">
            <p className="text-subtle text-sm">
              Sign up to your Folio workspace
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* name */}
            <div>
              <label className="text-xs font-semibold text-subtext tracking-wider block mb-2">
                NAME
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={signUpFormState.name}
                onChange={(e) => {
                  setSignUpFormState({
                    ...signUpFormState,
                    name: e.target.value,
                  });
                }}
                className={`w-full bg-surface/60 border rounded-xl px-4 py-3 text-text text-sm placeholder-muted transition-colors focus:border-purple focus:outline-none`}
              />
            </div>
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-subtext tracking-wider block mb-2">
                EMAIL
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={signUpFormState.email}
                onChange={(e) => {
                  setSignUpFormState({
                    ...signUpFormState,
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
                  type={signUpFormState.showPassword ? "text" : "password"}
                  value={signUpFormState.password}
                  onChange={(e) => {
                    setSignUpFormState({
                      ...signUpFormState,
                      password: e.target.value,
                    });
                  }}
                  className={`w-full bg-surface/60 border rounded-xl px-4 py-3 text-text text-sm placeholder-muted transition-colors focus:border-purple focus:outline-none pr-11`}
                />

                <button
                  onClick={() =>
                    setSignUpFormState({
                      ...signUpFormState,
                      showPassword: !signUpFormState.showPassword,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-subtext transition-colors"
                >
                  {signUpFormState.showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-subtext tracking-wider block mb-2">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <input
                  placeholder="••••••••"
                  type={signUpFormState.showConfirmPassword ? "text" : "password"}
                  value={signUpFormState.confirmPassword}
                  onChange={(e) => {
                    setSignUpFormState({
                      ...signUpFormState,
                      confirmPassword: e.target.value,
                    });
                  }}
                  className={`w-full bg-surface/60 border rounded-xl px-4 py-3 text-text text-sm placeholder-muted transition-colors focus:border-purple focus:outline-none pr-11`}
                />

                <button
                  onClick={() =>
                    setSignUpFormState({
                      ...signUpFormState,
                      showConfirmPassword: !signUpFormState.showConfirmPassword,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-subtext transition-colors"
                >
                  {signUpFormState.showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSingInButtonClick}
              className="w-full bg-purple text-card font-semibold py-3 rounded-xl hover:bg-purple/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple/20 mt-1"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
