// app/components/ScrollToTop.tsx (수정)
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. 스크롤 복원을 막기 위해 body에 클래스 추가
    console.log("Path changed:", pathname);
    document.body.classList.add("prevent-scroll-restore");

    // 2. bfcache 복원 이벤트 처리 (유지)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // 0ms 지연 후 강제 스크롤
        setTimeout(() => window.scrollTo(0, 0), 0);
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    // 3. 렌더링 완료 후 스크롤을 맨 위로 이동하고 클래스 제거
    const timer = setTimeout(() => {
      window.scrollTo(0, 0); // 강제 스크롤
      document.body.classList.remove("prevent-scroll-restore"); // 클래스 제거
      console.log("Scroll restoration prevented and finished.");
    }, 100); // 100ms 지연으로 충분한 시간을 확보

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pageshow", handlePageShow);
      // 컴포넌트 unmount 시 혹시 남아있는 클래스 제거
      document.body.classList.remove("prevent-scroll-restore");
    };
  }, [pathname]);

  return null;
}
