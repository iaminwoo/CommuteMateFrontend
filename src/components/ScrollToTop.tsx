"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. 라우팅 시 즉시 스크롤 시도
    window.scrollTo(0, 0);

    // 2. 렌더링 및 캐시 복원 후 스크롤을 강제하는 안전망
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100); // 100ms 지연으로 충분한 시간을 확보

    // 3. bfcache 복원 시 스크롤 강제
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [pathname]);

  return null;
}
