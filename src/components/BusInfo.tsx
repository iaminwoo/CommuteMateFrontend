import type { Bus } from "@/types/api";

export default function BusInfo({ buses }: { buses: Bus[] }) {
  // 1. 배열 자체가 없거나 비어있으면 렌더링 안 함
  if (!buses || buses.length === 0) return null;

  // 2. 첫 번째 버스 정보(buses[0])만 사용
  const bus = buses[0];
  if (!bus) return null; // 첫 번째 요소가 유효하지 않으면 렌더링 안 함

  // 3. ul/li 구조 대신 단일 section/div 구조로 변경
  return (
    <section className="mb-2">
      <div className="flex gap-2">
        {/* ul 대신 flex 컨테이너 사용 */}
        <div className="flex-grow px-4 py-2 rounded-xl bg-[#EAF5EC]">
          <div className="flex gap-2 justify-center items-center">
            {/* 도착 예정 시간 */}
            <div className="font-bold text-xl text-center">
              {bus.eta === "곧 도착" || bus.eta === "출발 대기" ? (
                <div className="flex gap-2 justify-center items-center">
                  <span className="text-lg">다음버스 : </span>
                  {bus.eta}
                </div>
              ) : bus.eta ? (
                <div className="flex gap-2 justify-center items-center">
                  <span className="text-sm">다음버스 : </span>
                  {`${bus.eta}후`}
                </div>
              ) : (
                "정보 없음"
              )}
            </div>

            {/* 현재 버스 위치 (몇 정거장 전) */}
            {bus.eta &&
              !(bus.eta === "곧 도착" || bus.eta === "출발 대기") &&
              bus.position && (
                <p className="font-semibold text-center text-xs">
                  [ {bus.position} ]
                </p>
              )}
          </div>

          {/* 나머지 상세 정보 */}
          {bus.eta && bus.eta !== "출발 대기" && (
            <div className="flex gap-2 justify-center items-center">
              {bus.arrival_time && (
                <p className="text-gray-500">예상 도착 : {bus.arrival_time}</p>
              )}
              {" / "}
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
