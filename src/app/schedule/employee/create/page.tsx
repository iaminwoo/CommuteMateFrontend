"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Create() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [name, setName] = useState("");
  const [defaultPosition, setDefaultPosition] = useState("");
  const [loading, setLoading] = useState(false);

  const POSITIONS = ["샌드위치", "오븐", "반죽", "빵", "시야기", "케이크"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/employees/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          default_position: defaultPosition || null,
        }),
      });

      if (!res.ok) {
        throw new Error("직원 추가 실패");
      }

      // 성공하면 목록으로 돌아가기
      router.push("/schedule/employee");
    } catch (err) {
      console.error(err);
      alert("직원 추가에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="mt-2 px-4 py-1 bg-[#5E734F] text-white text-xl font-semibold rounded-xl">
        직원 생성 페이지
      </h1>

      <form
        className="bg-white p-6 rounded w-full max-w-md"
        onSubmit={handleSubmit}
      >
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
          disabled={loading}
          className="w-full py-3 bg-[#5E734F] text-white rounded-lg hover:bg-[#4B5C3F] transition"
        >
          {loading ? "저장 중..." : "저장"}
        </button>
      </form>
    </div>
  );
}
