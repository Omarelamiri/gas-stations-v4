'use client';

import { useAuth } from '@/lib/auth/provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return currentUser ? <AuthenticatedLayout>{children}</AuthenticatedLayout> : null;
}