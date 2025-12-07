import React, { useState } from 'react';
import { Menu, X, Crown, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <nav className="fixed w-full z-50 glass border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNav('home')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-teal to-brand-purple flex items-center justify-center text-white mr-2">
              <Crown size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">ProSuite</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => handleNav('home')} className={`text-sm font-medium transition-colors ${currentPage === 'home' ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'}`}>
              Home
            </button>
            
            {!user ? (
              <>
                <button onClick={() => handleNav('login')} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Log in
                </button>
                <button 
                  onClick={() => handleNav('signup')}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105"
                >
                  Sign up
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button onClick={() => handleNav('dashboard')} className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-brand-600">
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </button>
                {user.role === 'ADMIN' && (
                  <button onClick={() => handleNav('admin')} className="text-sm font-medium text-brand-purple hover:text-purple-700">
                    Admin
                  </button>
                )}
                <div className="h-6 w-px bg-slate-200"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                    <UserIcon size={16} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.name.split(' ')[0]}</span>
                </div>
                <button onClick={onLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass absolute w-full border-b border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button onClick={() => handleNav('home')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">
              Home
            </button>
            {!user ? (
              <>
                <button onClick={() => handleNav('login')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">
                  Log in
                </button>
                <button onClick={() => handleNav('signup')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-brand-600 hover:bg-slate-50">
                  Sign up
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleNav('dashboard')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">
                  Dashboard
                </button>
                {user.role === 'ADMIN' && (
                   <button onClick={() => handleNav('admin')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-brand-purple hover:bg-slate-50">
                   Admin Panel
                 </button>
                )}
                <button onClick={onLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50">
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;