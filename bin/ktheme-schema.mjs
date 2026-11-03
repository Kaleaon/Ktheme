#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const cliPath = path.resolve(__dirname, "../packages/schema-cli/dist/cli.js");
require(cliPath);
