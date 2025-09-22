
"use client";

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
          Trang quản trị
        </h1>
        {children}
      </div>
    </div>
  );
}
