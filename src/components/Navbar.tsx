"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const hideNavPaths = ["/"];

  if (hideNavPaths.includes(pathname)) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#5E734F] py-2 px-4 flex items-center justify-between z-50 shadow-md">
      <div className="flex gap-2 items-center justify-between">
        <div className="relative w-10 h-10">
          <Image
            src="/busppang.png"
            alt="출근빵 로고"
            width={35}
            height={35}
            className="object-cover rounded-xl"
          />
        </div>
        <span className="font-bold text-white text-lg">출근빵</span>
      </div>

      <div className="flex gap-2 font-semibold">
        <button
          className="bg-[#EAF5D4] px-3 py-1 rounded hover:bg-blue-600"
          onClick={() => router.push("/check")}
        >
          근무조회
        </button>
        <button
          className="bg-[#EAF5D4] px-3 py-1 rounded hover:bg-blue-600"
          onClick={() => router.push("/")}
        >
          메인으로
        </button>
      </div>
    </nav>
  );
}
