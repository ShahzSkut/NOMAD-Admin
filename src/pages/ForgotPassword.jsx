import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../api/supabaseClient";
import { Mail, ArrowLeft } from "lucide-react";
import authBg from "../assets/Auth_Background.jpg";
import nomadLogo from "../assets/Nomad_Logo_tp.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Redirects to /update-password after clicking the email link.
      // Ensure you have a route for /update-password to handle the new password input.
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setMessage("Check your email for the password reset link.");
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
          <Link
            to="/login"
            className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">
            Enter your email address and we'll send you a link to reset your password.
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

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-accent-green outline-none transition-all"
                required
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-primary-blue text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? "Sending..." : <> <Mail className="w-5 h-5" /> Send Reset Link </>}
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
