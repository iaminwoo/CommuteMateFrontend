"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import EmployeeDropdown from "@/components/EmployeeDropdown";
import type { EmployeeMonthPositions, Position } from "@/types/position";

export default function Position() {
  const router = useRouter();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [employeeMonthPositions, setEmployeeMonthPositions] =
    useState<EmployeeMonthPositions>({
      employee_id: 0,
      year: 0,
      month: 0,
      positions: [],
    });

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const POSITIONS = ["샌드위치", "오븐", "반죽", "빵", "시야기", "케이크"];

  // 서버에서 포지션 불러오기
  useEffect(() => {
    if (!selectedEmployeeId) return;

    const fetchPositions = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/positions/position-month/${selectedEmployeeId}/${year}/${month}`
        );
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);

        const data = await res.json();
        setEmployeeMonthPositions(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPositions();
  }, [selectedEmployeeId, year, month, API_BASE]);

  // 날짜+포지션 추가
  const addPosition = (date: string, position: string) => {
    if (!date || !position) return;

    const exists = employeeMonthPositions.positions.find(
      (p) => p.date === date
    );
    let updated: Position[];

    if (exists) {
      // 이미 날짜가 있으면 포지션만 업데이트
      updated = employeeMonthPositions.positions.map((p) =>
        p.date === date ? { ...p, position } : p
      );
    } else {
      updated = [...employeeMonthPositions.positions, { date, position }];
    }

    setEmployeeMonthPositions({
      ...employeeMonthPositions,
      positions: updated.sort((a, b) => a.date.localeCompare(b.date)),
    });
  };

  // 삭제
  const removePosition = (date: string) => {
    setEmployeeMonthPositions({
      ...employeeMonthPositions,
      positions: employeeMonthPositions.positions.filter(
        (p) => p.date !== date
      ),
    });
  };

  // 저장
  const savePositions = async () => {
    if (!selectedEmployeeId) return;
    try {
      const res = await fetch(`${API_BASE}/positions/position-month/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeMonthPositions),
      });

      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);

      alert("포지션이 저장되었습니다.");
      router.push("/schedule/dayoffs");
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // UI
  const [newDate, setNewDate] = useState("");
  const [newPosition, setNewPosition] = useState("");

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="mt-2 px-4 py-1 bg-[#5E734F] text-white text-xl font-semibold rounded-xl">
        포지션 수정
      </h1>

      <div className="flex flex-col items-center justify-center gap-4 mt-6">
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
              setYear(Number(y));
              setMonth(Number(m));
            }}
            className="border p-2 rounded"
          />
        </div>

        {/* 날짜 + 포지션 입력 */}
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
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="border p-2 rounded"
            />
            <select
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">포지션 선택</option>
              {POSITIONS.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                addPosition(newDate, newPosition);
                setNewDate("");
                setNewPosition("");
              }}
              className="px-4 py-2 bg-[#EAF5EC] rounded border hover:bg-[#D5DED7] transition"
            >
              추가
            </button>
          </div>
        )}

        {/* 포지션 목록 */}
        {employeeMonthPositions.positions.length === 0 && (
          <p className="text-gray-500 mt-2">
            선택한 직원의 포지션 기록이 없습니다.
          </p>
        )}

        {employeeMonthPositions.positions.length > 0 && (
          <table className="border-collapse border border-gray-400 text-sm mt-2">
            <thead>
              <tr>
                <th className="border border-gray-400 px-2 py-1 bg-[#EAF5D4]">
                  순서
                </th>
                <th className="border border-gray-400 px-2 py-1 bg-[#EAF5D4]">
                  날짜
                </th>
                <th className="border border-gray-400 px-2 py-1 bg-[#EAF5D4]">
                  포지션
                </th>
                <th className="border border-gray-400 px-2 py-1 bg-[#EAF5D4]">
                  삭제
                </th>
              </tr>
            </thead>
            <tbody>
              {employeeMonthPositions.positions.map((p, idx) => (
                <tr key={p.date}>
                  <td className="border border-gray-300 px-2 py-1">
                    {idx + 1}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">{p.date}</td>
                  <td className="border border-gray-300 px-2 py-1">
                    {p.position}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removePosition(p.date)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          onClick={savePositions}
          className="w-full py-3 bg-[#5E734F] text-white rounded-lg hover:bg-[#4B5C3F] transition"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
