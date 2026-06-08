"use client";

import { useEffect } from "react";

const DEPLOYMENT_STORAGE_KEY = "neatchat-deployment-id";
const DEPLOYMENT_REFRESHING_KEY = "neatchat-deployment-refreshing-id";

export function DeploymentRefresher() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    async function refreshOnDeploymentChange() {
      try {
        const response = await fetch("/api/config", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-store",
          },
        });

        if (!response.ok) return;

        const config = (await response.json()) as Partial<DangerConfig>;
        const deploymentId = config.deploymentId;
        if (!deploymentId || cancelled) return;

        const previousDeploymentId = window.localStorage.getItem(
          DEPLOYMENT_STORAGE_KEY,
        );

        window.localStorage.setItem(DEPLOYMENT_STORAGE_KEY, deploymentId);

        if (
          previousDeploymentId &&
          previousDeploymentId !== deploymentId &&
          window.sessionStorage.getItem(DEPLOYMENT_REFRESHING_KEY) !==
            deploymentId
        ) {
          window.sessionStorage.setItem(
            DEPLOYMENT_REFRESHING_KEY,
            deploymentId,
          );
          window.location.reload();
          return;
        }

        if (
          window.sessionStorage.getItem(DEPLOYMENT_REFRESHING_KEY) ===
          deploymentId
        ) {
          window.sessionStorage.removeItem(DEPLOYMENT_REFRESHING_KEY);
        }
      } catch (error) {
        console.error("[Deployment] failed to check deployment id", error);
      }
    }

    refreshOnDeploymentChange();
    window.addEventListener("focus", refreshOnDeploymentChange);
    document.addEventListener("visibilitychange", refreshOnDeploymentChange);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", refreshOnDeploymentChange);
      document.removeEventListener(
        "visibilitychange",
        refreshOnDeploymentChange,
      );
    };
  }, []);

  return null;
}
