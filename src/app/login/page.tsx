"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import TOTPInput from "@/components/TOTPInput";

export default function LoginPage() {
  const { login } = useAuth();
  const [loginFormState, setLoginFormState] = useState({
    email: "",
    password: "",
    showPassword: false,
    error: "",
    loading: false,
    requiresTOTP: false,
  });

  const handleSignInButtonClick = async () => {
    if (!loginFormState.email || !loginFormState.password) {
      setLoginFormState((prev) => ({
        ...prev,
        error: "Please enter email and password",
      }));
      return;
    }

    setLoginFormState((prev) => ({ ...prev, loading: true, error: "" }));

    const result = await login(loginFormState.email, loginFormState.password);

    if (result.requiresTOTP) {
      setLoginFormState((prev) => ({
        ...prev,
        loading: false,
        requiresTOTP: true,
      }));
      return;
    }

    if (result.error) {
      setLoginFormState((prev) => ({
        ...prev,
        loading: false,
        error: result.error || "Login failed",
      }));
    }
  };

  const handleTOTPSubmit = async (code: string) => {
    setLoginFormState((prev) => ({ ...prev, loading: true, error: "" }));

    const result = await login(
      loginFormState.email,
      loginFormState.password,
      code,
    );

    if (result.error) {
      setLoginFormState((prev) => ({
        ...prev,
        loading: false,
        error: result.error || "Invalid 2FA code",
      }));
    }
  };

  const handleBackToLogin = () => {
    setLoginFormState((prev) => ({
      ...prev,
      requiresTOTP: false,
      error: "",
    }));
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <Card className="bg-surface/80 border-border rounded-2xl p-9 backdrop-blur-md shadow-2xl ring-0">
          <CardHeader className="p-0 mb-1">
            <CardTitle className="font-playfair text-2xl font-bold text-text">
              Welcome back
            </CardTitle>
            <CardDescription className="text-subtle text-sm">
              Sign in to your Folio workspace
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 flex flex-col gap-4">
            {loginFormState.requiresTOTP ? (
              <form onSubmit={(e) => e.preventDefault()}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBackToLogin}
                  className="w-fit -ml-2 text-subtle hover:text-text"
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Back
                </Button>

                {loginFormState.error && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-500">
                      {loginFormState.error}
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-sm text-subtle">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <TOTPInput
                  onComplete={handleTOTPSubmit}
                  disabled={loginFormState.loading}
                />

                {loginFormState.loading && (
                  <div className="flex justify-center">
                    <Loader2 className="size-6 animate-spin text-purple" />
                  </div>
                )}
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSignInButtonClick();
                }}
                className="flex flex-col gap-4"
              >
                {loginFormState.error && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-500">
                      {loginFormState.error}
                    </p>
                  </div>
                )}

                {/* Email */}
                <div>
                  <Label className="text-xs font-semibold text-subtext tracking-wider mb-2">
                    EMAIL
                  </Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={loginFormState.email}
                    onChange={(e) => {
                      setLoginFormState({
                        ...loginFormState,
                        email: e.target.value,
                      });
                    }}
                    className="w-full bg-surface/60 border-border rounded-xl px-4 py-3 h-auto text-text text-sm placeholder:text-muted-foreground focus-visible:border-purple focus-visible:ring-purple/30"
                  />
                </div>

                {/* Password */}
                <div>
                  <Label className="text-xs font-semibold text-subtext tracking-wider mb-2">
                    PASSWORD
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="••••••••"
                      type={loginFormState.showPassword ? "text" : "password"}
                      value={loginFormState.password}
                      onChange={(e) => {
                        setLoginFormState({
                          ...loginFormState,
                          password: e.target.value,
                        });
                      }}
                      className="w-full bg-surface/60 border-border rounded-xl px-4 py-3 h-auto text-text text-sm placeholder:text-muted-foreground focus-visible:border-purple focus-visible:ring-purple/30 pr-11"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setLoginFormState({
                          ...loginFormState,
                          showPassword: !loginFormState.showPassword,
                        })
                      }
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-subtle hover:text-subtext h-auto px-2 py-1"
                    >
                      {loginFormState.showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loginFormState.loading}
                  className="w-full bg-purple text-card font-semibold py-3 h-auto rounded-xl hover:bg-purple/90 shadow-lg shadow-purple/20 mt-1"
                >
                  {loginFormState.loading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        <p className="text-center text-sm text-subtle mt-5">
          Don&apos;t have an account?{" "}
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
