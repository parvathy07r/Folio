"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TOTPInput from "@/components/TOTPInput";
import { Loader2, CheckCircle2, Copy, Check } from "lucide-react";

interface TOTPSetupProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TOTPSetup({ onSuccess, onCancel }: TOTPSetupProps) {
  const [
    step, setStep] = useState<"loading" | "scan" | "verify" | "success">(
    "loading",
  );
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  const startSetup = useCallback(async () => {
    setStep("loading");
    setError("");
    try {
      const res = await fetch("/api/auth/totp/setup", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to setup 2FA");
        return;
      }

      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStep("scan");
    } catch {
      setError("Failed to setup 2FA");
    }
  }, []);

  useEffect(() => {
    startSetup();
  }, [startSetup]);

  const handleVerify = useCallback(
    async (code: string) => {
      setVerifying(true);
      setError("");

      try {
        const res = await fetch("/api/auth/totp/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Invalid code");
          setVerifying(false);
          return;
        }

        setStep("success");
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } catch {
        setError("Verification failed");
        setVerifying(false);
      }
    },
    [onSuccess],
  );

  const copySecret = useCallback(() => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [secret]);

  if (step === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-purple" />
        <p className="mt-4 text-subtle">Setting up 2FA...</p>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <CheckCircle2 className="size-16 text-green-500" />
        <p className="mt-4 text-lg font-semibold text-text">2FA Enabled!</p>
        <p className="mt-2 text-subtle">Your account is now more secure.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {step === "scan" && (
        <>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-text">Scan QR Code</h3>
            <p className="text-sm text-subtle mt-1">
              Use your authenticator app to scan this QR code
            </p>
          </div>

          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-xl">
              {qrCode && (
                <img src={qrCode} alt="TOTP QR Code" className="w-48 h-48" />
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-subtle mb-2">
              Or enter this code manually:
            </p>
            <div className="flex items-center justify-center gap-2">
              <code className="bg-surface px-3 py-2 rounded-lg text-sm font-mono text-text">
                {secret}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={copySecret}
                className="size-8"
              >
                {copied ? (
                  <Check className="size-4 text-green-500" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <Button
            onClick={() => setStep("verify")}
            className="w-full bg-purple text-card font-semibold py-3 h-auto rounded-xl hover:bg-purple/90"
          >
            Continue
          </Button>
        </>
      )}

      {step === "verify" && (
        <>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-text">Verify Code</h3>
            <p className="text-sm text-subtle mt-1">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <TOTPInput onComplete={handleVerify} disabled={verifying} />

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          {verifying && (
            <div className="flex justify-center">
              <Loader2 className="size-6 animate-spin text-purple" />
            </div>
          )}

          <Button
            variant="ghost"
            onClick={() => setStep("scan")}
            disabled={verifying}
            className="w-full"
          >
            Back to QR Code
          </Button>
        </>
      )}

      <Button variant="ghost" onClick={onCancel} className="w-full text-subtle">
        Cancel
      </Button>
    </div>
  );
}
