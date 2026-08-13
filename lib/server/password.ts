import { hash, verify } from "@node-rs/argon2";

// argon2id parameters. These are deliberately above the bare minimum: this
// database stores health-related records, so a leaked password table must be
// expensive to attack offline. Tune `memoryCost` down only if the host cannot
// spare the RAM per concurrent login.
const ARGON2_OPTIONS = {
  memoryCost: 19456, // 19 MiB — OWASP minimum recommendation
  timeCost: 2,
  parallelism: 1,
} as const;

export function hashPassword(plaintext: string): Promise<string> {
  return hash(plaintext, ARGON2_OPTIONS);
}

export async function verifyPassword(storedHash: string, plaintext: string): Promise<boolean> {
  try {
    return await verify(storedHash, plaintext, ARGON2_OPTIONS);
  } catch {
    // A malformed/legacy hash must fail closed rather than throw.
    return false;
  }
}
