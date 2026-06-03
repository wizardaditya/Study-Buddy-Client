export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  PRICING: "/pricing",
  DASHBOARD: "/dashboard",
  FEED: "/feed",
  DOUBTS: "/doubts",
  DOUBTS_NEW: "/doubts/new",
  DOUBTS_DETAIL: (id) => `/doubts/${id}`,
  PROJECTS: "/projects",
  PROJECTS_NEW: "/projects/new",
  PROJECT_DETAIL: (id) => `/projects/${id}`,
  MENTORS: "/mentors",
  MENTOR_PROFILE: (username) => `/mentors/${username}`,
  STUDY_ROOMS: "/study-rooms",
  STUDY_ROOM: (roomId) => `/study-rooms/${roomId}`,
  MOCK_TESTS: "/mock-tests",
  MOCK_TEST: (testId) => `/mock-tests/${testId}`,
  TEST_RESULTS: (id) => `/mock-tests/results/${id}`,
  LEADERBOARD: "/leaderboard",
  HIRING: "/hiring",
  AURA: "/aura",
  PROFILE: (username) => `/profile/${username}`,
  CONNECTIONS: "/connections",
  SETTINGS: "/settings",
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_MENTORS: "/admin/mentors",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_ANALYTICS: "/admin/analytics",
};

export const USER_ROLES = { STUDENT: "student", MENTOR: "mentor", ADMIN: "admin" };

export const XP_PER_ACTION = {
  POST: 10, DOUBT: 15, ANSWER: 20,
  ANSWER_ACCEPTED: 50, TEST_COMPLETED: 25,
  DAILY_LOGIN: 5, STREAK_BONUS: 10,
};

export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000];

export function getLevelFromXP(xp) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}
