import { TOTP, Secret } from "otpauth";
import QRCode from "qrcode";

export function generateTOTPSecret(): string {
  const secret = new Secret({ size: 20 });
  return secret.base32;
}

export function generateOTPAuthURL(email: string, secret: string): string {
  const totp = new TOTP({
    issuer: "Folio",
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  });
  return totp.toString();
}

export async function generateQRCode(
  email: string,
  secret: string,
): Promise<string> {
  const otpauthUrl = generateOTPAuthURL(email, secret);
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
  return qrCodeDataUrl;
}

export function verifyTOTPCode(token: string, secret: string): boolean {
  const totp = new TOTP({
    issuer: "Folio",
    label: "user",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  });
  const delta = totp.validate({ token, window: 1 });
  return delta !== null;
}
