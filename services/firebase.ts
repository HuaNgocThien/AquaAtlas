const API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const BASE_URL = "https://identitytoolkit.googleapis.com/v1/accounts";

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  idToken: string;
  refreshToken: string;
}

export interface AuthError {
  code: string;
  message: string;
}

// ─── Sign Up ──────────────────────────────────────────────────────────────────
export async function signUp(
  email: string,
  password: string,
): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}:signUp?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });

  const data = await res.json();
  if (!res.ok) throw parseError(data.error);

  return {
    uid: data.localId,
    email: data.email,
    idToken: data.idToken,
    refreshToken: data.refreshToken,
  };
}

// ─── Sign In ──────────────────────────────────────────────────────────────────
export async function signIn(
  email: string,
  password: string,
): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}:signInWithPassword?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });

  const data = await res.json();
  if (!res.ok) throw parseError(data.error);

  return {
    uid: data.localId,
    email: data.email,
    displayName: data.displayName,
    idToken: data.idToken,
    refreshToken: data.refreshToken,
  };
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {}

// ─── Update Profile ───────────────────────────────────────────────────────────
export async function updateProfile(
  idToken: string,
  displayName: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}:update?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, displayName, returnSecureToken: false }),
  });

  const data = await res.json();
  if (!res.ok) throw parseError(data.error);
}

// ─── Error parser ─────────────────────────────────────────────────────────────
function parseError(error: { message: string }): AuthError {
  const map: Record<string, string> = {
    EMAIL_EXISTS: "Email đã được sử dụng",
    INVALID_EMAIL: "Email không hợp lệ",
    WEAK_PASSWORD: "Mật khẩu quá yếu (tối thiểu 6 ký tự)",
    EMAIL_NOT_FOUND: "Email không tồn tại",
    INVALID_PASSWORD: "Mật khẩu không đúng",
    INVALID_LOGIN_CREDENTIALS: "Email hoặc mật khẩu không đúng",
    TOO_MANY_ATTEMPTS_TRY_LATER: "Quá nhiều lần thử, vui lòng thử lại sau",
  };

  const message = map[error.message] ?? "Đã có lỗi xảy ra, thử lại sau";
  return { code: error.message, message };
}
