import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../api/supabaseClient";
import { Chrome, Pencil } from "lucide-react";
import authBg from "../assets/Auth_Background.jpg";
import nomadLogo from "../assets/Nomad_Logo_tp.png";
import { AuthError } from "@supabase/supabase-js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error){
        alert(error.message);
        setLoading(false);
        return;
    }

    const { data: userData, error: userError } = await supabase.from("USERS").select("role").eq("auth_uuid", authData.user.id).single();

    if (userError || userData?.role !== "admin") {
        await supabase.auth.signOut();
        alert("Access denied. Admins only.");
    } else {
        navigate("/admin/overview");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left Side: Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full">
          <p className="text-gray-500 font-medium text-lg mb-1">
            Welcome to Nomad
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Back on the road
          </h1>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">
            Plan Less, Travel Smarter — Let Nomad Guide Your Journey
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
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
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-accent-green outline-none transition-all"
                required
              />
              <div className="flex justify-end items-center mb-1 p-3">
                <Link to="/forgot-password" className="text-xs font-bold text-primary-blue">
                  Forgot Password?
                </Link>
              </div>
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-primary-blue text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                "Signing In..."
              ) : (
                <>
                  <Pencil className="w-5 h-5" />
                  Sign In{" "}
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-gray-500 font-medium">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary-blue font-extrabold hover:underline ml-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Image with Logo */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={authBg}
          className="absolute inset-0 w-full h-full object-cover"
          alt="travel background"
        />
        {/* Half Opacity Overlay */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <div className="p-4">
            <img src={nomadLogo} alt="Nomad Logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
