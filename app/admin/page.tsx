'use client';

import { useState } from 'react';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Authentication failed');
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                required
              />
            </div>
            {error && (
              <div className="mb-4 text-sm text-red-600">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-500 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">ShuAI Admin Panel</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminCard
            title="Edit Hero Content"
            description="Update homepage hero copy and CTAs"
            href="/admin/hero"
          />
          <AdminCard
            title="Edit Metrics"
            description="Update proof module metrics"
            href="/admin/metrics"
          />
          <AdminCard
            title="Chat Settings"
            description="Configure chat behavior and prompts"
            href="/admin/chat"
          />
          <AdminCard
            title="View Leads"
            description="Browse and export lead data"
            href="/admin/leads"
          />
          <AdminCard
            title="Reindex Embeddings"
            description="Trigger site content reindexing"
            href="/admin/reindex"
          />
        </div>
      </div>
    </div>
  );
}

function AdminCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <a
      href={href}
      className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  );
}
