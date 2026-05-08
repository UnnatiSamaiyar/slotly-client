"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Driver } from "driver.js";
import {
  DASHBOARD_INTRO_TOUR_STEPS,
  DASHBOARD_TOUR_START_EVENT,
  type DashboardTourStep,
} from "./dashboardTourConfig";
import {
  markDashboardTourCompleted,
  markDashboardTourSkipped,
  markDashboardTourStarted,
  shouldAutoStartDashboardTour,
} from "./tourStorage";

type StartSource = "auto" | "manual";

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function findAvailableSelector(selectors: string[]) {
  for (const selector of selectors) {
    try {
      if (document.querySelector(selector)) return selector;
    } catch {
      // Ignore invalid selectors so one bad step never breaks the dashboard.
    }
  }

  return null;
}

async function resolveAvailableTourSteps(rawSteps: DashboardTourStep[]) {
  const startedAt = Date.now();
  const minUsefulSteps = Math.min(3, rawSteps.length);

  while (Date.now() - startedAt < 2400) {
    const availableSteps = rawSteps
      .map((step) => ({ step, selector: findAvailableSelector(step.selectors) }))
      .filter((item): item is { step: DashboardTourStep; selector: string } => Boolean(item.selector));

    if (availableSteps.length >= minUsefulSteps) {
      return availableSteps;
    }

    await sleep(120);
  }

  return rawSteps
    .map((step) => ({ step, selector: findAvailableSelector(step.selectors) }))
    .filter((item): item is { step: DashboardTourStep; selector: string } => Boolean(item.selector));
}

export default function DashboardTourProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const driverRef = useRef<Driver | null>(null);
  const isRunningRef = useRef(false);
  const autoStartAttemptedRef = useRef(false);
  const pendingStartAfterNavigationRef = useRef<StartSource | null>(null);
  const resolvedStatusRef = useRef<"completed" | "skipped" | null>(null);

  const finishTour = useCallback((status: "completed" | "skipped") => {
    if (resolvedStatusRef.current) return;

    resolvedStatusRef.current = status;

    if (status === "completed") {
      markDashboardTourCompleted();
      return;
    }

    markDashboardTourSkipped();
  }, []);

  const startDashboardTour = useCallback(
    async (source: StartSource = "manual") => {
      if (typeof window === "undefined") return;

      if (pathname !== "/dashboard") {
        pendingStartAfterNavigationRef.current = source;
        router.push("/dashboard");
        return;
      }

      if (source === "auto" && !shouldAutoStartDashboardTour()) return;
      if (isRunningRef.current) return;

      isRunningRef.current = true;
      resolvedStatusRef.current = null;

      try {
        markDashboardTourStarted();

        const availableSteps = await resolveAvailableTourSteps(DASHBOARD_INTRO_TOUR_STEPS);

        if (availableSteps.length < 2) {
          finishTour("skipped");
          isRunningRef.current = false;
          driverRef.current = null;
          return;
        }

        const { driver } = await import("driver.js");
        const tour = driver({
          animate: true,
          allowClose: true,
          allowKeyboardControl: true,
          overlayClickBehavior: "close",
          smoothScroll: true,
          showButtons: ["next", "previous", "close"],
          showProgress: true,
          popoverClass: "slotly-tour-popover",
          nextBtnText: "Next",
          prevBtnText: "Back",
          doneBtnText: "Finish",
          overlayColor: "rgba(15, 23, 42, 0.62)",
          stagePadding: window.innerWidth < 640 ? 8 : 10,
          stageRadius: 18,
          steps: availableSteps.map(({ step, selector }) => ({
            element: selector,
            popover: {
              title: step.title,
              description: step.description,
              side: step.side || "bottom",
              align: step.align || "center",
            },
          })),
          onNextClick: (_element, _step, options) => {
            const activeDriver = options.driver;

            if (activeDriver.hasNextStep()) {
              activeDriver.moveNext();
              return;
            }

            finishTour("completed");
            activeDriver.destroy();
          },
          onCloseClick: (_element, _step, options) => {
            finishTour("skipped");
            options.driver.destroy();
          },
          onDestroyed: () => {
            if (!resolvedStatusRef.current) {
              finishTour("skipped");
            }

            driverRef.current = null;
            isRunningRef.current = false;
          },
        });

        driverRef.current = tour;
        tour.drive();
      } catch (error) {
        console.error("Dashboard tour failed to start:", error);
        finishTour("skipped");
        isRunningRef.current = false;
        driverRef.current = null;
      }
    },
    [finishTour, pathname, router],
  );

  useEffect(() => {
    const handleStartTour = (event: Event) => {
      const source = (event as CustomEvent<{ source?: StartSource }>).detail?.source || "manual";
      void startDashboardTour(source);
    };

    window.addEventListener(DASHBOARD_TOUR_START_EVENT, handleStartTour as EventListener);
    return () => {
      window.removeEventListener(DASHBOARD_TOUR_START_EVENT, handleStartTour as EventListener);
    };
  }, [startDashboardTour]);

  useEffect(() => {
    if (pathname !== "/dashboard") return;
    const pendingSource = pendingStartAfterNavigationRef.current;
    if (!pendingSource) return;

    pendingStartAfterNavigationRef.current = null;
    const timer = window.setTimeout(() => {
      void startDashboardTour(pendingSource);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [pathname, startDashboardTour]);

  useEffect(() => {
    if (pathname !== "/dashboard") return;
    if (autoStartAttemptedRef.current) return;

    autoStartAttemptedRef.current = true;
    const timer = window.setTimeout(() => {
      void startDashboardTour("auto");
    }, 750);

    return () => window.clearTimeout(timer);
  }, [pathname, startDashboardTour]);

  useEffect(() => {
    return () => {
      driverRef.current?.destroy();
      driverRef.current = null;
      isRunningRef.current = false;
    };
  }, []);

  return <>{children}</>;
}
