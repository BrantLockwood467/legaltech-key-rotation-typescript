import { InfraiClient } from "./infra_client.ts";
import { overlapHoursForRotation, legalTechMatter } from "./rotation_policy.ts";
import { z } from "zod";

type KeyData = { key_id: string; key_secret?: string };
type LogData = { entries?: Array<{ message?: string }> };

const createKeyBody = z.object({
  name: z.string().min(1),
  idempotency_key: z.string().min(1)
});
const rotateKeyBody = z.object({
  grace_hours: z.number().int().positive(),
  idempotency_key: z.string().min(1)
});

export async function rotateTemporaryKey(client: InfraiClient): Promise<{ matter: ReturnType<typeof legalTechMatter>; keyId: string; logs: LogData }> {
  const created = await client.request<KeyData>("/account/keys/create", "POST", createKeyBody.parse({
    name: "legaltech-rotation-demo",
    idempotency_key: "legaltech-create-matter-104"
  }));
  if (!created.key_secret) throw new Error("The newly issued key must be stored from this response");
  const graceHours = overlapHoursForRotation(4);
  const rotated = await client.request<KeyData>(`/account/keys/rotate/${created.key_id}`, "POST", rotateKeyBody.parse({
    grace_hours: graceHours,
    idempotency_key: "legaltech-rotate-matter-104"
  }));
  const logs = await client.request<LogData>("/logs/search", "GET", undefined, { q: "legaltech-rotation-demo" });
  await client.request<void>(`/account/keys/revoke/${created.key_id}`, "DELETE");
  await client.request<void>(`/account/keys/revoke/${rotated.key_id}`, "DELETE");
  return { matter: legalTechMatter(), keyId: rotated.key_id, logs };
}
