import React, { useState } from 'react';
import { DB } from '../services/db';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigate: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await DB.login(email, password);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // In a real app, this would use the Google Auth SDK/Firebase
    alert("In a production environment, this would initiate the Google OAuth flow.");
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Access your pro tools dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          type="button" 
          className="w-full bg-white border border-slate-300 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center mb-6"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-3" alt="Google" />
          Continue with Google
        </button>

        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-slate-500">Or continue with email</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-slate-500">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('signup')} className="text-brand-600 font-semibold hover:text-brand-700">
              Sign up
            </button>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-center text-slate-400">
          <p>Demo Admin: admin@prosuite.com / admin</p>
        </div>
      </div>
    </div>
  );
};

export default Login;