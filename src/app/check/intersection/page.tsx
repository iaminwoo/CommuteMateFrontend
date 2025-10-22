"use client";

import { useState, useEffect } from "react";
import EmployeeDropdown from "@/components/EmployeeDropdown"; // 여러명 선택 가능하도록 수정

export default function Intersection() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const [employees, setEmployees] = useState<{ id: number; name: string }[]>(
    []
  );
  const [dropdowns, setDropdowns] = useState<number[]>([0]); // 드롭다운 id 리스트
  const [selectedEmployeesMap, setSelectedEmployeesMap] = useState<{
    [key: number]: number | null;
  }>({ 0: null });
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const [workDates, setWorkDates] = useState<string[]>([]);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // 직원 목록 불러오기
  useEffect(() => {
    fetch(`${API_BASE}/employees/names`)
      .then((res) => res.json())
      .then((data) => setEmployees(data.employees_names))
      .catch(console.error);
  }, [API_BASE]);

  // 드롭다운 선택 시 바로 이름 리스트에 반영
  const handleSelectChange = (dropdownId: number, empId: number | null) => {
    setSelectedEmployeesMap((prev) => ({ ...prev, [dropdownId]: empId }));

    const names = Object.values({
      ...selectedEmployeesMap,
      [dropdownId]: empId,
    })
      .map((id) => employees.find((e) => e.id === id)?.name)
      .filter((n): n is string => !!n); // null 제거

    setSelectedEmployees(names);
  };

  // 드롭다운 추가
  const addDropdown = () => {
    const newId = Math.max(...dropdowns) + 1;
    setDropdowns([...dropdowns, newId]);
    setSelectedEmployeesMap((prev) => ({ ...prev, [newId]: null }));
  };

  const removeDropdown = (id: number) => {
    setDropdowns((prev) => prev.filter((d) => d !== id));
    setSelectedEmployeesMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    // 이름 리스트도 갱신
    const names = Object.values(selectedEmployeesMap)
      .filter((_, key) => key !== id) // 삭제한 드롭다운 제외
      .map((empId) => employees.find((e) => e.id === empId)?.name)
      .filter((n): n is string => !!n);
    setSelectedEmployees(names);
  };

  // 서버 요청
  const fetchWorkIntersection = async () => {
    if (selectedEmployees.length === 0) return;

    const payload = {
      year,
      month,
      names: selectedEmployees,
    };

    try {
      const res = await fetch(`${API_BASE}/dayoffs/work-intersection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      const data = await res.json();
      setWorkDates(data.dates); // ["2025-09-04", "2025-09-06", ...]
    } catch (err) {
      console.error(err);
      alert("조회 중 오류가 발생했습니다.");
    }
  };

  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=일요일
  const numDays = new Date(year, month, 0).getDate();
  const calendarDays: (number | null)[] = [
    ...(firstDay === 0 ? [] : Array.from({ length: firstDay }, () => null)),
    ...Array.from({ length: numDays }, (_, i) => i + 1),
  ];

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h1 className="mt-2 px-4 py-1 bg-[#5E734F] text-white text-xl font-semibold rounded-xl">
        근무 교집합 조회
      </h1>

      <input
        type="month"
        value={`${year}-${month.toString().padStart(2, "0")}`}
        onChange={(e) => {
          const [y, m] = e.target.value.split("-");
          setYear(Number(y));
          setMonth(Number(m));
        }}
        className="border px-2 py-1 rounded mb-2"
      />

      {/* 드롭다운 리스트 */}
      <div className="flex flex-col gap-2 w-full max-w-sm">
        {dropdowns.map((id) => (
          <div key={id} className="flex items-center justify-center gap-2">
            <EmployeeDropdown
              value={selectedEmployeesMap[id]}
              onChange={(empId) => handleSelectChange(id, empId)}
            />
            {dropdowns.length > 1 && (
              <button
                className="px-3 py-2 bg-[#E14631] text-white rounded-lg hover:bg-[#B53828] transition"
                onClick={() => removeDropdown(id)}
              >
                삭제
              </button>
            )}
          </div>
        ))}
        <div className="flex justify-center gap-4 mb-4 pb-3 border-b">
          <button
            className="px-3 py-1 bg-[#EAF5D4] border text-gray-700 rounded-lg w-20 hover:bg-[#D5DED7] transition"
            onClick={addDropdown}
          >
            추가
          </button>

          <button
            onClick={fetchWorkIntersection}
            className="px-4 py-2 border bg-[#5E734F] text-white rounded-lg hover:bg-[#4B5C3F] transition"
          >
            조회하기
          </button>
        </div>
      </div>

      {/* 달력 */}
      <div className="grid grid-cols-7 gap-1 bg-white p-2 rounded-lg border">
        {["일", "월", "화", "수", "목", "금", "토"].map((d, idx) => (
          <div
            key={d}
            className={`font-bold text-center mb-1 ${
              idx === 0
                ? "text-red-500" // 일요일 빨간색
                : idx === 6
                ? "text-blue-500" // 토요일 파란색
                : ""
            }`}
          >
            {d}
          </div>
        ))}

        {calendarDays.map((d, idx) =>
          d == null ? (
            <div key={idx} className="p-2 border-0">
              &nbsp;
            </div>
          ) : (
            <div
              key={idx}
              className={`text-center p-2 border rounded ${
                workDates.includes(
                  `${year}-${month.toString().padStart(2, "0")}-${d
                    .toString()
                    .padStart(2, "0")}`
                )
                  ? ""
                  : "bg-gray-100 text-white font-bold"
              }`}
            >
              {d}
            </div>
          )
        )}
      </div>
    </div>
  );
}
