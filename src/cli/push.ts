import fs from "node:fs";
import path from "node:path";
import { httpFetch } from "./http";

export interface PushOptions {
  input: string;
  endpoint?: string;
}

export async function pushComponents(
  options: PushOptions,
): Promise<{ success: boolean; count: number; message: string }> {
  const endpoint =
    options.endpoint || "http://localhost:8787/api/sync/component-upstream";
  const resolvedInput = path.resolve(options.input);

  if (!fs.existsSync(resolvedInput)) {
    throw new Error(`Input path not found: ${resolvedInput}`);
  }

  let componentsPayload: unknown[];

  const stat = fs.statSync(resolvedInput);
  if (stat.isDirectory()) {
    const files = fs
      .readdirSync(resolvedInput)
      .filter((f) => f.endsWith(".json"));
    componentsPayload = [];
    for (const f of files) {
      const content = JSON.parse(
        fs.readFileSync(path.join(resolvedInput, f), "utf-8"),
      );
      if (Array.isArray(content)) {
        componentsPayload.push(...content);
      } else {
        componentsPayload.push(content);
      }
    }
  } else {
    const content = JSON.parse(fs.readFileSync(resolvedInput, "utf-8"));
    componentsPayload = Array.isArray(content) ? content : [content];
  }

  try {
    const response = await httpFetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ components: componentsPayload }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        count: 0,
        message: `Upstream failed with status ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json<{ count?: number; message?: string }>();
    return {
      success: true,
      count: data.count || componentsPayload.length,
      message:
        data.message ||
        `Successfully pushed ${componentsPayload.length} components to ${endpoint}`,
    };
  } catch (err) {
    return {
      success: false,
      count: 0,
      message: `Failed to push components to ${endpoint}: ${
        err instanceof Error ? err.message : String(err)
      }`,
    };
  }
}
