"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import TOTPSetup from "@/components/TOTPSetup";
import TOTPInput from "@/components/TOTPInput";
import { Shield, ShieldCheck, ShieldOff, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [disableError, setDisableError] = useState("");
  const [disabling, setDisabling] = useState(false);

  const handleSetupSuccess = useCallback(() => {
    setShowSetup(false);
    refreshUser();
  }, [refreshUser]);

  const handleDisable = useCallback(async (code: string) => {
    setDisabling(true);
    setDisableError("");

    try {
      const res = await fetch("/api/auth/totp/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDisableError(data.error || "Failed to disable 2FA");
        setDisabling(false);
        return;
      }

      setShowDisable(false);
      refreshUser();
    } catch {
      setDisableError("Failed to disable 2FA");
      setDisabling(false);
    }
  }, [refreshUser]);

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-purple" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-text mb-8">Settings</h1>

        <Card className="bg-surface/80 border-border rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-text">
              <Shield className="size-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription className="text-subtle">
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            {showSetup ? (
              <TOTPSetup
                onSuccess={handleSetupSuccess}
                onCancel={() => setShowSetup(false)}
              />
            ) : showDisable ? (
              <div className="flex flex-col gap-4">
                <div className="text-center">
                  <p className="text-sm text-subtle">
                    Enter your 2FA code to disable two-factor authentication
                  </p>
                </div>

                <TOTPInput onComplete={handleDisable} disabled={disabling} />

                {disableError && (
                  <p className="text-center text-sm text-red-500">{disableError}</p>
                )}

                {disabling && (
                  <div className="flex justify-center">
                    <Loader2 className="size-6 animate-spin text-purple" />
                  </div>
                )}

                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowDisable(false);
                    setDisableError("");
                  }}
                  disabled={disabling}
                  className="w-full text-subtle"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user.totpEnabled ? (
                    <>
                      <ShieldCheck className="size-8 text-green-500" />
                      <div>
                        <p className="font-medium text-text">2FA is enabled</p>
                        <p className="text-sm text-subtle">
                          Your account is protected with two-factor authentication
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <ShieldOff className="size-8 text-yellow-500" />
                      <div>
                        <p className="font-medium text-text">2FA is not enabled</p>
                        <p className="text-sm text-subtle">
                          Enable 2FA to add an extra layer of security
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {user.totpEnabled ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowDisable(true)}
                    className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                  >
                    Disable 2FA
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowSetup(true)}
                    className="bg-purple text-card hover:bg-purple/90"
                  >
                    Enable 2FA
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-surface/80 border-border rounded-2xl mt-6">
          <CardHeader>
            <CardTitle className="text-text">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-subtext tracking-wider mb-1">NAME</p>
              <p className="text-text">{user.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-subtext tracking-wider mb-1">EMAIL</p>
              <p className="text-text">{user.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
