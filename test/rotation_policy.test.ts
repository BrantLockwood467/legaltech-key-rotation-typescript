import assert from "node:assert/strict";
import { overlapHoursForRotation } from "../src/rotation_policy.ts";

assert.equal(overlapHoursForRotation(4), 4);
assert.throws(() => overlapHoursForRotation(0), /positive integer/);
console.log("rotation policy: overlap protects the transition");
