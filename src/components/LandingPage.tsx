import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { loginWithGoogle } from "../auth";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    } else {
      navigate("/app");
    }
  };

  const handleRegister = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      navigate("/app");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await loginWithGoogle();

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#272523] text-[#280606] font-baloo">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#ddd]">
        <h1 className="text-4xl font-bold mb-6 text-center text-[#280606]">
          Welcome to GuitarMap
        </h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-md ">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 rounded border border-[#280606] bg-white text-[#280606] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#280606]"
              placeholder=""
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-md">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 rounded border border-[#280606] bg-white text-[#280606] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#280606]"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={handleLogin}
              className="flex-1 bg-[#280606] hover:bg-[#3a0a0a] text-white py-2 rounded transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={handleRegister}
              className="flex-1 bg-[#280606] hover:bg-[#3a0a0a] text-white py-2 rounded transition-colors cursor-pointer"
            >
              Register
            </button>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-[#d1d1d1] hover:bg-gray-100 text-black py-2 rounded transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path
                fill="#4285F4"
                d="M24 9.5c3.35 0 5.92 1.45 7.27 2.66l5.37-5.37C32.98 3.98 28.76 2 24 2 14.97 2 7.36 7.85 4.59 15.24l6.97 5.41C13 13.41 18.03 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M24 44c5.9 0 10.84-1.95 14.45-5.3l-6.76-5.53C29.47 34.84 27.03 36 24 36c-5.92 0-10.94-3.97-12.75-9.35L4.24 31.48C7.04 39.01 14.87 44 24 44z"
              />
              <path
                fill="#FBBC05"
                d="M11.25 26.65A13.499 13.499 0 0 1 11 24c0-.91.08-1.79.23-2.65l-6.97-5.41A21.96 21.96 0 0 0 2 24c0 3.53.83 6.88 2.24 9.88l7.01-5.38z"
              />
              <path
                fill="#EA4335"
                d="M43.6 20.51H24v7.48h11.3c-1.17 3.22-3.44 5.64-6.49 6.91l6.76 5.53c3.97-3.65 6.43-9.03 6.43-15.42 0-1.13-.1-2.23-.3-3.29z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
