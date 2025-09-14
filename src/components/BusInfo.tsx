import type { Bus } from "@/types/api";

export default function BusInfo({ buses }: { buses: Bus[] }) {
  if (!buses || buses.length === 0) return null; // 배열 자체가 없거나 비어있으면 렌더링 안함

  return (
    <section className="mb-2">
      <ul className="flex gap-2">
        {buses.map((bus, idx) => {
          if (!bus) return null; // bus 객체가 없으면 건너뜀

          return (
            <li
              key={idx}
              className="flex-grow px-4 py-2 rounded-xl bg-[#EAF5EC]"
            >
              <p className="font-bold text-xl text-center">
                {bus.eta === "곧 도착" || bus.eta === "출발 대기"
                  ? bus.eta
                  : bus.eta
                  ? `${bus.eta}후`
                  : "정보 없음"}
              </p>

              {bus.eta &&
                !(bus.eta === "곧 도착" || bus.eta === "출발 대기") &&
                bus.position && (
                  <p className="font-semibold mb-2 text-center text-xs">
                    [ {bus.position} ]
                  </p>
                )}

              {bus.eta && bus.eta !== "출발 대기" && (
                <>
                  {bus.arrival_time && (
                    <p className="text-gray-500">
                      도착 시간: {bus.arrival_time}
                    </p>
                  )}
                  {bus.bus_no && (
                    <p className="text-gray-400">
                      {bus.bus_no} ({" "}
                      <span
                        className={
                          bus.crowd === "여유"
                            ? "text-green-500 font-semibold"
                            : bus.crowd === "보통"
                            ? "text-yellow-500 font-semibold"
                            : bus.crowd === "혼잡"
                            ? "text-red-500 font-semibold"
                            : "text-gray-500 font-semibold"
                        }
                      >
                        {bus.crowd ?? "정보 없음"}{" "}
                      </span>
                      )
                    </p>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
