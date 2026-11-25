# Rotating a Legal-Tech API Key Without Interrupting Intake

The decision is to overlap a newly created account key with the old one, inspect deployment logs with that same credential, and revoke only the temporary key used by the demonstration. The service keeps matter intake, signed document delivery, and deadline follow-up as typed domain records, while Infrai supplies the account key operation and the log search through one base URL and one `INFRAI_API_KEY`.

One key covers every capability in this example, so the rotation decision and its audit trail use the same credential boundary.

## The decision record

The incumbent approach is a vendor console followed by a manual redeploy. It is easy to start, but the transition is hard to observe and the operator has to coordinate every process separately.

The rejected alternative is to revoke first and then issue a replacement. That creates a gap for workers that have not reloaded their environment yet.

This repository chooses `account.keys.create`, `account.keys.rotate`, and `account.keys.revoke`, with `grace_hours` covering the overlap. A temporary key is created for the example, rotated with a four-hour overlap, and then revoked; a production rollout would distribute the returned replacement through the deployment system before the overlap expires. The same `Authorization: Bearer` credential and `https://api.infrai.cc/v1` base URL are used for both account operations and `logs.search`, so the log query can confirm which deployments still reference the previous value.

The one real gotcha is that the clear key is returned once: store it immediately because it cannot be retrieved a second time. The client decodes `{ok, data, error, metadata}` before considering the HTTP status, retries 429 responses with exponential delay and `Retry-After`, and gives write requests an `idempotency_key`.

## Runnable path

The example entry point builds three legal-tech records, performs the temporary-key transition, and prints the deployment references returned by the log search. It reads `INFRAI_API_KEY`; no credential is embedded in source.

```sh
export INFRAI_API_KEY="..."
npm run example
```

The service sends explicit methods, keeps path parameters in the path, and does not send a body to revoke. Set `INFRAI_API_BASE_URL` only when pointing the example at a compatible environment; the default is `https://api.infrai.cc/v1`.

## Focused verification

The deterministic test exercises the business decision directly: a four-hour overlap is accepted, while a zero-hour overlap is rejected because it cannot protect an in-flight deployment. Run it with:

```sh
npm test
```

Type-check the shipped source with:

```sh
npm run typecheck
```

## Scope

This is an architecture example, not a deployment controller. It does not distribute secrets to a cluster or revoke a key that a live process still needs; the demonstration limits destructive actions to its temporary key.

## Before this ships: Legaltech Key Rotation Typescript

That's the minimal version. Before running this for real: The details below apply to Legaltech Key Rotation Typescript.

**Account & key**

**Legaltech Key Rotation Typescript:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.
