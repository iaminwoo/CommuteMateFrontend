import type { Bus } from "@/types/api";

export default function BusInfo({ buses }: { buses: Bus[] }) {
  return (
    <section className="mb-2">
      <ul className="flex gap-2">
        {buses.map((bus, idx) => (
          <li key={idx} className="flex-grow px-4 py-2 rounded-xl bg-[#EAF5EC]">
            <p className="font-bold text-xl text-center">
              {bus.eta === "곧 도착" || bus.eta === "출발 대기"
                ? bus.eta
                : `${bus.eta}후`}
            </p>

            {!(bus.eta === "곧 도착" || bus.eta === "출발 대기") && (
              <p className="font-semibold mb-2 text-center text-xs">
                [ {bus.position} ]
              </p>
            )}

            {bus.eta !== "출발 대기" && (
              <>
                <p className="text-gray-500">도착 시간: {bus.arrival_time}</p>
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
                    {bus.crowd}{" "}
                  </span>
                  )
                </p>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
