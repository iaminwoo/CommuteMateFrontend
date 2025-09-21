"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 flex items-center justify-between z-50 shadow-md">
      <span className="font-bold text-lg">출근빵</span>
      <button
        className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
        onClick={() => router.push("/")}
      >
        메인으로
      </button>
    </nav>
  );
}
