// This service handles the abstraction for Analytics
// In a real implementation, you would replace the console logs with actual dataLayer pushes

export const AnalyticsService = {
  initialize: () => {
    // This is where you would initialize GTM and Pixel if not done in HTML
    // console.log('Analytics Initialized');
    window.dataLayer = window.dataLayer || [];
  },

  trackPageView: (path: string) => {
    // GTM
    window.dataLayer.push({
      event: 'page_view',
      page_path: path
    });
    
    // FB Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  },

  trackInitiateCheckout: () => {
    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        currency: 'INR',
        value: 79.00
      }
    });

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout');
    }
  },

  trackPurchase: (transactionId: string, value: number) => {
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: {
        transaction_id: transactionId,
        value: value,
        currency: 'INR'
      }
    });

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Purchase', {
        value: value,
        currency: 'INR'
      });
    }
  },

  trackTrialStart: (userId: string) => {
    window.dataLayer.push({
      event: 'trial_start',
      user_id: userId
    });
  }
};