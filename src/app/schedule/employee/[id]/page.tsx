"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Employee } from "@/types/employee";

export default function Detail() {
  const { id } = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [name, setName] = useState("");
  const [defaultPosition, setDefaultPosition] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const POSITIONS = ["샌드위치", "오븐", "반죽", "빵", "시야기", "케이크"];

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE}/employees/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEmployee(data.employee);
        setName(data.employee.name);
        setDefaultPosition(data.employee.default_position || "");
      })
      .catch((err) => console.error("직원 정보 불러오기 실패:", err));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          default_position: defaultPosition || null,
        }),
      });

      if (!res.ok) throw new Error("업데이트 실패");

      router.push("/schedule/employee");
    } catch (err) {
      console.error(err);
    }
  };

  if (!employee) return <div>로딩 중...</div>;

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="mt-2 px-4 py-1 bg-[#5E734F] text-white text-xl font-semibold rounded-xl">
        직원 상세 페이지
      </h1>

      <form className="w-full max-w-md bg-white p-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold mb-1">이름</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">기본 포지션</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={defaultPosition}
            onChange={(e) => setDefaultPosition(e.target.value)}
          >
            <option value="">선택하세요</option>
            {POSITIONS.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#5E734F] text-white rounded-lg hover:bg-[#4B5C3F] transition"
        >
          저장
        </button>
      </form>
    </div>
  );
}
