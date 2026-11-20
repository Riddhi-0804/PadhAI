/**
 * Shared API helper: attaches the bearer token to backend requests and reports
 * 401s so the app can clear the session and reopen the sign-in modal.
 */
export const TOKEN_STORAGE_KEY = 'padhai_auth_token';

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export interface ApiRequestOptions {
  /** Skip the global 401 handler (login/register use 401 for bad credentials). */
  skipAuthError?: boolean;
}

export async function apiFetch(
  input: string,
  init: RequestInit = {},
  options: ApiRequestOptions = {}
): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getStoredToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (init.body && typeof init.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(input, { ...init, headers });

  if (res.status === 401 && !options.skipAuthError) {
    unauthorizedHandler?.();
  }

  return res;
}
