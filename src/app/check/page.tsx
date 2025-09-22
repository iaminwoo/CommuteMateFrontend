"use client";
import { EmployeeSchedule } from "@/types/employee";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Check() {
  const router = useRouter();
  const [employeeSchedule, setEmployeeSchedule] = useState<EmployeeSchedule>();
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    const fetchTodaySchedule = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const res = await fetch(`${API_BASE}/employees/schedules/${today}`);

        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);

        const data = await res.json();
        setEmployeeSchedule(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodaySchedule();
  }, [API_BASE]);

  return (
    <div className="flex flex-col gap-4 items-center min-h-screen p-4">
      <h1 className="mt-2 px-4 py-1 bg-[#5E734F] text-white text-xl font-semibold rounded-xl">
        오늘의 근무
      </h1>

      {loading && <p>로딩 중...</p>}

      {!loading && employeeSchedule && (
        <div className="w-75">
          <p className="text-center font-semibold text-lg">
            {employeeSchedule.date} 오늘의 근무 인원
          </p>
          <div className="text-gray-700 border p-4 w-full max-w-md bg-[#EAF5D4] rounded">
            {employeeSchedule.total === 0 ? (
              <p>오늘 근무하는 직원이 없습니다.</p>
            ) : (
              <div>
                <div className="flex justify-between border-b mb-2">
                  <p className="px-3">
                    <span className="font-bold">총 인원 : </span>
                    {employeeSchedule.total} 명
                  </p>

                  {employeeSchedule.next_dayoff != "휴일" && (
                    <p className="px-3">
                      <span className="font-bold">파트너 : </span>
                      {employeeSchedule.partner}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {employeeSchedule.employee_part.map((part) => (
                    <div
                      key={part.part_name}
                      className="border border-gray-300 bg-white rounded-lg px-3 py-1"
                    >
                      <h3 className="font-bold text-base">{part.part_name}</h3>

                      <ul className="grid grid-cols-3 gap-2 list-none text-center">
                        {part.employees.map((n) => {
                          let className = "p-1 text-center rounded";
                          if (n === "유루디아")
                            className += " font-bold text-orange-500";
                          else if (n === "김양현")
                            className += " font-bold text-green-500";

                          return (
                            <li key={n} className={className}>
                              {n}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-3 px-3 py-1 text-end">
                  <span className="font-bold">휴일까지 : </span>
                  {employeeSchedule.next_dayoff}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button
          className="px-6 py-3 bg-[#5E734F] text-white rounded-lg hover:bg-[#4B5C3F] transition"
          onClick={() => router.push("/check/search")}
        >
          근무 조회
        </button>
        <button
          className="px-6 py-3 bg-[#5E734F] text-white rounded-lg hover:bg-[#4B5C3F] transition"
          onClick={() => router.push("/check/intersection")}
        >
          근무 교집합
        </button>
        <button
          className="px-6 py-3 bg-[#5E734F] text-white rounded-lg hover:bg-[#4B5C3F] transition"
          onClick={() => router.push("/schedule/dayoffs")}
        >
          근무 관리
        </button>
      </div>
    </div>
  );
}
