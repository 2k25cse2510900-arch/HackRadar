function getApiBaseUrl() {
  const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!configuredApiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const normalizedApiUrl = configuredApiUrl.replace(/\/$/, "");
  return normalizedApiUrl.endsWith("/api") ? normalizedApiUrl : `${normalizedApiUrl}/api`;
}

export const AUTH_TOKEN_STORAGE_KEY = "hackradar-auth-token";
export const AUTH_USER_STORAGE_KEY = "hackradar-auth-user";

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  errors?: Array<{ field?: string; message: string }>;
};

export type AuthUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  googleId?: string;
  authProvider?: "email" | "google";
  telegramChatId?: string | null;
  telegramVerified?: boolean;
  profileCompleted?: boolean;
  profile?: UserProfile;
};

export type UserProfile = {
  name: string;
  college: string;
  countryCode?: string;
  year: string;
  degree: string;
  domains: string[];
  skills: string[];
  goals: string[];
  preferredMode: string;
  availability: string;
  phoneNumber?: string;
};

export type Hackathon = {
  id: string;
  name: string;
  organizer: string;
  domain: string;
  mode: "Online" | "Offline" | "Hybrid";
  status: "Live" | "Upcoming" | "Ended";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  registration: "Free" | "Paid";
  deadline: string;
  registrationDeadline?: string | null;
  eventDates: string;
  location: string;
  prizePool: string;
  logo: string;
  officialWebsite: string;
  description: string;
  prizeBand: "High" | "Medium" | "Low";
};

export type Bookmark = {
  _id: string;
  hackathonId: string;
  hackathon?: Hackathon;
};

export type Alert = {
  _id: string;
  hackathonId: string;
  title: string;
  channels: string[];
  frequency: string;
  enabled: boolean;
  alertTime: string;
  lastTriggeredAt?: string | null;
  settings?: Record<string, unknown>;
};

function isAlert(value: unknown): value is Alert {
  if (!value || typeof value !== "object") return false;

  const alert = value as Partial<Alert>;
  return (
    typeof alert._id === "string" &&
    typeof alert.hackathonId === "string" &&
    typeof alert.title === "string" &&
    Array.isArray(alert.channels) &&
    alert.channels.every((channel) => typeof channel === "string") &&
    typeof alert.frequency === "string" &&
    typeof alert.enabled === "boolean" &&
    typeof alert.alertTime === "string"
  );
}

export function getAlertErrorMessage(error: unknown, fallback: string) {
  if (error instanceof TypeError) {
    return "Unable to connect to the alerts service. Check your connection and try again.";
  }

  return error instanceof Error && error.message.trim() ? error.message : fallback;
}

function apiUrl(path: string) {
  return `${getApiBaseUrl()}${path}`;
}

export function getGoogleAuthUrl(nextPath?: string | null) {
  const url = new URL(apiUrl("/auth/google"));
  if (nextPath?.startsWith("/")) {
    url.searchParams.set("next", nextPath);
  }
  return url.toString();
}

export function getStoredAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function getStoredAuthUser() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setStoredAuthSession(token: string, user?: AuthUser) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  if (user) {
    window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  }
  window.dispatchEvent(new Event("hackradar-auth-updated"));
}

export function clearStoredAuthSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  window.dispatchEvent(new Event("hackradar-auth-updated"));
}

export function getAuthUserDisplayName(user = getStoredAuthUser()) {
  if (!user) return "";

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return user.profile?.name || fullName || user.username || user.email || "";
}

async function request<T>(path: string, options: RequestInit = {}) {
  const token = getStoredAuthToken();
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData) && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
  });
  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok) {
    throw new Error(body?.message || "Request failed");
  }

  return body?.data as T;
}

export async function register(payload: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
}) {
  const data = await request<{ user: AuthUser; token: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setStoredAuthSession(data.token, data.user);
  return data;
}

export async function login(payload: { email: string; password: string }) {
  const data = await request<{ user: AuthUser; token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setStoredAuthSession(data.token, data.user);
  return data;
}

export async function fetchCurrentUser(token = getStoredAuthToken()) {
  if (!token) return null;

  const data = await request<{ user: AuthUser }>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(() => null);

  if (!data?.user) {
    clearStoredAuthSession();
    return null;
  }

  setStoredAuthSession(token, data.user);
  return data.user;
}

export async function logout() {
  await request<null>("/auth/logout", { method: "POST" }).catch(() => null);
  clearStoredAuthSession();
}

export function listHackathons() {
  return request<{ hackathons: Hackathon[] }>("/hackathons").then((data) => data.hackathons);
}

export function getProfile() {
  return request<{ profile: UserProfile; telegram: { connected: boolean; verified: boolean } }>("/user/profile");
}

export function updateProfile(profile: Partial<UserProfile>) {
  return request<{ profile: UserProfile }>("/user/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  });
}

export function requestTelegramVerificationCode() {
  return request<{ code: string; expires: string }>("/user/telegram/request-code", {
    method: "POST",
  });
}

export function listBookmarks() {
  return request<{ bookmarks: Bookmark[] }>("/bookmarks").then((data) => data.bookmarks);
}

export function createBookmark(hackathonId: string) {
  return request<{ bookmark: Bookmark }>("/bookmarks", {
    method: "POST",
    body: JSON.stringify({ hackathonId }),
  });
}

export function deleteBookmark(bookmarkId: string) {
  return request<null>(`/bookmarks/${bookmarkId}`, {
    method: "DELETE",
  });
}

// ================= ALERT API =================

export function listAlerts() {
  return request<unknown>("/alerts").then((data) => {
    if (data == null) return [];

    const alerts = Array.isArray(data)
      ? data
      : typeof data === "object" && Array.isArray((data as { alerts?: unknown }).alerts)
        ? (data as { alerts: unknown[] }).alerts
        : null;

    if (!alerts || !alerts.every(isAlert)) {
      throw new Error("The alerts service returned an invalid response. Please try again.");
    }

    return alerts;
  });
}

export function createAlert(payload: {
  hackathonId: string;
  title: string;
  channels: string[];
  frequency?: string;
  settings?: Record<string, unknown>;
}) {
  return request<unknown>("/alerts", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((data) => {
    const alert = isAlert(data)
      ? data
      : data && typeof data === "object"
        ? (data as { alert?: unknown }).alert
        : null;

    if (!isAlert(alert)) {
      throw new Error("The alert was saved, but the server returned an invalid response.");
    }

    return alert;
  });
}

export function updateAlert(
  alertId: string,
  payload: Partial<{
    title: string;
    channels: string[];
    frequency: string;
    enabled: boolean;
    settings: Record<string, unknown>;
  }>
) {
  return request<{ alert: Alert }>(`/alerts/${alertId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }).then((data) => data.alert);
}

export function deleteAlert(alertId: string) {
  return request<{ success: boolean }>(`/alerts/${alertId}`, {
    method: "DELETE",
  });
}
