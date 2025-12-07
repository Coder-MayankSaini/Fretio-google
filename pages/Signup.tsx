import React, { useState } from 'react';
import { DB } from '../services/db';
import { User } from '../types';

interface SignupProps {
  onLogin: (user: User) => void;
  onNavigate: (page: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onLogin, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    canvaEmail: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogleSignup = () => {
    // In a real app, this would use the Google Auth SDK/Firebase
    alert("In a production environment, this would initiate the Google OAuth flow.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.email.includes('@') || !formData.canvaEmail.includes('@')) {
      setError('Please provide valid email addresses.');
      setLoading(false);
      return;
    }

    try {
      const user = await DB.signup(formData);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 bg-slate-50 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
          <p className="text-slate-500 mt-2">Get started with your free trial today</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleSignup}
          type="button" 
          className="w-full bg-white border border-slate-300 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center mb-6"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-3" alt="Google" />
          Sign up with Google
        </button>

        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-slate-500">Or continue with email</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Login Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your primary email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Canva Email</label>
            <input
              name="canvaEmail"
              type="email"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.canvaEmail}
              onChange={handleChange}
              placeholder="Email used for Canva account"
            />
            <p className="text-xs text-slate-400 mt-1">We need this to invite you to the team.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input
              name="phone"
              type="tel"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-teal to-brand-purple text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70 mt-4 shadow-md"
          >
            {loading ? 'Creating Account...' : 'Sign Up & Start'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-slate-500">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="text-brand-600 font-semibold hover:text-brand-700">
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;