"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Employee, EmployeeOrder } from "@/types/employee";

export default function Order() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  useEffect(() => {
    if (!API_BASE) return;
    setLoading(true);
    fetch(`${API_BASE}/employees/order`)
      .then((res) => {
        if (!res.ok) throw new Error(`서버 응답 오류: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // 서버 응답 스키마: { new_order: [{ order: number, name: string }, ...] }
        const list = Array.isArray(data?.new_order)
          ? data.new_order.map((item: EmployeeOrder, idx: number) => ({
              id: idx,
              name: item.name,
              order: item.order,
            }))
          : [];
        setEmployees(list);
      })
      .catch((err) => {
        console.error("직원 목록 불러오기 실패:", err);
      })
      .finally(() => setLoading(false));
  }, [API_BASE]);

  const move = (from: number, to: number) => {
    if (
      from < 0 ||
      to < 0 ||
      from >= employees.length ||
      to >= employees.length
    )
      return;
    setEmployees((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      // reindex order locally for UI
      return copy.map((e, i) => ({ ...e, order: i }));
    });
  };

  const handleMoveUp = (index: number) => move(index, index - 1);
  const handleMoveDown = (index: number) => move(index, index + 1);

  const handleSave = async () => {
    if (!API_BASE) {
      return;
    }

    // 요청 바디: 이름 순서 배열
    const orderPayload = employees.map((e) => e.name);

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/employees/order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderPayload }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`저장 실패: ${res.status} ${text}`);
      }

      const data = await res.json();
      // 서버가 { new_order: [{order, name}, ...] } 형태로 반환
      const list: Employee[] = Array.isArray(data?.new_order)
        ? data.new_order.map((item: EmployeeOrder, idx: number) => ({
            id: idx,
            name: item.name,
            order: item.order,
          }))
        : employees;

      setEmployees(list);
      router.push("/schedule/employee");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="mt-2 px-4 py-1 bg-[#5E734F] text-white text-xl font-semibold rounded-xl">
        직원 순서 변경
      </h1>

      <div className="w-full max-w-2xl bg-white rounded p-4 mb-4">
        <h2 className="text-xl font-semibold mb-3">직원 명단</h2>

        {loading ? (
          <div className="text-gray-500">로딩 중...</div>
        ) : employees.length === 0 ? (
          <div className="text-gray-500">직원 정보가 없습니다.</div>
        ) : (
          <ul className="space-y-2">
            {employees.map((emp, idx) => (
              <li
                key={emp.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 text-center text-sm text-gray-600">
                    {idx + 1}
                  </div>
                  <div className="font-medium">{emp.name}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    aria-label={`위로 이동 ${emp.name}`}
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className={`px-2 py-1 rounded border text-sm ${
                      idx === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    ↑
                  </button>

                  <button
                    aria-label={`아래로 이동 ${emp.name}`}
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === employees.length - 1}
                    className={`px-2 py-1 rounded border text-sm ${
                      idx === employees.length - 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    ↓
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full max-w-2xl flex justify-center">
        <button
          onClick={handleSave}
          disabled={saving || loading || employees.length === 0}
          className="w-50 py-3 bg-[#5E734F] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4B5C3F] transition"
        >
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </div>
  );
}
