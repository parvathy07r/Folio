"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const { signup } = useAuth();
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

  const handleSignUpButtonClick = async () => {
    if (
      !signUpFormState.name ||
      !signUpFormState.email ||
      !signUpFormState.password
    ) {
      setSignUpFormState((prev) => ({
        ...prev,
        error: "Please fill in all fields",
      }));
      return;
    }

    if (signUpFormState.password !== signUpFormState.confirmPassword) {
      setSignUpFormState((prev) => ({
        ...prev,
        error: "Passwords do not match",
      }));
      return;
    }

    if (signUpFormState.password.length < 6) {
      setSignUpFormState((prev) => ({
        ...prev,
        error: "Password must be at least 6 characters",
      }));
      return;
    }

    setSignUpFormState((prev) => ({ ...prev, loading: true, error: "" }));

    const result = await signup(
      signUpFormState.name,
      signUpFormState.email,
      signUpFormState.password,
    );

    if (result.error) {
      setSignUpFormState((prev) => ({
        ...prev,
        loading: false,
        error: result.error || "Signup failed",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <Card className="bg-surface/80 border-border rounded-2xl p-9 backdrop-blur-md shadow-2xl ring-0">
          {/* heading */}
          <CardHeader className="p-0 mb-1">
            <CardTitle className="font-playfair text-2xl font-bold text-text">
              Welcome to Folio!
            </CardTitle>
            <CardDescription className="text-subtle text-sm">
              Sign up to your Folio workspace
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 flex flex-col gap-4">
            {/* name */}
            <div>
              <Label className="text-xs font-semibold text-subtext tracking-wider mb-2">
                NAME
              </Label>
              <Input
                type="text"
                placeholder="John Doe"
                value={signUpFormState.name}
                onChange={(e) => {
                  setSignUpFormState({
                    ...signUpFormState,
                    name: e.target.value,
                  });
                }}
                className="w-full bg-surface/60 border-border rounded-xl px-4 py-3 h-auto text-text text-sm placeholder:text-muted-foreground focus-visible:border-purple focus-visible:ring-purple/30"
              />
            </div>
            {/* Email */}
            <div>
              <Label className="text-xs font-semibold text-subtext tracking-wider mb-2">
                EMAIL
              </Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={signUpFormState.email}
                onChange={(e) => {
                  setSignUpFormState({
                    ...signUpFormState,
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
                  type={signUpFormState.showPassword ? "text" : "password"}
                  value={signUpFormState.password}
                  onChange={(e) => {
                    setSignUpFormState({
                      ...signUpFormState,
                      password: e.target.value,
                    });
                  }}
                  className="w-full bg-surface/60 border-border rounded-xl px-4 py-3 h-auto text-text text-sm placeholder:text-muted-foreground focus-visible:border-purple focus-visible:ring-purple/30 pr-11"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSignUpFormState({
                      ...signUpFormState,
                      showPassword: !signUpFormState.showPassword,
                    })
                  }
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-subtle hover:text-subtext h-auto px-2 py-1"
                >
                  {signUpFormState.showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label className="text-xs font-semibold text-subtext tracking-wider mb-2">
                CONFIRM PASSWORD
              </Label>
              <div className="relative">
                <Input
                  placeholder="••••••••"
                  type={
                    signUpFormState.showConfirmPassword ? "text" : "password"
                  }
                  value={signUpFormState.confirmPassword}
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                  }}
                  onChange={(e) => {
                    setSignUpFormState({
                      ...signUpFormState,
                      confirmPassword: e.target.value,
                    });
                  }}
                  className="w-full bg-surface/60 border-border rounded-xl px-4 py-3 h-auto text-text text-sm placeholder:text-muted-foreground focus-visible:border-purple focus-visible:ring-purple/30 pr-11"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSignUpFormState({
                      ...signUpFormState,
                      showConfirmPassword: !signUpFormState.showConfirmPassword,
                    })
                  }
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-subtle hover:text-subtext h-auto px-2 py-1"
                >
                  {signUpFormState.showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            {signUpFormState.error && (
              <p className="text-center text-sm text-red-500">
                {signUpFormState.error}
              </p>
            )}

            {/* Submit */}
            <Button
              onClick={handleSignUpButtonClick}
              disabled={signUpFormState.loading}
              className="w-full bg-purple text-card font-semibold py-3 h-auto rounded-xl hover:bg-purple/90 shadow-lg shadow-purple/20 mt-1"
            >
              {signUpFormState.loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                "Sign up"
              )}
            </Button>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-subtle mt-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-purple font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
