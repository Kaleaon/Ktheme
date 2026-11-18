#!/usr/bin/env node
import { syncSchemas } from "./sync";

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
Usage: ktheme-schema <command> [options] [targets...]

Commands:
  sync              Migrate and validate theme schema definitions

Options:
  --check           Dry-run check mode: verify schema validity and detect drift without writing to disk
  --apply           Apply migrations and write formatted JSON to disk (default)
  -h, --help        Show this help message
`);
}

async function main() {
  if (!command || command === "--help" || command === "-h") {
    printHelp();
    process.exit(0);
  }

  if (command === "sync") {
    const isCheck = args.includes("--check");
    const isApply = args.includes("--apply") || !isCheck;

    const targets = args
      .slice(1)
      .filter((arg) => !arg.startsWith("--") && !arg.startsWith("-"));

    const result = syncSchemas({
      targets: targets.length > 0 ? targets : undefined,
      check: isCheck,
      apply: isApply,
    });

    if (result.errors > 0) {
      process.exit(1);
    }
    process.exit(0);
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exit(1);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
