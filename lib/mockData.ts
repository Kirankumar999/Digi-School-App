/**
 * Mock data layer for offline / VPN-restricted development.
 * Activated when env var MOCK_DB=true.
 *
 * Provides a hardcoded admin user so the dashboard renders without
 * touching MongoDB. All `connectDB()` calls become no-ops in this mode.
 */

export const MOCK_MODE = process.env.MOCK_DB === "true";

export const MOCK_USER = {
  _id: "mock-user-001",
  id: "mock-user-001",
  name: "Sarah Mitchell",
  email: "sarah@edupulse.io",
  role: "admin",
  profilePicture: "",
  phone: "+1 (555) 010-3214",
  bio: "Principal of Westlake Academy",
};

export const MOCK_TOKEN_USER_ID = MOCK_USER._id;
