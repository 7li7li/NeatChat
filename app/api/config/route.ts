import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

import { getServerSideConfig } from "../../config/server";

const NoStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

function readBuildId() {
  const candidates = [
    join(process.cwd(), ".next", "BUILD_ID"),
    join(process.cwd(), "..", ".next", "BUILD_ID"),
  ];

  for (const file of candidates) {
    if (existsSync(file)) {
      return readFileSync(file, "utf8").trim();
    }
  }
}

const BUILD_ID =
  process.env.BUILD_ID || process.env.VERCEL_GIT_COMMIT_SHA || readBuildId();
const SERVER_BOOT_ID = Date.now().toString();

function getDeploymentId(config: ReturnType<typeof getServerSideConfig>) {
  const explicitId =
    process.env.DEPLOYMENT_ID || process.env.NEXT_PUBLIC_DEPLOYMENT_ID;
  if (explicitId) return explicitId;

  return createHash("sha256")
    .update(
      JSON.stringify({
        buildId: BUILD_ID,
        serverBootId: SERVER_BOOT_ID,
        needCode: config.needCode,
        hideUserApiKey: config.hideUserApiKey,
        disableGPT4: config.disableGPT4,
        hideBalanceQuery: config.hideBalanceQuery,
        disableFastLink: config.disableFastLink,
        customModels: config.customModels,
        defaultModel: config.defaultModel,
        baseUrl: process.env.BASE_URL,
        hasOpenAiApiKey: !!process.env.OPENAI_API_KEY,
      }),
    )
    .digest("hex")
    .slice(0, 16);
}

// Danger! Do not hard code or expose any secret value here.
function getDangerConfig() {
  const serverConfig = getServerSideConfig();

  return {
    deploymentId: getDeploymentId(serverConfig),
    needCode: serverConfig.needCode,
    hideUserApiKey: serverConfig.hideUserApiKey,
    disableGPT4: serverConfig.disableGPT4,
    hideBalanceQuery: serverConfig.hideBalanceQuery,
    disableFastLink: serverConfig.disableFastLink,
    customModels: serverConfig.customModels || process.env.CUSTOM_MODELS || "",
    defaultModel: serverConfig.defaultModel,
    baseUrl: process.env.BASE_URL || "https://api.openai.com",
    apiKey: process.env.OPENAI_API_KEY ? "set" : "",
  };
}

declare global {
  type DangerConfig = ReturnType<typeof getDangerConfig>;
}

async function handle() {
  return NextResponse.json(getDangerConfig(), { headers: NoStoreHeaders });
}

export const GET = handle;
export const POST = handle;

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";
