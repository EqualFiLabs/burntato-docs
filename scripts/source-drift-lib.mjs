import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

export function resolveProtocolRoot(root = process.cwd(), configured = process.env.BURNTATO_PATH) {
  const candidates = [
    configured,
    path.join(root, ".verification", "burntato"),
    path.resolve(root, "..", "burntato", "burntato"),
  ].filter(Boolean);

  const protocolRoot = candidates.find((candidate) =>
    fs.existsSync(path.join(candidate, "script", "libraries", "BurntatoDeploymentConfig.sol")),
  );

  if (!protocolRoot) {
    throw new Error(
      `Burntato source not found. Set BURNTATO_PATH or provide one of: ${candidates.join(", ")}`,
    );
  }
  return protocolRoot;
}

export function requireFragments(source, fragments, label) {
  for (const fragment of fragments) {
    assert.ok(source.includes(fragment), `${label} drifted: missing ${JSON.stringify(fragment)}`);
  }
}

export function verifySource({ root = process.cwd(), protocolRoot = resolveProtocolRoot(root) } = {}) {
  const readProtocol = (relativePath) =>
    fs.readFileSync(path.join(protocolRoot, relativePath), "utf8");
  const readDocs = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

  requireFragments(
    readProtocol("script/libraries/BurntatoDeploymentConfig.sol"),
    [
      "startingPrice: 0.01 ether",
      "priceIncreaseBps: 1_000",
      "roundTimeout: 1 hours",
      "roundEmissionBudget: 10_000 ether",
      "emissionStepBps: 1_000",
      "emissionVestingDuration: 4 minutes",
      "winnerBps: 2_500",
      "nextRoundWinnerBps: 200",
      "recoveryBps: 4_000",
      "treasuryBps: 2_300",
      "buybackBps: 1_000",
      "operatorPurchaseBps: 0",
      "recoveryBurnBps: 9_000",
      "recoveryTreasuryBps: 1_000",
      "roundTimeoutDecay: 5 minutes",
      "minimumRoundTimeout: 5 minutes",
      "maxSpend: 2 ether, callerRewardBps: 50, delayBlocks: 1",
      "hookFeeBps: 100",
      "potatoSeed: 100_000_000 ether",
      "INITIAL_WINNER_TARGET_BPS = 10_500",
    ],
    "BurntatoDeploymentConfig.sol",
  );

  requireFragments(
    readProtocol("src/libraries/BurntatoLaunchCurves.sol"),
    [
      "CURVE_COUNT = 6",
      "POSITION_COUNT = 56",
      "TICK_SPACING = 60",
      "INITIAL_TICK = 170_280",
      "positions: 11, shareBps: 250",
      "positions: 11, shareBps: 750",
      "positions: 11, shareBps: 1_250",
      "positions: 11, shareBps: 2_000",
      "positions: 11, shareBps: 4_250",
      "positions: 1, shareBps: 1_500",
    ],
    "BurntatoLaunchCurves.sol",
  );

  requireFragments(
    readProtocol("src/shared/Constants.sol"),
    [
      "MAX_HOOK_FEE_BPS = 200",
      "MAX_BUYBACK_CALLER_REWARD_BPS = 100",
      "STALLED_RECOVERY_DELAY = 30 days",
      "POOL_LP_FEE = 0",
      "0x000000000000000000000000000000000000dEaD",
    ],
    "Constants.sol",
  );

  requireFragments(
    readProtocol("src/interfaces/IGame.sol"),
    [
      "function buyPotato() external payable",
      "function fundRoundReserves(uint256 targetRoundId, uint256 winnerAmount, uint256 recoveryAmount)",
      "function roundFunding(uint256 roundId)",
      "function materializeMaturedEmission() external returns (uint256 baseEarned, uint256 treasuryEarned)",
    ],
    "IGame.sol",
  );

  requireFragments(
    readProtocol("src/interfaces/IOperatorRewards.sol"),
    [
      "function registerBatch(uint256[] calldata operatorIds) external",
      "function syncBatch(uint256[] calldata operatorIds) external",
      "function claimBatch(uint256[] calldata operatorIds, address receiver)",
      "function totalRegisteredOperators() external view returns (uint256)",
    ],
    "IOperatorRewards.sol",
  );

  requireFragments(
    readDocs("content/docs/reference/defaults.mdx"),
    [
      "0.01 ETH",
      "10,000 POTATO",
      "100,000,000 POTATO",
      "6 bands / 56 locked positions",
      "100 BPS (1%)",
      "2 ETH",
    ],
    "reference/defaults.mdx",
  );

  const sourceManifest = JSON.parse(
    readProtocol("deployments/robinhood-testnet-46630-launch.json"),
  );
  const publicManifest = JSON.parse(
    readDocs("public/deployments/robinhood-testnet-46630-launch.json"),
  );
  assert.deepEqual(publicManifest, sourceManifest, "public Robinhood deployment manifest drifted");

  return {
    protocolRoot,
    deploymentCommit: sourceManifest.source.burntatoCommit,
    docsPages: fs
      .readdirSync(path.join(root, "content", "docs"), { recursive: true })
      .filter((entry) => entry.endsWith(".mdx")).length,
  };
}
