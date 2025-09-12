import type { Weather } from "@/types/api";
import Image from "next/image";

export default function WeatherInfo({ weather }: { weather: Weather[] }) {
  if (!weather || weather.length === 0) return null;

  const [current, ...forecast] = weather;

  const skyCodeTextMap: Record<number, string> = {
    1: "맑음 밤",
    2: "맑음 낮",
    3: "구름많음 밤",
    4: "구름많음 낮",
    5: "흐림 밤",
    6: "흐림 낮",
    7: "비",
    8: "비+눈",
    9: "눈",
  };

  const skyCodeIconMap: Record<number, string> = {
    1: "/icons/NB01_N.png",
    2: "/icons/NB01.png",
    3: "/icons/NB03_N.png",
    4: "/icons/NB03.png",
    5: "/icons/NB04.png",
    6: "/icons/NB04.png",
    7: "/icons/NB08.png",
    8: "/icons/NB12.png",
    9: "/icons/NB11.png",
  };

  return (
    <section>
      {/* 현재 날씨 */}
      <div className="p-4 rounded-xl bg-[#EAF5D4] border-gray-200 mb-2">
        <p className="text-center font-semibold text-gray-800">현재 날씨</p>
        <div className="flex gap-4 justify-center items-center ">
          <div className="relative w-25 h-25 flex items-center justify-center">
            <Image
              src={skyCodeIconMap[current.sky_code]}
              alt="날씨 아이콘"
              fill
              className="object-cover rounded-xl"
              sizes="(max-width: 768px) 25vw, (max-width: 1200px) 10vw, 64px"
            />
          </div>
          <div>
            <p className="text-gray-600 text-base">
              {current.temp}℃ ({current.humidity}%)
            </p>
            {[7, 8, 9].includes(current.sky_code) && (
              <>
                <p className="font-semibold text-base">
                  {current.precipitation_amount}
                </p>
              </>
            )}
            {current.wind !== "약한 바람" && (
              <p className="font-semibold text-base">{current.wind}</p>
            )}
          </div>
        </div>
      </div>

      {/* 시간대별 날씨 */}
      <ul className="flex justify-between gap-2">
        {forecast.map((w, idx) => (
          <li
            key={idx}
            className="flex-grow p-2 rounded bg-[#EAF5D4] border-gray-200 rounded-xl"
          >
            <div className="flex flex-col gap-2 items-center">
              <h4 className="font-semibold text-gray-800">{w.time}</h4>
              <div className="relative w-16 h-16 flex items-center justify-center">
                <Image
                  src={skyCodeIconMap[w.sky_code]}
                  alt="날씨 아이콘"
                  fill
                  className="object-cover rounded-xl"
                  sizes="(max-width: 768px) 25vw, (max-width: 1200px) 10vw, 64px"
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-gray-600">
                  {w.temp}℃ ({w.humidity}%)
                </p>

                {[7, 8, 9].includes(w.sky_code) && (
                  <p className="font-semibold">{w.precipitation_amount}</p>
                )}

                {w.wind !== "약한 바람" && (
                  <p className="font-semibold">{w.wind}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
