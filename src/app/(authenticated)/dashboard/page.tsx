'use client';

import { useAuth } from '@/lib/auth/provider';

export default function Dashboard() {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <div>No user found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Page 1</h1>
      <p>Welcome, {currentUser.email}</p>
    </div>
  );
}