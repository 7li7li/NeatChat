import tauriConfig from "../../src-tauri/tauri.conf.json";
import { DEFAULT_INPUT_TEMPLATE } from "../constant";
import buildInfo from "./build-info.json";

export const getBuildConfig = () => {
  if (typeof process === "undefined") {
    throw Error(
      "[Server Config] you are importing a nodejs-only module outside of nodejs",
    );
  }

  const buildMode = process.env.BUILD_MODE ?? "standalone";
  const isApp = !!process.env.BUILD_APP;
  const version = "v" + tauriConfig.package.version;

  const commitInfo = {
    commitDate:
      process.env.COMMIT_DATE ||
      process.env.NEXT_PUBLIC_COMMIT_DATE ||
      buildInfo.commitDate,
    commitHash:
      process.env.COMMIT_HASH ||
      process.env.NEXT_PUBLIC_COMMIT_HASH ||
      buildInfo.commitHash,
  };

  return {
    version,
    ...commitInfo,
    buildMode,
    isApp,
    template: process.env.DEFAULT_INPUT_TEMPLATE ?? DEFAULT_INPUT_TEMPLATE,
  };
};

export type BuildConfig = ReturnType<typeof getBuildConfig>;
