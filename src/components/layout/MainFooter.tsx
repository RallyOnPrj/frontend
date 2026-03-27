import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function MainFooter() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
              <Logo variant="dark" className="h-8" />
            </Link>
            <p className="max-w-xs text-sm font-medium text-zinc-500">
              배드민턴 플레이어, 대회 참가자, 그리고 커뮤니티를 위한 가장 스마트한 플랫폼.
            </p>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-teal-400">
              Join Rally, Stay On Rally
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300">
                서비스
              </h4>
              <ul className="space-y-2 text-sm font-medium text-zinc-500">
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    대회 찾기
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    커뮤니티
                  </Link>
                </li>
                <li>
                  <Link href="/court-manager" className="transition-colors hover:text-white">
                    경기 관리
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    클럽 찾기
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300">
                고객 지원
              </h4>
              <ul className="space-y-2 text-sm font-medium text-zinc-500">
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    공지사항
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    자주 묻는 질문
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-white">
                    개인정보처리방침
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-900 pt-8 text-center sm:flex-row sm:text-left">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-600">
            &copy; {new Date().getFullYear()} RallyOn. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-zinc-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-zinc-500 transition-colors hover:text-white"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              <span className="sr-only">Facebook</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-zinc-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-zinc-500 transition-colors hover:text-white"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span className="sr-only">Instagram</span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
