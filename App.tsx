import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import { User } from './types';
import { AnalyticsService } from './services/analytics';
import { DB } from './services/db';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AnalyticsService.initialize();

    // Firebase Real-time Auth Listener
    // This replaces manual localStorage session management
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const dbUser = await DB.getCurrentUser(firebaseUser.uid);
          setUser(dbUser);
        } catch (e) {
          console.error("Error fetching user profile", e);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
    AnalyticsService.trackPageView('/' + page);
  };

  const handleLogin = (user: User) => {
    // With onAuthStateChanged, we just need to update local state immediately for UX
    // The listener will double confirm it shortly after
    setUser(user);
    if (user.role === 'ADMIN') {
      handleNavigate('admin');
    } else {
      handleNavigate('dashboard');
    }
  };

  const handleLogout = async () => {
    await DB.logout();
    handleNavigate('home');
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      const freshUser = await DB.getCurrentUser(auth.currentUser.uid);
      if (freshUser) {
        setUser(freshUser);
      }
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      
      <main>
        {currentPage === 'home' && <Home user={user} onNavigate={handleNavigate} />}
        {currentPage === 'login' && <Login onLogin={handleLogin} onNavigate={handleNavigate} />}
        {currentPage === 'signup' && <Signup onLogin={handleLogin} onNavigate={handleNavigate} />}
        
        {currentPage === 'dashboard' && (
          user ? <Dashboard user={user} refreshUser={refreshUser} /> : <Login onLogin={handleLogin} onNavigate={handleNavigate} />
        )}
        
        {currentPage === 'admin' && (
          user ? <Admin currentUser={user} /> : <Login onLogin={handleLogin} onNavigate={handleNavigate} />
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-white text-lg font-bold mb-4">ProSuite</h3>
              <p className="max-w-xs text-sm">
                Empowering creators with premium tools at affordable prices.
                Join the revolution today.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white cursor-pointer" onClick={() => handleNavigate('home')}>Canva Pro Access</li>
                <li className="hover:text-white cursor-pointer">Pricing</li>
                <li className="hover:text-white cursor-pointer">Future Courses</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white cursor-pointer">Terms of Service</li>
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer">Refund Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs">
            &copy; {new Date().getFullYear()} ProSuite. All rights reserved. Not affiliated with Canva.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;