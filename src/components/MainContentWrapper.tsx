// app/components/MainContentWrapper.tsx
"use client";
import { usePathname } from "next/navigation";

export function MainContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavPaths = ["/"];

  const paddingTopClass = hideNavPaths.includes(pathname) ? "" : "pt-12";

  return <main className={paddingTopClass}>{children}</main>;
}
