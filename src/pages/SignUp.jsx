import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { Pencil } from 'lucide-react';
import authBg from '../assets/Auth_Background.jpg';
import nomadLogo from '../assets/Nomad_Logo_tp.png';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (formData.fullName.trim().length < 3) {
      alert('Full name must be at least 3 characters long.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { data: existingUser } = await supabase
        .from('USERS')
        .select('email')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingUser) throw new Error('Email already exists. Contact admin for approval.');

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('Email already exists. Contact admin for approval.');
        }
        throw error;
      }

      if (data.user) {
        const { error: dbError } = await supabase.from('USERS').insert([
          {
            auth_uuid: data.user.id,
            name: formData.fullName,
            email: formData.email,
            role: 'traveler',
          },
        ]);
        if (dbError) throw dbError;
      }

      alert('Successfully signed up! Please wait for admin approval.');
      window.location.reload();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left Side: Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full">
          <p className="text-gray-500 font-medium text-lg mb-1">
            Start your journey
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Became an Admin
          </h1>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">
            Join Nomad and start planning your next adventure today.
          </p>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-accent-green outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-accent-green outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-accent-green outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-blue text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? 'Signing Up...' : (
                <>
                  <Pencil className="w-5 h-5" />
                  Sign Up
                </>
              )}
            </button>

            <div className="mt-6 text-center text-sm font-medium text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-blue font-extrabold hover:underline ml-1">
                Log In
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side: Image with Logo */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={authBg}
          className="absolute inset-0 w-full h-full object-cover"
          alt="travel background"
        />
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