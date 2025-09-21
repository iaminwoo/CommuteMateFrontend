"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Employee } from "@/types/employee";

export default function Employee() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE}/employees/`)
      .then((res) => res.json())
      .then((data) => setEmployees(data.employees))
      .catch((err) => console.error("직원 목록 불러오기 실패:", err));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">직원 관리 페이지</h1>

      <div className="flex gap-2">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => router.push("/schedule/employee/create")}
        >
          직원 추가
        </button>
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => router.push("/schedule/employee/order")}
        >
          순서 변경
        </button>
      </div>

      <div className="w-full max-w-md bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-4">직원 명단</h2>
        <ul>
          {employees.map((emp) => (
            <li
              key={emp.id}
              className="cursor-pointer p-2 border-b hover:bg-gray-100"
              onClick={() => router.push(`/schedule/employee/${emp.id}`)}
            >
              {emp.name}
            </li>
          ))}
          {employees.length === 0 && (
            <li className="text-gray-500">직원 정보가 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
