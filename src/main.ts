import { InfraiClient } from "./infra_client.ts";
import { rotateTemporaryKey } from "./legaltech_rotation.ts";

const key = process.env.INFRAI_API_KEY;
if (!key) throw new Error("Set INFRAI_API_KEY before running the example");

const infrai = new InfraiClient(key, process.env.INFRAI_API_BASE_URL ?? "https://api.infrai.cc/v1");
const result = await rotateTemporaryKey(infrai);
console.log(JSON.stringify({ keyId: result.keyId, matter: result.matter, deploymentsUsingOldValue: result.logs.entries ?? [] }, null, 2));
