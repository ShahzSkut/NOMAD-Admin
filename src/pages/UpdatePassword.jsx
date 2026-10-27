import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/supabaseClient";
import { Lock } from "lucide-react";
import authBg from "../assets/Auth_Background.jpg";
import nomadLogo from "../assets/Nomad_Logo_tp.png";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verify session exists (handled by Supabase via URL hash)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setError("Invalid or expired reset link. Please try again.");
      }
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setMessage("Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left Side: Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Set New Password
          </h1>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">
            Please enter your new password below.
          </p>

          {message && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 text-sm font-medium">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-accent-green outline-none transition-all"
                required
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-primary-blue text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? "Updating..." : <> <Lock className="w-5 h-5" /> Update Password </>}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side: Image with Logo */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src={authBg} className="absolute inset-0 w-full h-full object-cover" alt="travel background" />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <div className="p-4"><img src={nomadLogo} alt="Nomad Logo" /></div>
        </div>
      </div>
    </div>
  );
}
