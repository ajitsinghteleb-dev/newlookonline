"use client";
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, isAdmin, isUserLoading } = useAuth();

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return (
        <div className="container mx-auto p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="mt-4">You do not have permission to view this page.</p>
            <Link href="/login" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded">
                Login as Admin
            </Link>
        </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold dark:text-white mb-6">Admin Dashboard</h1>
      <p className="mb-4">Welcome, {user?.email || 'Admin'}.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/ads" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700 hover:shadow-xl transition">
            <h2 className="font-bold text-xl">Manage Ads</h2>
            <p className="text-sm text-gray-500 mt-2">Approve or reject pending advertisement requests.</p>
        </Link>
        {/* Add more admin panels here */}
      </div>
    </div>
  );
}
