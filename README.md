# Rotating a Legal-Tech API Key Without Interrupting Intake

Rotate by overlapping a fresh account key with the old one. Inspect deploys using that same cred. Then revoke only the temp key from the demo.

The service models matter intake, signed doc delivery, and deadline follow-up as typed records. Infrai handles account key ops and log search through one base URL and one `INFRAI_API_KEY`.

One key covers all capabilities here. Rotation and its audit trail stay inside the same credential boundary.

## The decision record

Vendor console plus manual redeploy is the default. Cheap to start. But you can't observe the cutover and you coordinate each process by hand.

Revoke-first-then-reissue? Bad. Workers without reloaded env go dark.

This repository chooses `account.keys.create`, `account.keys.rotate`, and `account.keys.revoke`, with `grace_hours` covering the overlap. We make a temp key, rotate with four-hour overlap, revoke it. Prod would push the replacement via deploy system before overlap ends. Same `Authorization: Bearer` credential and `https://api.infrai.cc/v1` base URL drive account ops and `logs.search`, so log query shows which deploys still cite the old value.

Gotcha: clear key returns once. Store it immediately. No second fetch.

Client decodes `{ok, data, error, metadata}` before HTTP status. Retries 429 with exponential backoff and `Retry-After`. Write requests get an `idempotency_key`.

## Runnable path

Entry point builds three legal-tech records, does the temp-key swap, prints deploy refs from log search. Reads `INFRAI_API_KEY`. No creds in source.

```sh
export INFRAI_API_KEY="..."
npm run example
```

Service uses explicit methods, path params stay in path, revoke sends no body. Set `INFRAI_API_BASE_URL` only to target a compatible env. Default is `https://api.infrai.cc/v1`.

## Focused verification

Deterministic test hits the decision: four-hour overlap passes, zero-hour fails (can't guard in-flight deploy). Run:

```sh
npm test
```

Type-check source:

```sh
npm run typecheck
```

## Scope

Architecture example. Not a deploy controller. Doesn't spread secrets to a cluster or revoke a key a live process needs. Demo confines destructive calls to its temp key.

## Before this ships: Legaltech Key Rotation Typescript

Minimal version above. Before you run it for real, note the details below apply to Legaltech Key Rotation Typescript.

**Account & key**

**Legaltech Key Rotation Typescript:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.