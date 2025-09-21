"use client";
import type { Dayoff } from "@/types/dayoff";
import type { Position, PositionsAllMonth } from "@/types/position";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DayoffsPositions() {
  const router = useRouter();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const [dayoffs, setDayoffs] = useState<Dayoff[]>([]);
  const [positions, setPositions] = useState<PositionsAllMonth[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dayoffRes, positionRes] = await Promise.all([
          fetch(`${API_BASE}/dayoffs/month`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ year, month }),
          }),
          fetch(`${API_BASE}/positions/month`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ year, month }),
          }),
        ]);

        if (!dayoffRes.ok || !positionRes.ok) {
          throw new Error("서버 오류");
        }

        const dayoffData = await dayoffRes.json();
        const positionData = await positionRes.json();

        setDayoffs(dayoffData.dayoffs);
        setPositions(positionData.positions);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [year, month, API_BASE]);

  // 직원별/날짜별로 데이터 합치기
  const groupedMap: Record<
    number,
    {
      name: string;
      days: Record<number, { order?: number; position?: string }>;
    }
  > = {};

  dayoffs.forEach((d) => {
    const day = new Date(d.date).getDate();
    if (!groupedMap[d.employee_id])
      groupedMap[d.employee_id] = { name: d.name, days: {} };
    groupedMap[d.employee_id].days[day] = {
      ...groupedMap[d.employee_id].days[day],
      order: d.order,
    };
  });

  positions.forEach((emp) => {
    emp.positions.forEach((p: Position) => {
      const day = new Date(p.date).getDate();
      if (!groupedMap[emp.employee_id])
        groupedMap[emp.employee_id] = { name: emp.name, days: {} };
      groupedMap[emp.employee_id].days[day] = {
        ...groupedMap[emp.employee_id].days[day],
        position: p.position,
      };
    });
  });

  // 객체 → 배열로 변환하면서 employee_order 순서 유지
  const groupedArray = Object.values(groupedMap).sort((a, b) => {
    const empA =
      dayoffs.find((e) => e.name === a.name) ||
      positions.find((e) => e.name === a.name)!;
    const empB =
      dayoffs.find((e) => e.name === b.name) ||
      positions.find((e) => e.name === b.name)!;
    return empA.employee_order - empB.employee_order;
  });

  const lastDay = new Date(year, month, 0).getDate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-2">
      <h1 className="text-4xl font-bold mb-4">근무 + 포지션 관리</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="month"
          value={`${year}-${month.toString().padStart(2, "0")}`}
          onChange={(e) => {
            const [y, m] = e.target.value.split("-");
            setYear(Number(y));
            setMonth(Number(m));
          }}
          className="border p-2 rounded"
        />
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => router.push("/schedule/employee")}
        >
          직원 관리
        </button>
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => router.push("/schedule/dayoffs/position")}
        >
          포지션 수정
        </button>
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => router.push("/schedule/dayoffs/modify")}
        >
          휴무 수정
        </button>
      </div>

      {/* 데스크탑 테이블 */}
      <div className="hidden md:block mt-4 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">해당 달 근무표</h2>
        <table className="min-w-[800px] border-collapse border border-gray-400 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-400 px-2 py-1 bg-gray-200">
                직원명
              </th>
              {Array.from({ length: lastDay }, (_, i) => {
                const day = i + 1;
                const weekday = new Date(year, month - 1, day).getDay();
                let weekendClass = "";
                if (weekday === 0) weekendClass = "bg-red-100";
                else if (weekday === 6) weekendClass = "bg-blue-100";
                return (
                  <th
                    key={day}
                    className={`border border-gray-400 w-6 px-1 py-1 ${weekendClass}`}
                  >
                    {day}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {groupedArray.map(({ name, days }, rowIdx) => (
              <tr key={rowIdx}>
                <td className="border border-gray-400 px-2 py-1 font-semibold bg-gray-50">
                  {name}
                </td>
                {Array.from({ length: lastDay }, (_, i) => {
                  const day = i + 1;
                  const weekday = new Date(year, month - 1, day).getDay();
                  let weekendClass = "";
                  if (weekday === 0) weekendClass = "bg-red-100";
                  else if (weekday === 6) weekendClass = "bg-blue-100";
                  return (
                    <td
                      key={day}
                      className={`border border-gray-300 px-2 py-1 text-center ${weekendClass}`}
                    >
                      {days[day]?.order !== undefined
                        ? days[day].order
                        : days[day]?.position?.substring(0, 1) ?? ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드형 */}
      <div className="md:hidden mt-4 w-full">
        <h2 className="text-xl font-semibold mb-2">해당 달 근무표 (모바일)</h2>
        {groupedArray.map(({ name, days }, rowIdx) => (
          <div key={rowIdx} className="border rounded p-2 mb-2 bg-white">
            <div className="font-semibold mb-1">{name}</div>
            <div className="grid grid-cols-7 gap-1 text-center mb-1 font-semibold bg-gray-200">
              <div className="border">월</div>
              <div className="border">화</div>
              <div className="border">수</div>
              <div className="border">목</div>
              <div className="border">금</div>
              <div className="border">토</div>
              <div className="border">일</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: lastDay }, (_, i) => {
                const day = i + 1;
                const weekday = new Date(year, month - 1, day).getDay();
                let bg = "bg-white";
                if (weekday === 0) bg = "bg-red-100";
                else if (weekday === 6) bg = "bg-blue-100";

                return (
                  <div
                    key={day}
                    className={`border p-1 text-center text-xs h-6 ${bg}`}
                  >
                    {days[day]?.order !== undefined
                      ? days[day].order
                      : days[day]?.position?.substring(0, 1) ?? ""}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
