import { verifySource } from "./source-drift-lib.mjs";

try {
  const result = verifySource();
  console.log(
    `check-source-drift: ${result.docsPages} docs pages match current Burntato assumptions; deployment source ${result.deploymentCommit}`,
  );
} catch (error) {
  console.error(`check-source-drift: ${error.message}`);
  process.exit(1);
}
