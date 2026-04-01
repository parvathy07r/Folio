"use client";

import { useRef, useState, useCallback, type KeyboardEvent, type ClipboardEvent } from "react";
import { Input } from "@/components/ui/input";

interface TOTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  disabled?: boolean;
}

export default function TOTPInput({
  length = 6,
  onComplete,
  disabled = false,
}: TOTPInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = useCallback((index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
    }
  }, [length]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;

      const digit = value.slice(-1);
      const newValues = [...values];
      newValues[index] = digit;
      setValues(newValues);

      if (digit && index < length - 1) {
        focusInput(index + 1);
      }

      const code = newValues.join("");
      if (code.length === length && !newValues.includes("")) {
        onComplete(code);
      }
    },
    [values, length, focusInput, onComplete]
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (values[index]) {
          const newValues = [...values];
          newValues[index] = "";
          setValues(newValues);
        } else if (index > 0) {
          focusInput(index - 1);
          const newValues = [...values];
          newValues[index - 1] = "";
          setValues(newValues);
        }
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        focusInput(index - 1);
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        focusInput(index + 1);
        e.preventDefault();
      }
    },
    [values, focusInput]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
      if (!pastedData) return;

      const newValues = [...values];
      for (let i = 0; i < Math.min(pastedData.length, length); i++) {
        newValues[i] = pastedData[i];
      }
      setValues(newValues);

      const nextEmptyIndex = newValues.findIndex((v) => !v);
      if (nextEmptyIndex === -1) {
        focusInput(length - 1);
        const code = newValues.join("");
        if (code.length === length) {
          onComplete(code);
        }
      } else {
        focusInput(nextEmptyIndex);
      }
    },
    [values, length, focusInput, onComplete]
  );

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={values[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-14 text-center text-2xl font-bold bg-surface/60 border-border rounded-xl focus-visible:border-purple focus-visible:ring-purple/30"
          autoComplete="off"
        />
      ))}
    </div>
  );
}
