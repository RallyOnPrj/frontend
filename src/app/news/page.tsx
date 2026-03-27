"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, LayoutGrid, Search } from "lucide-react";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";

type TabType = "domestic" | "announcements";

const TAB_META: Record<
  TabType,
  {
    label: string;
    badge: string;
    title: string;
    summary: string;
    note: string;
  }
> = {
  domestic: {
    label: "국내•해외뉴스",
    badge: "Coming Soon",
    title: "국내 배드민턴 뉴스 허브를 준비 중입니다",
    summary:
      "국내 협회 소식, 대회 결과, 동호인 커뮤니티 이슈를 정리해 제공할 예정입니다.",
    note:
      "국내외 배드민턴 주요 소식은 이 섹션에서 통합 제공될 예정입니다.",
  },
  announcements: {
    label: "공지사항",
    badge: "RallyOn Update",
    title: "랠리온 공지 섹션을 준비 중입니다",
    summary:
      "제품 업데이트, 점검 안내, 운영 공지는 같은 허브 구조 안에서 제공될 예정입니다.",
    note:
      "서비스 업데이트와 운영 공지는 이 섹션에서 제공될 예정입니다.",
  },
};

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("domestic");
  const currentMeta = useMemo(() => TAB_META[activeTab], [activeTab]);

  return (
    <PageShell mainClassName="bg-zinc-950">
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-500">
                <div className="h-px w-8 bg-emerald-500" />
                Information Center
              </div>
              <h1 className="font-display text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
                RallyOn Hub
              </h1>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search news..."
                disabled
                className="w-full rounded-none border-2 border-zinc-800 bg-zinc-900 px-10 py-2.5 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-8 flex gap-6 overflow-x-auto border-b-2 border-zinc-800 md:gap-8">
            {(Object.keys(TAB_META) as TabType[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 pb-4 text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? "border-emerald-400 text-emerald-400"
                    : "border-transparent text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                {TAB_META[tab].label}
              </button>
            ))}
          </div>

          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/news/article/${activeTab}`}
                  className="group relative mb-8 block overflow-hidden border-2 border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-emerald-500 md:p-8"
                >
                  <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl transition-colors group-hover:bg-emerald-500/20" />

                  <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="border border-emerald-500/30 bg-emerald-500/20 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                        {currentMeta.badge}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">
                        준비 중
                      </span>
                    </div>

                    <h2 className="mb-4 font-display text-2xl font-bold leading-tight text-white transition-colors group-hover:text-emerald-400 md:text-3xl">
                      {currentMeta.title}
                    </h2>

                    <p className="mb-8 max-w-3xl text-sm font-medium leading-relaxed text-zinc-400">
                      {currentMeta.summary}
                    </p>

                    <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        RallyOn Official
                      </span>
                      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-emerald-500 transition-colors group-hover:text-emerald-400">
                        Open Placeholder
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="border-2 border-dashed border-zinc-800 bg-zinc-900/60 px-6 py-8">
                  <p className="text-sm font-medium leading-relaxed text-zinc-400">
                    {currentMeta.note}
                  </p>
                </div>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link href="/court-manager">
                    <button
                      type="button"
                      className="inline-flex h-12 items-center justify-center rounded-none border-2 border-zinc-700 bg-transparent px-8 text-sm font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
                    >
                      코트매니저
                    </button>
                  </Link>
                  <Link href="/">
                    <button
                      type="button"
                      className="inline-flex h-12 items-center justify-center rounded-none bg-emerald-600 px-8 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-emerald-500"
                    >
                      <LayoutGrid className="mr-2 h-4 w-4" />
                      홈으로 이동
                    </button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
