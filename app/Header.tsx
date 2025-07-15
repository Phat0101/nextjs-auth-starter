"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md py-4 px-8">
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          DTAL Audit
        </Link>
        <div className="flex items-center space-x-4">
          <Link 
            href="/jobs" 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Jobs
          </Link>
          <Link 
            href="/jobs/new" 
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            New Job
          </Link>
        </div>
      </nav>
    </header>
  );
}
