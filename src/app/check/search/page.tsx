"use client";
import { EmployeeSchedule } from "@/types/employee";
import { useEffect, useState } from "react";

export default function Search() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // YYYY-MM-DD
  const [employeeSchedule, setEmployeeSchedule] = useState<EmployeeSchedule>();
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    const fetchSchedule = async (date: string) => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/employees/schedules/${date}`);
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        const data = await res.json();
        setEmployeeSchedule(data);
      } catch (err) {
        console.error(err);
        setEmployeeSchedule(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule(selectedDate);
  }, [selectedDate, API_BASE]);

  return (
    <div className="flex flex-col gap-4 items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold">날짜별 근무 조회</h1>

      <div className="mt-4 flex items-center gap-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded border font-semibold hover:bg-gray-300"
          onClick={() => {
            const prev = new Date(selectedDate);
            prev.setDate(prev.getDate() - 1);
            setSelectedDate(prev.toISOString().split("T")[0]);
          }}
        >
          이전
        </button>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          className="px-4 py-2 bg-gray-200 rounded border font-semibold hover:bg-gray-300"
          onClick={() => {
            const next = new Date(selectedDate);
            next.setDate(next.getDate() + 1);
            setSelectedDate(next.toISOString().split("T")[0]);
          }}
        >
          다음
        </button>
      </div>

      {loading && <p>로딩 중...</p>}

      {!loading && employeeSchedule && (
        <div className="w-75">
          <div className="text-gray-700 border p-4 w-full max-w-md bg-white rounded">
            {employeeSchedule.total === 0 ? (
              <p>해당 날짜 근무하는 직원이 없습니다.</p>
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
                      className="border border-gray-300 rounded-lg px-3 py-1"
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

                <div className="border-t mt-4 px-3 py-1 text-end">
                  <span className="font-bold">휴일까지 : </span>
                  {employeeSchedule.next_dayoff}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
