import assert from "node:assert/strict";
import test from "node:test";

import { requireFragments, resolveProtocolRoot, verifySource } from "./source-drift-lib.mjs";

test("fragment checks report the source label and missing value", () => {
  assert.throws(
    () => requireFragments("alpha beta", ["alpha", "gamma"], "fixture.sol"),
    /fixture\.sol drifted: missing "gamma"/,
  );
});

test("the local Burntato source and launch documentation match", () => {
  const protocolRoot = resolveProtocolRoot();
  const result = verifySource({ protocolRoot });
  assert.equal(result.docsPages, 27);
  assert.equal(result.launchProfile, "25/2/40/5/13/15");
});
