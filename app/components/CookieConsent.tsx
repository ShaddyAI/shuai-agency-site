'use client';

import { useState, useEffect } from 'react';

interface CookiePreferences {
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    analytics: false,
    marketing: false,
    personalization: false,
  });
  
  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPrefs = JSON.parse(consent);
      setPreferences(savedPrefs);
      applyCookiePreferences(savedPrefs);
    }
  }, []);
  
  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Enable/disable analytics
    if (prefs.analytics && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
    
    // Store preferences globally for chat/voice features
    (window as any).cookiePreferences = prefs;
  };
  
  const acceptAll = () => {
    const allAccepted = {
      analytics: true,
      marketing: true,
      personalization: true,
    };
    savePreferences(allAccepted);
  };
  
  const acceptNecessary = () => {
    const necessaryOnly = {
      analytics: false,
      marketing: false,
      personalization: false,
    };
    savePreferences(necessaryOnly);
  };
  
  const saveCustomPreferences = () => {
    savePreferences(preferences);
    setShowSettings(false);
  };
  
  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    setPreferences(prefs);
    applyCookiePreferences(prefs);
    setShowBanner(false);
  };
  
  if (!showBanner) return null;
  
  return (
    <>
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">We value your privacy</h3>
              <p className="text-sm text-gray-600">
                We use cookies to enhance your browsing experience, provide personalized content, 
                and analyze our traffic. You can choose which cookies to accept.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Customize
              </button>
              <button
                onClick={acceptNecessary}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Necessary Only
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Cookie Preferences</h2>
            
            <div className="space-y-4 mb-6">
              {/* Necessary */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Necessary Cookies</h3>
                  <span className="text-sm text-gray-500">Always Active</span>
                </div>
                <p className="text-sm text-gray-600">
                  These cookies are essential for the website to function properly. 
                  They cannot be disabled.
                </p>
              </div>
              
              {/* Analytics */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Analytics Cookies</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously.
                </p>
              </div>
              
              {/* Marketing */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Marketing Cookies</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Used to track visitors across websites to display relevant advertisements.
                </p>
              </div>
              
              {/* Personalization */}
              <div className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Personalization Cookies</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.personalization}
                      onChange={(e) => setPreferences({ ...preferences, personalization: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Enable personalized features like chat history and voice preferences. 
                  Required for AI chat and voice features.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCustomPreferences}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
