import React, { useState } from 'react';
import { User, SubscriptionStatus } from '../types';
import { DB } from '../services/db';
import { AnalyticsService } from '../services/analytics';
import { Clock, CheckCircle, Lock, ExternalLink, AlertTriangle, Crown } from 'lucide-react';

interface DashboardProps {
  user: User;
  refreshUser: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, refreshUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper to ensure Razorpay script is loaded
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuy = async () => {
    setLoading(true);
    setError('');
    AnalyticsService.trackInitiateCheckout();

    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      setError('Razorpay SDK failed to load. Please check your internet connection.');
      setLoading(false);
      return;
    }

    // Razorpay Options
    // Note: We use the Key ID provided. The Secret Key is NOT used here for security.
    const options = {
      key: "rzp_live_Roo7y86CBx7mao", // LIVE Key ID
      amount: 7900, // Amount in paise (79.00 INR)
      currency: "INR",
      name: "ProSuite",
      description: "Lifetime Canva Pro Access",
      image: "https://ui-avatars.com/api/?name=Pro+Suite&background=0ea5e9&color=fff",
      
      // In a real backend architecture, you would call your API here to generate an order_id
      // const orderData = await fetch('/api/create-order').then(t => t.json());
      // order_id: orderData.id, 

      handler: async function (response: any) {
        // Success Callback
        try {
          // In a real app, you would send response.razorpay_payment_id and response.razorpay_signature 
          // to your backend for verification using the Secret Key.
          // For this demo, we trust the client-side success callback.
          
          await DB.completePurchase(user.id, response.razorpay_payment_id);
          AnalyticsService.trackPurchase(response.razorpay_payment_id, 79);
          refreshUser();
          alert('Payment Successful! You now have Pro access.');
        } catch (err: any) {
          setError('Activation failed: ' + err.message);
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone
      },
      notes: {
        address: "ProSuite Digital Services"
      },
      theme: {
        color: "#0ea5e9"
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
        }
      }
    };

    try {
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response: any){
          setError(response.error.description || "Payment failed");
          setLoading(false);
      });
      paymentObject.open();
    } catch (err: any) {
      setError("Could not initiate payment: " + err.message);
      setLoading(false);
    }
  };

  const handleStartTrial = async () => {
    setLoading(true);
    setError('');
    try {
      await DB.startTrial(user.id);
      AnalyticsService.trackTrialStart(user.id);
      refreshUser();
      
      // Automatically attempt to open the link after trial start
      await activateCanvaAccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const activateCanvaAccess = async () => {
    setLoading(true);
    setError('');
    try {
      // Securely fetch the link from "Backend"
      const link = await DB.getAccessLink(user.id);
      // Open in new tab
      window.open(link, '_blank');
    } catch (err: any) {
      setError(err.message || "Failed to retrieve access link");
    } finally {
      setLoading(false);
    }
  };

  const isPro = user.subscriptionStatus === SubscriptionStatus.PRO_ACTIVE;
  const isTrialActive = user.subscriptionStatus === SubscriptionStatus.TRIAL_ACTIVE;
  const isTrialExpired = user.subscriptionStatus === SubscriptionStatus.TRIAL_EXPIRED;
  const hasUsedTrial = user.trialStartedAt !== undefined;

  return (
    <div className="pt-24 min-h-screen bg-slate-50 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.name}</h1>
          <p className="text-slate-500 mt-2">Manage your subscription and access your tools.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Profile Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">My Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block">Login Email</label>
                  <p className="text-slate-900 font-medium truncate">{user.email}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block">Canva Email</label>
                  <p className="text-slate-900 font-medium truncate">{user.canvaEmail}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block">Phone</label>
                  <p className="text-slate-900 font-medium">{user.phone}</p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPro ? 'bg-green-100 text-green-800' : isTrialActive ? 'bg-brand-100 text-brand-800' : 'bg-slate-100 text-slate-800'}`}>
                    Status: {user.subscriptionStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="md:col-span-2 space-y-6">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center text-sm">
                <AlertTriangle size={16} className="mr-2" />
                {error}
              </div>
            )}

            {/* Pro Access Card (If Purchased or Trial Active) */}
            {(isPro || isTrialActive) && (
              <div className="bg-gradient-to-r from-brand-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Crown size={120} />
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">Canva Pro Access</h2>
                  <p className="text-slate-300 mb-6 max-w-md">
                    {isPro 
                      ? "You have lifetime access. Click below to join the team or access your dashboard." 
                      : `Your trial is active. Expires in ${Math.ceil((user.trialExpiresAt! - Date.now()) / (1000 * 60 * 60))} hours.`}
                  </p>
                  <button 
                    onClick={activateCanvaAccess}
                    disabled={loading}
                    className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-brand-50 transition-colors inline-flex items-center disabled:opacity-70"
                  >
                    {loading ? 'Accessing...' : (
                      <>Activate / Access Pro <ExternalLink size={16} className="ml-2" /></>
                    )}
                  </button>
                  <p className="text-xs text-slate-400 mt-4">
                    Note: Clicking this will secure redirect you to the Canva team invite.
                  </p>
                </div>
              </div>
            )}

            {/* Trial Offer (If eligible) */}
            {!isPro && !hasUsedTrial && (
              <div className="bg-white border border-brand-200 rounded-2xl p-6 shadow-sm relative">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center">
                      <Clock className="text-brand-500 mr-2" size={20} />
                      1-Day Free Trial
                    </h3>
                    <p className="text-slate-500 mt-2 text-sm">
                      Experience the full power of Canva Pro for 24 hours. No credit card required.
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <button 
                    onClick={handleStartTrial}
                    disabled={loading}
                    className="w-full sm:w-auto bg-white border-2 border-brand-500 text-brand-600 px-6 py-2 rounded-lg font-semibold hover:bg-brand-50 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Start Free Trial'}
                  </button>
                </div>
              </div>
            )}

            {/* Purchase Offer (If not Pro) */}
            {!isPro && (
              <div className={`bg-white border rounded-2xl p-6 shadow-sm ${isTrialExpired ? 'border-orange-200 bg-orange-50/30' : 'border-slate-100'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center">
                      <Lock className="text-brand-purple mr-2" size={20} />
                      Lifetime Pro Access
                    </h3>
                    <p className="text-slate-500 mt-2 text-sm max-w-md">
                      {isTrialExpired 
                        ? "Your trial has ended. Upgrade now to regain access forever." 
                        : "Skip the trial and secure your lifetime access for just ₹79."}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button 
                      onClick={handleBuy}
                      disabled={loading}
                      className="w-full md:w-auto bg-gradient-to-r from-brand-teal to-brand-purple text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 shadow-lg shadow-brand-purple/20 disabled:opacity-50 transition-all"
                    >
                      {loading ? 'Initializing...' : 'Buy Now @ ₹79'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Future Courses Placeholder */}
            <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-75">
              <div className="p-3 bg-slate-200 rounded-full mb-3">
                <CheckCircle className="text-slate-400" size={24} />
              </div>
              <h3 className="font-semibold text-slate-600">Canva Masterclass</h3>
              <p className="text-sm text-slate-400 mt-1">Video course coming soon to your dashboard.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;