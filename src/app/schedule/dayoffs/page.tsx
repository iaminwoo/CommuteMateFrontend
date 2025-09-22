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
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="mt-2 px-4 py-1 bg-[#5E734F] text-white text-xl font-semibold rounded-xl">
        근무 + 포지션 관리
      </h1>

      <div className="flex flex-col mt-4 justify-center items-center">
        <div className="flex gap-2">
          <button
            className="px-5 py-3 bg-[#5E734F] text-white rounded-lg hover:bg-[#4B5C3F] transition"
            onClick={() => router.push("/schedule/employee")}
          >
            직원 관리
          </button>
          <button
            className="px-5 py-3 bg-[#5E734F] text-white rounded-lg hover:bg-[#4B5C3F] transition"
            onClick={() => router.push("/schedule/dayoffs/position")}
          >
            포지션 수정
          </button>
          <button
            className="px-5 py-3 bg-[#5E734F] text-white rounded-lg hover:bg-[#4B5C3F] transition"
            onClick={() => router.push("/schedule/dayoffs/modify")}
          >
            휴무 수정
          </button>
        </div>

        <input
          type="month"
          value={`${year}-${month.toString().padStart(2, "0")}`}
          onChange={(e) => {
            const [y, m] = e.target.value.split("-");
            setYear(Number(y));
            setMonth(Number(m));
          }}
          className="border p-2 rounded mt-2"
        />
      </div>

      <div className="w-full max-w-4xl flex mt-4 mb-2 justify-start">
        <h2 className="text-xl font-semibold">해당 달 근무표</h2>
      </div>

      <div className="overflow-x-auto max-w-full">
        <table className="min-w-[800px] border-collapse border border-gray-400 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-400 px-2 py-1 bg-gray-200 min-w-18 max-w-20">
                직원명
              </th>
              {Array.from({ length: lastDay }, (_, i) => {
                const day = i + 1;
                const weekday = new Date(year, month - 1, day).getDay();
                let weekendClass = "bg-gray-50";
                if (weekday === 0) weekendClass = "bg-red-100";
                else if (weekday === 6) weekendClass = "bg-blue-100";
                return (
                  <th
                    key={day}
                    className={`border border-gray-400 px-1 py-1 min-w-7 ${weekendClass}`}
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
                <td className="border border-gray-400 px-2 py-1 font-semibold bg-gray-50 min-w-18 max-w-20">
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
                      className={`border border-gray-300 px-2 py-1 text-center min-w-7 ${weekendClass}`}
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
    </div>
  );
}
