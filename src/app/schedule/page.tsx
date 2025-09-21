"use client";
import { useRouter } from "next/navigation";

export default function Schedule() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">근무 관리 페이지</h1>

      <div className="flex flex-col gap-4">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => router.push("/schedule/employee")}
        >
          직원 관리
        </button>
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => router.push("/schedule/dayoffs")}
        >
          휴무 관리
        </button>
      </div>
    </div>
  );
}
