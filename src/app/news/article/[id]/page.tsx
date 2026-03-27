"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  Pin,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";

export default function ArticleDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "coming-soon";

  return (
    <PageShell mainClassName="bg-zinc-950">
      <div className="min-h-screen bg-zinc-950 pb-20 text-zinc-100">
        <div className="sticky top-16 z-30 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
          <div className="container mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
            <Link
              href="/news"
              className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Hub</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <main className="container mx-auto max-w-3xl px-4 py-8 md:py-16">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
          <header className="mb-10 md:mb-16">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex items-center gap-1.5 border border-orange-500/20 bg-orange-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-500">
                <Pin className="h-3 w-3" />
                Placeholder
              </div>
              <span className="border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                Coming Soon
              </span>
              <span className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
                <Calendar className="h-3 w-3" />
                {id}
              </span>
            </div>

            <h1 className="mb-6 font-display text-3xl leading-[1.15] font-black tracking-tight text-white md:text-4xl lg:text-5xl">
              실제 뉴스 기사 상세는 다음 단계에서 연결됩니다
            </h1>

            <div className="flex items-center gap-3 border-y border-zinc-800/60 py-4">
              <div className="flex h-8 w-8 items-center justify-center bg-emerald-900 font-display text-xs font-bold text-emerald-400">
                R
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-zinc-300">
                  RallyOn Official
                </div>
                <div className="mt-0.5 text-[10px] font-mono text-zinc-500">
                  Content Placeholder
                </div>
              </div>
            </div>
          </header>

          <div className="mb-16 max-w-none space-y-8 text-zinc-300">
            <div className="space-y-6 text-zinc-300 leading-relaxed font-medium">
              <p>
                이 화면은 `rallyOn` 기사 상세 구조를 그대로 유지한 placeholder입니다. 실제 뉴스 데이터, 공지 본문, 외부 원문 링크는 별도 콘텐츠 소스 정리 후 연결합니다.
              </p>
              <div className="border-l-4 border-emerald-500 bg-zinc-900/50 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-emerald-400">
                  <div className="h-1.5 w-1.5 bg-emerald-500" />
                  이번 이슈 범위
                </h3>
                <ul className="list-inside list-disc space-y-3 text-zinc-400">
                  <li>뉴스 허브의 시각 구조를 `rallyOn` 원본과 맞춥니다.</li>
                  <li>mock 기사 데이터는 포함하지 않습니다.</li>
                  <li>실제 기사/공지 콘텐츠 연결은 후속 이슈로 넘깁니다.</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                  <div className="h-1.5 w-1.5 bg-zinc-500" />
                  다음 단계
                </h3>
                <p className="text-zinc-400">
                  외부 CMS 또는 백엔드 콘텐츠 API가 준비되면 이 placeholder를 실제 기사 본문 렌더러로 교체합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-zinc-800 py-8">
            <Link
              href="/news"
              className="group inline-flex w-full items-center justify-center bg-emerald-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-emerald-500 sm:w-auto"
            >
              뉴스 허브로 돌아가기
              <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          </motion.article>

          <div className="mt-16 border-t-4 border-zinc-900 pt-12">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400">
              <div className="h-1.5 w-1.5 bg-zinc-600" />
              Related Placeholders
            </h3>
            <div className="grid gap-4">
              {["허브 메인으로 이동", "코트매니저 확인", "홈으로 복귀"].map((item, index) => (
                <Link
                  key={item}
                  href={index === 0 ? "/news" : index === 1 ? "/court-manager" : "/"}
                  className="group flex flex-col justify-between gap-4 border border-zinc-800/50 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-700 hover:bg-zinc-900 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="mb-2 text-[10px] font-mono text-zinc-500">
                      Placeholder
                    </div>
                    <h4 className="text-sm font-bold leading-snug text-zinc-300 transition-colors group-hover:text-emerald-400">
                      {item}
                    </h4>
                  </div>
                  <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 transition-colors group-hover:bg-emerald-500/20 sm:flex">
                    <ArrowUpRight className="h-4 w-4 text-zinc-500 group-hover:text-emerald-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </PageShell>
  );
}
