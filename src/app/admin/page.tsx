"use client";
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { user, isAdmin, isUserLoading } = useAuth();

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return (
        <div className="container mx-auto p-8 text-center">
            <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
            <p className="mt-4">You do not have permission to view this page.</p>
            <Button asChild className="mt-6">
                <Link href="/login">Login as Admin</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold dark:text-white mb-6">Admin Dashboard</h1>
      <p className="mb-4">Welcome, {user?.email || 'Admin'}.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/ads" className="bg-card p-6 rounded-lg shadow-md border dark:border-gray-700 hover:shadow-xl transition hover:border-primary">
            <h2 className="font-bold text-xl">Manage Ads</h2>
            <p className="text-sm text-muted-foreground mt-2">Approve or reject pending advertisement requests.</p>
        </Link>
        {/* Add more admin panels here */}
      </div>
    </div>
  );
}
