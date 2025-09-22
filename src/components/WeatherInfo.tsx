import type { Weather } from "@/types/api";
import Image from "next/image";

export default function WeatherInfo({ weather }: { weather: Weather[] }) {
  // 배열 자체 없거나 비어있으면 렌더링 안함
  if (!weather || weather.length === 0) return null;

  const [current, ...forecast] = weather;

  // current 속성 안전 체크
  const currentSky = current?.sky_code ?? 0;
  const currentTemp = current?.temp ?? "-";
  const currentHumidity = current?.humidity ?? "-";
  const currentPrecipitation = current?.precipitation_amount ?? "-";
  const currentWind = current?.wind ?? "정보 없음";

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
      <div className="px-4 py-2 rounded-xl bg-[#EAF5D4] border-gray-200 mb-2">
        <p className="text-center font-semibold text-gray-800">현재 날씨</p>
        <div className="flex gap-4 justify-center items-center ">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <Image
              src={skyCodeIconMap[currentSky] ?? "/icons/NB01.png"}
              alt="날씨 아이콘"
              fill
              className="object-cover rounded-xl"
              sizes="(max-width: 768px) 25vw, (max-width: 1200px) 10vw, 64px"
            />
          </div>
          <div>
            <p className="text-gray-600 text-base">
              {currentTemp}℃ ({currentHumidity}%)
            </p>
            {[7, 8, 9].includes(currentSky) && (
              <p className="font-semibold text-base">{currentPrecipitation}</p>
            )}
            {currentWind !== "약한 바람" && (
              <p className="font-semibold text-base">{currentWind}</p>
            )}
          </div>
        </div>
      </div>

      {/* 시간대별 날씨 */}
      <ul className="flex justify-between gap-2">
        {forecast.map((w, idx) => {
          if (!w) return null; // 항목 자체가 없으면 건너뜀
          const wSky = w?.sky_code ?? 1;
          const wTemp = w?.temp ?? "-";
          const wHumidity = w?.humidity ?? "-";
          const wPrecipitation = w?.precipitation_amount ?? "-";
          const wWind = w?.wind ?? "정보 없음";

          return (
            <li
              key={idx}
              className="flex-grow p-2 rounded bg-[#EAF5D4] border-gray-200 rounded-xl"
            >
              <div className="flex flex-col gap-2 items-center">
                <h4 className="font-semibold text-gray-800">
                  {w?.time ?? "-"}
                </h4>
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <Image
                    src={skyCodeIconMap[wSky] ?? "/icons/NB01.png"}
                    alt="날씨 아이콘"
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width: 768px) 25vw, (max-width: 1200px) 10vw, 64px"
                  />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-gray-600">
                    {wTemp}℃ ({wHumidity}%)
                  </p>
                  {[7, 8, 9].includes(wSky) && (
                    <p className="font-semibold">{wPrecipitation}</p>
                  )}
                  {wWind !== "약한 바람" && (
                    <p className="font-semibold">{wWind}</p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
