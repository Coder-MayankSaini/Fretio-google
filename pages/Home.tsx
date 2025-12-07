import React, { useState } from 'react';
import { Check, Star, Zap, Shield, Crown, ChevronDown, ChevronUp } from 'lucide-react';
import { User } from '../types';

interface HomeProps {
  user: User | null;
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ user, onNavigate }) => {

  const handleCtaClick = (type: 'trial' | 'buy') => {
    if (!user) {
      onNavigate('signup');
    } else {
      onNavigate('dashboard');
    }
  };

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "Is this really a one-time payment?", a: "Yes! You pay ₹79 once and get joined to our Pro team with lifetime access. No monthly fees." },
    { q: "Do I need to change my email?", a: "No. We invite your existing Canva email to our team. You keep your own account, designs, and folders." },
    { q: "What happens if the trial expires?", a: "You lose access to Pro features (like background remover) until you purchase the lifetime license. Your designs remain safe." },
    { q: "Is my data safe?", a: "Absolutely. We only use your email to send the invite via the official Canva system. We do not access your account." }
  ];

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?blur=10')] opacity-5 bg-center bg-cover"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-sm font-medium mb-8 animate-fade-in-up">
              <Star size={14} className="mr-2 fill-brand-purple" />
              Over 10,000+ happy designers
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              Unlock Your Creative Potential <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-brand-500 to-brand-purple">
                Without Breaking the Bank
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500 mb-10">
              Get lifetime access to premium design tools. Join thousands of creators who save money while accessing professional features.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => handleCtaClick('buy')}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-slate-900 hover:bg-slate-800 md:text-lg transition-transform hover:scale-105 shadow-xl shadow-brand-purple/20"
              >
                Get Pro Access for ₹79
              </button>
              <button 
                onClick={() => handleCtaClick('trial')}
                className="inline-flex items-center justify-center px-8 py-4 border border-slate-200 text-base font-medium rounded-full text-slate-700 bg-white hover:bg-slate-50 md:text-lg transition-colors"
              >
                Try 1-Day Free Trial
              </button>
            </div>
            
            <p className="mt-4 text-xs text-slate-400">
              *One-time payment. No hidden monthly fees.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need</h2>
            <p className="text-slate-500 mt-2">Professional tools at a fraction of the cost</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 mb-6">
                <Crown size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lifetime Pro Access</h3>
              <p className="text-slate-500">
                Forget ₹899/month. Pay once and enjoy premium features forever through our exclusive team access.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-brand-purple mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Activation</h3>
              <p className="text-slate-500">
                Automated system grants you access immediately after purchase or trial activation. No waiting.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-brand-teal mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Private</h3>
              <p className="text-slate-500">
                Your data is safe with us. We only use your email to invite you to the premium workspace.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-brand-purple opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-brand-teal opacity-20 blur-3xl"></div>
            
            <div className="relative p-10 md:p-14 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Pro Subscription</h2>
              <div className="flex justify-center items-baseline mb-8">
                <span className="text-5xl font-extrabold text-white">₹79</span>
                <span className="text-slate-400 ml-2 text-xl line-through">₹899</span>
                <span className="ml-2 text-brand-teal text-sm font-semibold uppercase bg-brand-teal/10 px-2 py-1 rounded">91% OFF</span>
              </div>
              
              <ul className="text-left space-y-4 mb-10 max-w-md mx-auto">
                <li className="flex items-center text-slate-300">
                  <Check className="text-brand-teal mr-3" size={20} />
                  <span>Unlimited Premium Templates</span>
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="text-brand-teal mr-3" size={20} />
                  <span>Magic Resize & Background Remover</span>
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="text-brand-teal mr-3" size={20} />
                  <span>100GB Cloud Storage</span>
                </li>
                <li className="flex items-center text-slate-300">
                  <Check className="text-brand-teal mr-3" size={20} />
                  <span>Premium Fonts & Stock Photos</span>
                </li>
                <li className="flex items-center text-brand-purple font-semibold">
                  <Star className="mr-3 fill-brand-purple" size={20} />
                  <span>Coming Soon: Canva Masterclass</span>
                </li>
              </ul>

              <button 
                onClick={() => handleCtaClick('buy')}
                className="w-full bg-gradient-to-r from-brand-teal to-brand-purple text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                Get Started Now
              </button>
              
              <p className="mt-4 text-slate-500 text-sm">
                100% Secure Payment via Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button 
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-slate-900">{faq.q}</span>
                  {openFaq === index ? <ChevronUp className="text-brand-500" size={20} /> : <ChevronDown className="text-slate-400" size={20} />}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-slate-600 animate-fade-in-down">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;