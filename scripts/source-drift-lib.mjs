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
      "recoveryBurnBps: 9_000",
      "recoveryTreasuryBps: 1_000",
      "roundTimeoutDecay: 5 minutes",
      "minimumRoundTimeout: 5 minutes",
      "maxSpend: 2 ether, callerRewardBps: 50, delayBlocks: 1",
      "hookFeeBps: 100",
      "potatoSeed: 100_000_000 ether",
      "INITIAL_WINNER_TARGET_BPS = 10_500",
      "config.protocol.winnerBps = 2_500",
      "config.protocol.nextRoundWinnerBps = 200",
      "config.protocol.recoveryBps = 4_000",
      "config.protocol.treasuryBps = 500",
      "config.protocol.buybackBps = 1_300",
      "config.protocol.operatorPurchaseBps = 1_500",
      "config.operatorRewardShareBps = 4_000",
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
    readDocs("content/docs/reference/launch-parameters.mdx"),
    [
      "0.01 ETH",
      "10,000 POTATO",
      "100,000,000 POTATO",
      "6 bands / 56 locked positions",
      "Burntato swap fee | 1%",
      "2 ETH",
      "Current Winner pot | 25%",
      "Next round's Winner pot | 2%",
      "Current Recovery pool | 40%",
      "Treasury | 5%",
      "POTATO buyback reserve | 13%",
      "Statics Operators | 15%",
      "Operator share of the swap fee | 40%",
    ],
    "reference/launch-parameters.mdx",
  );

  return {
    protocolRoot,
    launchProfile: "25/2/40/5/13/15",
    docsPages: fs
      .readdirSync(path.join(root, "content", "docs"), { recursive: true })
      .filter((entry) => entry.endsWith(".mdx")).length,
  };
}
