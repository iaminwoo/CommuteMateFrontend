"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import EmployeeDropdown from "@/components/EmployeeDropdown";
import { DayoffEmployeeMonth } from "@/types/dayoff";

export default function Modify() {
  const router = useRouter();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [dayoffEmployeeMonth, setDayoffEmployeeMonth] =
    useState<DayoffEmployeeMonth>({
      employee_id: 0,
      year: 0,
      month: 0,
      dates: [],
    });

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // 서버에서 휴무 불러오기
  useEffect(() => {
    if (!selectedEmployeeId) return;

    const fetchDayoffs = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/dayoffs/dayoff-month/${selectedEmployeeId}/${year}/${month}`
        );
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);

        const data = await res.json();
        setDayoffEmployeeMonth(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDayoffs();
  }, [selectedEmployeeId, year, month, API_BASE]);

  // 날짜 추가
  const addDate = (date: string) => {
    if (!date) return;
    if (!dayoffEmployeeMonth.dates.includes(date)) {
      setDayoffEmployeeMonth({
        ...dayoffEmployeeMonth,
        dates: [...dayoffEmployeeMonth.dates, date].sort(),
      });
    }
  };

  // 날짜 삭제
  const removeDate = (date: string) => {
    setDayoffEmployeeMonth({
      ...dayoffEmployeeMonth,
      dates: dayoffEmployeeMonth.dates.filter((d) => d !== date),
    });
  };

  // 저장
  const saveDayoffs = async () => {
    if (!selectedEmployeeId) return;
    try {
      const res = await fetch(`${API_BASE}/dayoffs/dayoff-month/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dayoffEmployeeMonth),
      });

      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);

      alert("휴무가 저장되었습니다.");
      router.push("/schedule/dayoffs");
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">휴무 수정</h1>

      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex gap-2">
          <EmployeeDropdown
            value={selectedEmployeeId}
            onChange={setSelectedEmployeeId}
          />

          <input
            type="month"
            value={`${year}-${month.toString().padStart(2, "0")}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split("-");
              const yy = Number(y);
              const mm = Number(m);
              setYear(yy);
              setMonth(mm);
            }}
            className="border p-2 rounded"
          />
        </div>

        {/* 날짜 추가 */}
        {selectedEmployeeId && (
          <div className="flex gap-2 items-center mt-2">
            <input
              type="date"
              min={`${year}-${month.toString().padStart(2, "0")}-01`}
              max={`${year}-${month.toString().padStart(2, "0")}-${new Date(
                year,
                month,
                0
              ).getDate()}`}
              onChange={(e) => addDate(e.target.value)}
              className="border p-2 rounded"
            />
            <button
              onClick={saveDayoffs}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              저장하기
            </button>
          </div>
        )}

        {/* 날짜 목록 */}
        {dayoffEmployeeMonth.dates.length === 0 && (
          <p className="text-gray-500 mt-2">선택한 직원의 휴무가 없습니다.</p>
        )}

        {dayoffEmployeeMonth.dates.length > 0 && (
          <table className="border-collapse border border-gray-400 text-sm mt-2">
            <thead>
              <tr>
                <th className="border border-gray-400 px-2 py-1 bg-gray-200">
                  순서
                </th>
                <th className="border border-gray-400 px-2 py-1 bg-gray-200">
                  날짜
                </th>
                <th className="border border-gray-400 px-2 py-1 bg-gray-200">
                  삭제
                </th>
              </tr>
            </thead>
            <tbody>
              {dayoffEmployeeMonth.dates.map((d, idx) => (
                <tr key={d}>
                  <td className="border border-gray-300 px-2 py-1">
                    {idx + 1}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">{d}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeDate(d)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
