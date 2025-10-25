"use client";

import { useEffect, useState } from "react";
import type { ApiResponse } from "@/types/api";
import BusInfo from "@/components/BusInfo";
import WeatherInfo from "@/components/WeatherInfo";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [countdown, setCountdown] = useState(15); // 15초 카운트다운

  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchData = async () => {
    if (!document.hidden) {
      try {
        const res = await fetch(`${API_BASE}/api/info`);

        if (!res.ok) {
          throw new Error(`서버 오류: ${res.status}`);
        }

        const json: ApiResponse = await res.json();
        setData(json);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      } finally {
        setInitialLoading(false);
        setCountdown(15); // 데이터 갱신 시 카운트다운 초기화
      }
    }
  };

  useEffect(() => {
    fetchData();

    // 15초마다 자동 갱신
    const intervalFetch = setInterval(fetchData, 15000);

    // 1초마다 카운트다운 감소
    const intervalCountdown = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // 페이지가 다시 활성화되면 즉시 갱신
    const handleVisibility = () => {
      if (!document.hidden) fetchData();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalFetch);
      clearInterval(intervalCountdown);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col justify-center items-center px-4 py-4">
      <div className="w-full max-w-[412px] text-sm">
        <div className="w-full flex flex-col items-center justify-center mb-2">
          <div className="relative w-50 h-40">
            <Image
              src="/busppang.png"
              alt="설명 텍스트"
              fill
              priority
              className="object-cover rounded-xl"
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 400px"
            />
          </div>

          <p className="mt-2 px-4 py-1 bg-[#5E734F] text-white text-xl font-semibold rounded-xl">
            루디아의 출근 도우미 : 출근빵
          </p>
        </div>

        {initialLoading ? (
          <p className="text-center">불러오는 중...</p>
        ) : (
          <>
            {data && (
              <>
                {data?.bus?.length > 0 && <BusInfo buses={data.bus} />}
                {data?.weather?.length > 0 && (
                  <WeatherInfo weather={data.weather} />
                )}

                <p className="text-center mt-4 font-semibold text-gray-400">
                  * 15초마다 최신 정보로 갱신됩니다. ({countdown}초 후 갱신)
                </p>
              </>
            )}

            {!data && (
              <p className="text-center text-red-500">
                데이터를 불러오지 못했습니다.
                <br />
                {countdown}초 후 자동으로 다시 시도합니다.
              </p>
            )}
          </>
        )}

        <div className="w-full flex justify-center mt-2">
          <button
            className="px-12 py-3 bg-[#5E734F] text-white font-bold rounded-lg hover:bg-[#4B5C3F] transition"
            onClick={() => router.push("/check")}
          >
            근무 확인
          </button>
        </div>
      </div>
    </main>
  );
}
