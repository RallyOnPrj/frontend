"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Activity, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Game, getGameById, getGameStatusLabel } from "@/lib/game";
import {
  getRecentGameIds,
  replaceRecentGameIds,
} from "@/lib/recent-games";

export default function ManagerDashboard() {
  const { isLoading, isLoggedIn } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const createHref = isLoggedIn
    ? "/court-manager/create"
    : "/login?returnTo=%2Fcourt-manager%2Fcreate";

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    let cancelled = false;

    const loadGames = async () => {
      setIsLoadingGames(true);
      const ids = getRecentGameIds();
      const loadedGames = (
        await Promise.all(ids.map((id) => getGameById(id)))
      ).filter((game): game is Game => Boolean(game));

      if (cancelled) {
        return;
      }

      replaceRecentGameIds(loadedGames.map((game) => game.id));
      setGames(loadedGames);
      setIsLoadingGames(false);
    };

    void loadGames();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto max-w-6xl px-4 py-8 md:px-8 lg:py-12">
        <div className="mb-12">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-600">
            <div className="h-px w-8 bg-emerald-600" />
            Operations Desk
          </div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-zinc-950 md:text-5xl">
            Court Manager
          </h1>
        </div>

        <div className="mb-16 grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="group relative col-span-1 overflow-hidden rounded-none border-2 border-zinc-950 bg-zinc-950 text-white shadow-xl md:col-span-2"
          >
            <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-1/2 overflow-hidden opacity-20">
              <div className="absolute top-[-20%] right-[-10%] h-[140%] w-[120%] rotate-[15deg] skew-x-[-15deg] border border-emerald-500" />
              <div className="absolute top-[10%] right-[10%] h-[80%] w-[80%] rotate-[15deg] skew-x-[-15deg] border border-emerald-400" />
              <div className="absolute top-[40%] right-[30%] h-[20%] w-[40%] rotate-[15deg] skew-x-[-15deg] border border-emerald-300 bg-emerald-500/10" />
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-10">
              <div>
                <h2 className="mb-4 font-display text-3xl font-bold uppercase tracking-tight">
                  자유 게임 생성
                </h2>
                <p className="mb-8 max-w-md text-sm font-medium leading-relaxed text-zinc-400 md:text-base">
                  클럽 모임이나 지인들과의 가벼운 경기를 위한 대진표를 만들고 점수를 기록하세요. 실시간 코트 배정과 결과 집계가 지원됩니다.
                </p>
              </div>
              <Link href={createHref} className="block w-full sm:w-auto">
                <Button className="h-14 w-full rounded-none bg-orange-500 px-8 text-sm font-bold uppercase tracking-widest text-zinc-950 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:bg-orange-400 active:translate-y-1 active:translate-x-1 active:shadow-none sm:w-auto">
                  {isLoggedIn ? "Initialize Game" : "Login to Initialize"}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!isLoggedIn ? (
                <p className="mt-4 max-w-md text-xs font-medium uppercase tracking-widest text-zinc-500">
                  코트 생성과 실시간 운영은 로그인 후 사용할 수 있습니다.
                </p>
              ) : null}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative col-span-1 flex flex-col overflow-hidden rounded-none border-2 border-dashed border-zinc-300 bg-zinc-100 p-8"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(#a1a1aa 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            <h2 className="relative z-10 font-display text-2xl font-bold uppercase tracking-tight text-zinc-800">
              정식 대회 운영 <span className="ml-1 text-lg font-normal text-zinc-400">(준비 중)</span>
            </h2>

            <div className="relative z-10 mt-4 mb-6">
              <span className="inline-flex items-center gap-1.5 border border-orange-200 bg-orange-50 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-orange-600">
                <span className="h-1.5 w-1.5 animate-pulse bg-orange-500" />
                In Development
              </span>
            </div>

            <p className="relative z-10 mb-8 flex-1 text-sm font-medium leading-relaxed text-zinc-500">
              참가비 결제, 예선/본선 토너먼트 대진표 등 대규모 대회 운영을 위한 통합 솔루션은 다음 단계에서 확장합니다.
            </p>

            <Button
              disabled
              className="relative z-10 h-12 w-full cursor-not-allowed rounded-none border border-zinc-300 bg-zinc-200/50 text-xs font-bold uppercase tracking-widest text-zinc-500"
            >
              정식 대회 운영 기능 준비 중
            </Button>
          </motion.div>
        </div>

        <div>
          <div className="mb-6 flex items-center justify-between border-b-2 border-zinc-950 pb-4">
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-zinc-950">
              Active Sessions
            </h3>
          </div>

          <div className="overflow-hidden rounded-none border-2 border-zinc-200 bg-white">
              <div className="grid grid-cols-12 gap-4 border-b-2 border-zinc-200 bg-zinc-50 px-6 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                <div className="col-span-5 md:col-span-4">Session Name</div>
                <div className="col-span-4 md:col-span-3 hidden sm:block">Share Code</div>
                <div className="col-span-3 md:col-span-2 text-center">Courts</div>
                <div className="col-span-4 md:col-span-3 text-right">Status</div>
              </div>

            {!isLoggedIn ? (
              <div className="flex flex-col items-center justify-center bg-zinc-50/50 px-6 py-12 text-center">
                <Activity className="mb-3 h-8 w-8 text-zinc-300" />
                <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                  Login Required
                </p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
                  최근 세션 확인과 경기 운영 기능은 로그인 후 사용할 수 있습니다.
                </p>
                <Link href="/login?returnTo=%2Fcourt-manager" className="mt-6">
                  <Button className="h-12 rounded-none bg-zinc-950 px-6 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-zinc-800">
                    Login to View Sessions
                  </Button>
                </Link>
              </div>
            ) : isLoadingGames ? (
              <div className="flex flex-col items-center justify-center bg-zinc-50/50 py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                <p className="mt-4 text-xs font-mono uppercase tracking-widest text-zinc-400">
                  Loading Sessions
                </p>
              </div>
            ) : games.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-zinc-50/50 py-12 text-center">
                <Activity className="mb-3 h-8 w-8 text-zinc-300" />
                <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                  No Active Sessions
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  이 브라우저에서 생성하거나 연 세션이 여기에 표시됩니다.
                </p>
              </div>
            ) : (
              games.map((game) => (
                <Link
                  key={game.id}
                  href={`/court-manager/game/${game.id}`}
                  className="group grid grid-cols-12 items-center gap-4 border-b-2 border-zinc-100 px-6 py-4 transition-colors hover:bg-zinc-50"
                >
                  <div className="col-span-5 md:col-span-4">
                    <div className="text-sm font-bold text-zinc-950 transition-colors group-hover:text-emerald-600">
                      {game.title}
                    </div>
                    <div className="mt-1 text-[10px] font-mono text-zinc-500">
                      {game.participants.length} Participants
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-3 hidden sm:block">
                    <div className="text-xs font-bold text-zinc-700">
                      {game.shareCode}
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-2 text-center">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-none border-2 border-zinc-200 bg-zinc-100 text-xs font-bold text-zinc-700">
                      {game.courtCount}
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-3 flex items-center justify-end gap-3 text-right">
                    <div className="inline-flex items-center gap-1.5 rounded-none border border-emerald-200 bg-emerald-50 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-700">
                      <span className="h-1.5 w-1.5 animate-pulse bg-emerald-500" />
                      {getGameStatusLabel(game.status)}
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-300 transition-all group-hover:translate-x-1 group-hover:text-emerald-500" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
