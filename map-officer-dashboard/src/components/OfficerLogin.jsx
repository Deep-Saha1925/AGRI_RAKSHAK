import { useState } from "react";
import { getMe, login } from "../api/mockApi";

// Contract: POST /auth/login/ { phone, password } -> { access, refresh, role }
// then GET /auth/me/ -> { id, name, role, language, phone }
export default function OfficerLogin({ onLoginSuccess }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { access, role } = await login(phone.trim(), password);
      const me = await getMe(access);
      localStorage.setItem("agri_rakshak_token", access);
      onLoginSuccess({ ...me, role, token: access });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-agri-beige-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-agri-beige-300 p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-agri-green-600 flex items-center justify-center text-2xl mb-3">
            🌾
          </div>
          <h1 className="text-2xl font-bold text-agri-green-800">Agri Rakshak</h1>
          <p className="text-sm text-agri-green-600">Officer Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-agri-green-800 mb-1">
              Phone number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98765 00001"
              autoFocus
              className="w-full rounded-lg border border-agri-beige-400 bg-agri-beige-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-agri-green-800 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-agri-beige-400 bg-agri-beige-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green-400"
            />
          </div>

          {error && <p className="text-sm text-agri-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-agri-green-600 hover:bg-agri-green-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

      </div>
    </div>
  );
}
