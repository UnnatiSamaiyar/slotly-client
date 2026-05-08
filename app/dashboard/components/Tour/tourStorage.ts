import { DASHBOARD_TOUR_ID, DASHBOARD_TOUR_VERSION } from "./dashboardTourConfig";

const TOUR_STORAGE_KEY = "slotly_dashboard_tour_state_v1";

type StoredTourRecord = {
  version: string;
  at: string;
};

type TourStorageShape = {
  completedTours: Record<string, StoredTourRecord>;
  skippedTours: Record<string, StoredTourRecord>;
  lastSeenTourVersion: Record<string, string>;
};

function defaultTourStorage(): TourStorageShape {
  return {
    completedTours: {},
    skippedTours: {},
    lastSeenTourVersion: {},
  };
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readTourStorage(): TourStorageShape {
  if (!canUseStorage()) return defaultTourStorage();

  try {
    const raw = window.localStorage.getItem(TOUR_STORAGE_KEY);
    if (!raw) return defaultTourStorage();

    const parsed = JSON.parse(raw) as Partial<TourStorageShape>;

    return {
      completedTours: parsed.completedTours || {},
      skippedTours: parsed.skippedTours || {},
      lastSeenTourVersion: parsed.lastSeenTourVersion || {},
    };
  } catch {
    return defaultTourStorage();
  }
}

function writeTourStorage(next: TourStorageShape) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can fail in restricted browser modes. Tours should never break the app.
  }
}

function nowIso() {
  return new Date().toISOString();
}

export function shouldAutoStartDashboardTour() {
  const state = readTourStorage();
  const completed = state.completedTours[DASHBOARD_TOUR_ID]?.version === DASHBOARD_TOUR_VERSION;
  const skipped = state.skippedTours[DASHBOARD_TOUR_ID]?.version === DASHBOARD_TOUR_VERSION;
  const seen = state.lastSeenTourVersion[DASHBOARD_TOUR_ID] === DASHBOARD_TOUR_VERSION;

  return !completed && !skipped && !seen;
}

export function markDashboardTourStarted() {
  const state = readTourStorage();
  writeTourStorage({
    ...state,
    lastSeenTourVersion: {
      ...state.lastSeenTourVersion,
      [DASHBOARD_TOUR_ID]: DASHBOARD_TOUR_VERSION,
    },
  });
}

export function markDashboardTourCompleted() {
  const state = readTourStorage();
  const nextSkipped = { ...state.skippedTours };
  delete nextSkipped[DASHBOARD_TOUR_ID];

  writeTourStorage({
    ...state,
    skippedTours: nextSkipped,
    completedTours: {
      ...state.completedTours,
      [DASHBOARD_TOUR_ID]: {
        version: DASHBOARD_TOUR_VERSION,
        at: nowIso(),
      },
    },
    lastSeenTourVersion: {
      ...state.lastSeenTourVersion,
      [DASHBOARD_TOUR_ID]: DASHBOARD_TOUR_VERSION,
    },
  });
}

export function markDashboardTourSkipped() {
  const state = readTourStorage();
  writeTourStorage({
    ...state,
    skippedTours: {
      ...state.skippedTours,
      [DASHBOARD_TOUR_ID]: {
        version: DASHBOARD_TOUR_VERSION,
        at: nowIso(),
      },
    },
    lastSeenTourVersion: {
      ...state.lastSeenTourVersion,
      [DASHBOARD_TOUR_ID]: DASHBOARD_TOUR_VERSION,
    },
  });
}
