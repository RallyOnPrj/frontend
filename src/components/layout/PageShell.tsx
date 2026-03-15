import type { ReactNode } from "react";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";

interface PageShellProps {
  children: ReactNode;
  mainClassName?: string;
  disableFooter?: boolean;
  disableHeader?: boolean;
}

export default function PageShell({
  children,
  mainClassName,
  disableFooter = false,
  disableHeader = false,
}: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {!disableHeader && <MainHeader />}
      <main
        className={
          mainClassName
            ? `min-h-[calc(100vh-4rem)] flex-1 ${mainClassName}`
            : "min-h-[calc(100vh-4rem)] flex-1"
        }
      >
        {children}
      </main>
      {!disableFooter && <MainFooter />}
    </div>
  );
}
