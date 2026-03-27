"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Activity,
  ArrowRight,
  ChevronRight,
  LayoutGrid,
  Trophy,
} from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <PageShell>
      <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 selection:bg-orange-500 selection:text-zinc-950">
        <main className="flex-1">
          <section className="relative flex min-h-[68vh] items-center overflow-hidden bg-zinc-950 pt-16 pb-20 lg:min-h-[78vh] lg:pt-24 lg:pb-24">
            <div className="pointer-events-none absolute right-0 bottom-0 h-[900px] w-[900px] translate-x-1/4 translate-y-1/4 md:h-[1400px] md:w-[1400px]">
              <motion.div
                className="relative h-full w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{ perspective: "1200px" }}
              >
                <motion.div
                  className="absolute inset-0 h-full w-full"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "rotateX(55deg) rotateZ(-35deg) translateZ(0)",
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966915_1px,transparent_1px),linear-gradient(to_bottom,#05966915_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />

                  <svg
                    viewBox="0 0 610 1340"
                    className="absolute inset-0 h-full w-full text-emerald-600 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.rect
                      x="5"
                      y="5"
                      width="600"
                      height="1330"
                      stroke="currentColor"
                      strokeWidth="8"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.8 }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                    />
                    <motion.line
                      x1="46"
                      y1="5"
                      x2="46"
                      y2="1335"
                      stroke="currentColor"
                      strokeWidth="4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                    />
                    <motion.line
                      x1="564"
                      y1="5"
                      x2="564"
                      y2="1335"
                      stroke="currentColor"
                      strokeWidth="4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                    />
                    <motion.line
                      x1="5"
                      y1="670"
                      x2="605"
                      y2="670"
                      stroke="currentColor"
                      strokeWidth="16"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                      style={{ transformOrigin: "center" }}
                    />
                    <motion.line
                      x1="5"
                      y1="670"
                      x2="605"
                      y2="670"
                      stroke="#fff"
                      strokeWidth="4"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 0.8 }}
                      transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                      style={{ transformOrigin: "center" }}
                    />
                    <motion.line
                      x1="5"
                      y1="472"
                      x2="605"
                      y2="472"
                      stroke="currentColor"
                      strokeWidth="4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1.5, ease: "easeInOut" }}
                    />
                    <motion.line
                      x1="5"
                      y1="868"
                      x2="605"
                      y2="868"
                      stroke="currentColor"
                      strokeWidth="4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1.5, ease: "easeInOut" }}
                    />
                    <motion.line
                      x1="5"
                      y1="76"
                      x2="605"
                      y2="76"
                      stroke="currentColor"
                      strokeWidth="4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1.8, ease: "easeInOut" }}
                    />
                    <motion.line
                      x1="5"
                      y1="1264"
                      x2="605"
                      y2="1264"
                      stroke="currentColor"
                      strokeWidth="4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1.8, ease: "easeInOut" }}
                    />
                    <motion.line
                      x1="305"
                      y1="76"
                      x2="305"
                      y2="472"
                      stroke="currentColor"
                      strokeWidth="4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 2.1, ease: "easeInOut" }}
                    />
                    <motion.line
                      x1="305"
                      y1="868"
                      x2="305"
                      y2="1264"
                      stroke="currentColor"
                      strokeWidth="4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 2.1, ease: "easeInOut" }}
                    />
                    <motion.rect
                      x="46"
                      y="472"
                      width="259"
                      height="198"
                      fill="currentColor"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.1, 0.05] }}
                      transition={{ duration: 2, delay: 3 }}
                    />
                    <motion.rect
                      x="305"
                      y="670"
                      width="259"
                      height="198"
                      fill="currentColor"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.1, 0.05] }}
                      transition={{ duration: 2, delay: 3.5 }}
                    />
                    <motion.circle
                      cx="305"
                      cy="670"
                      r="12"
                      fill="currentColor"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: 2.5 }}
                    />
                    <motion.circle
                      cx="305"
                      cy="670"
                      r="24"
                      fill="currentColor"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 3 }}
                    />
                    <motion.circle
                      cx="305"
                      cy="868"
                      r="8"
                      fill="currentColor"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 2.7 }}
                    />
                  </svg>
                </motion.div>
              </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6">
              <div className="flex max-w-3xl flex-col items-start text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  className="font-display text-6xl leading-[0.9] font-black uppercase tracking-tighter text-white sm:text-7xl md:text-8xl lg:text-9xl"
                >
                  JOIN <span className="text-emerald-500">RALLY</span>,
                  <br />
                  STAY ON <span className="text-emerald-500">RALLY</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                  className="mt-8 max-w-[500px] text-lg font-medium leading-relaxed text-zinc-400 md:text-xl"
                >
                  게임 생성부터 코트 운영, 배드민턴 소식까지.
                  <br className="hidden sm:block" />
                  RallyOn은 코트 안팎의 흐름을 간편하게 연결합니다.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                  className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center"
                >
                  <Link href="/court-manager">
                    <Button
                      size="lg"
                      className="h-14 w-full rounded-none bg-orange-500 px-8 text-sm font-bold uppercase tracking-widest text-zinc-950 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:bg-orange-400 active:translate-y-1 active:translate-x-1 active:shadow-none sm:w-auto"
                    >
                      Enter Operations
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/news" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 w-full rounded-none border-2 border-zinc-700 bg-transparent px-8 text-sm font-bold uppercase tracking-widest text-zinc-300 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] transition-all hover:border-zinc-500 hover:bg-zinc-800 hover:text-white active:translate-y-1 active:translate-x-1 active:shadow-none"
                    >
                      RallyOn Hub
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>

          <section id="features" className="relative border-t-2 border-zinc-200 bg-zinc-50 py-24 text-zinc-950">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mb-16 flex flex-col justify-between gap-8 md:mb-24 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <div className="mb-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-600">
                    <div className="h-px w-8 bg-emerald-600" />
                    Core Features
                  </div>
                  <h2 className="font-display text-4xl leading-none font-black uppercase tracking-tight text-zinc-950 sm:text-5xl md:text-6xl">
                    Everything you need
                    <br className="hidden sm:block" />
                    on the court
                  </h2>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    icon: Activity,
                    title: "코트매니저",
                    body: "복잡한 대진표 작성과 점수 기록을 디지털로 간편하게 관리하고 분석하세요. 주최자와 참가자 모두가 만족하는 운영 도구입니다.",
                    href: "/court-manager",
                    accent: "group-hover:text-emerald-600",
                    frame:
                      "group relative flex h-full flex-col border-2 border-zinc-200 bg-white p-8 transition-colors duration-300 hover:border-orange-500",
                    iconShell:
                      "mb-8 inline-flex h-14 w-14 items-center justify-center bg-zinc-950 text-orange-500 transition-colors duration-300 group-hover:bg-orange-500 group-hover:text-zinc-950",
                  },
                  {
                    icon: LayoutGrid,
                    title: "배드민턴 뉴스",
                    body: "국내외 배드민턴 주요 소식과 랠리온의 최신 업데이트를 가장 먼저 확인하세요. 플레이어에게 필요한 모든 정보를 한곳에 모았습니다.",
                    href: "/news",
                    accent: "group-hover:text-orange-600",
                    frame:
                      "group relative flex h-full flex-col border-2 border-zinc-200 bg-white p-8 transition-colors duration-300 hover:border-orange-500",
                    iconShell:
                      "mb-8 inline-flex h-14 w-14 items-center justify-center bg-zinc-950 text-orange-500 transition-colors duration-300 group-hover:bg-orange-500 group-hover:text-zinc-950",
                  },
                  {
                    icon: Trophy,
                    title: "대회 및 전적 검색",
                    body: "지역별, 급수별 맞춤 대회를 쉽게 찾고 참가 신청까지 한 번에 해결할 수 있는 전국 대회 탐색 기능이 곧 업데이트됩니다.",
                    href: "",
                    accent: "",
                    frame:
                      "group relative flex h-full flex-col border-2 border-dashed border-zinc-200 bg-zinc-50 p-8 opacity-80",
                    iconShell:
                      "mb-8 inline-flex h-14 w-14 items-center justify-center bg-zinc-200 text-zinc-500",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={item.frame}
                  >
                    <div className="mb-8 flex items-center justify-between">
                      <div className={item.iconShell}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      {item.href ? null : (
                        <span className="bg-zinc-200 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                          In Development
                        </span>
                      )}
                    </div>
                    <h3 className="mb-4 font-display text-2xl font-bold uppercase tracking-tight text-zinc-950">
                      {item.title}
                    </h3>
                    <p className="mb-8 flex-1 font-medium leading-relaxed text-zinc-600">
                      {item.body}
                    </p>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={`inline-flex items-center text-xs font-mono font-bold uppercase tracking-widest text-zinc-950 transition-colors ${item.accent}`}
                      >
                        {item.href === "/news" ? "Read News" : "Explore Tools"}
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    ) : (
                      <div className="inline-flex cursor-not-allowed items-center text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
                        Coming Soon
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative border-t-2 border-zinc-200 bg-white py-24 text-zinc-950">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid items-center gap-16 lg:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="order-2 lg:order-1"
                >
                  <div className="relative overflow-hidden border-2 border-zinc-900 bg-zinc-50 p-4 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                    <div className="mb-4 flex items-center justify-between border-b-2 border-zinc-200 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 rounded-none border border-emerald-200 bg-emerald-100 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700">
                          <span className="h-1.5 w-1.5 animate-pulse bg-emerald-500" />
                          Live
                        </div>
                        <div className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900">
                          강남구민체육관 랠리
                        </div>
                      </div>
                      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                        Round 02/03
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="relative flex flex-col gap-3 overflow-hidden border-2 border-emerald-600 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-500" />
                        <div className="flex items-center gap-3 pl-2">
                          <div className="flex h-8 w-8 items-center justify-center border border-emerald-200 bg-emerald-50 font-mono text-xs font-bold text-emerald-700">
                            01
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
                              Player A
                              <span className="text-[9px] font-mono font-normal text-zinc-400">
                                M/30s
                              </span>
                              <span className="text-zinc-300">/</span>
                              Player B
                              <span className="text-[9px] font-mono font-normal text-zinc-400">
                                F/20s
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs font-bold text-zinc-600">
                              Player C
                              <span className="text-[9px] font-mono font-normal text-zinc-400">
                                M/40s
                              </span>
                              <span className="text-zinc-300">/</span>
                              Player D
                              <span className="text-[9px] font-mono font-normal text-zinc-400">
                                M/20s
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <div className="flex items-center gap-1.5">
                            <div className="min-w-[36px] border-2 border-zinc-950 bg-zinc-950 px-2.5 py-1 text-center font-display text-lg font-bold text-white">
                              21
                            </div>
                            <div className="font-bold text-zinc-400">:</div>
                            <div className="min-w-[36px] border-2 border-zinc-300 bg-white px-2.5 py-1 text-center font-display text-lg font-bold text-zinc-950">
                              18
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative flex flex-col gap-3 overflow-hidden border-2 border-emerald-600 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-500" />
                        <div className="flex items-center gap-3 pl-2">
                          <div className="flex h-8 w-8 items-center justify-center border border-emerald-200 bg-emerald-50 font-mono text-xs font-bold text-emerald-700">
                            02
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
                              Player E
                              <span className="text-[9px] font-mono font-normal text-zinc-400">
                                F/30s
                              </span>
                              <span className="text-zinc-300">/</span>
                              Player F
                              <span className="text-[9px] font-mono font-normal text-zinc-400">
                                M/30s
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs font-bold text-zinc-600">
                              Player G
                              <span className="text-[9px] font-mono font-normal text-zinc-400">
                                F/30s
                              </span>
                              <span className="text-zinc-300">/</span>
                              Player H
                              <span className="text-[9px] font-mono font-normal text-zinc-400">
                                M/20s
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <div className="flex items-center gap-1.5">
                            <div className="min-w-[36px] border-2 border-zinc-300 bg-white px-2.5 py-1 text-center font-display text-lg font-bold text-zinc-950">
                              14
                            </div>
                            <div className="font-bold text-zinc-400">:</div>
                            <div className="min-w-[36px] border-2 border-zinc-300 bg-white px-2.5 py-1 text-center font-display text-lg font-bold text-zinc-950">
                              15
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-2 border-dashed border-zinc-200 bg-zinc-50 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center bg-zinc-200 font-mono text-xs font-bold text-zinc-500">
                            03
                          </div>
                          <div className="text-xs font-bold text-zinc-400">
                            대기 중인 코트
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 rounded-none border-zinc-300 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
                        >
                          배정하기
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t-2 border-zinc-200 pt-4">
                      <div className="flex items-center gap-4">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                          <span className="text-zinc-900">8</span> Players
                        </div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                          <span className="text-emerald-600">2</span> Active
                        </div>
                      </div>
                      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                        Elapsed: 01:24:00
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="order-1 lg:order-2">
                  <div className="mb-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-600">
                    <div className="h-px w-8 bg-emerald-600" />
                    Core Feature
                  </div>
                  <h2 className="mb-6 font-display text-4xl leading-none font-black uppercase tracking-tight text-zinc-950 sm:text-5xl">
                    스마트
                    <br />
                    <span className="text-emerald-600">코트매니저</span>
                  </h2>
                  <p className="mb-8 max-w-lg text-lg font-medium leading-relaxed text-zinc-600">
                    종이 대진표와 화이트보드는 이제 그만. 직관적인 디지털 보드로 클럽 모임과 소규모 교류전을 완벽하게 지배하세요.
                  </p>

                  <ul className="mb-10 space-y-5">
                    {[
                      "드래그 앤 드롭으로 빠르고 정확한 코트 배정",
                      "경기 결과 입력 시 승패와 득실차 자동 계산",
                      "게임 링크를 쉽게 공유하고 어디서든 운영 현황 확인",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start text-sm font-medium text-zinc-700"
                      >
                        <div className="mr-3 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-emerald-200 bg-emerald-100 text-emerald-600">
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/court-manager">
                    <Button
                      size="lg"
                      className="h-14 rounded-none bg-zinc-950 px-8 text-sm font-bold uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(16,185,129,1)] transition-all hover:bg-zinc-800 active:translate-y-1 active:translate-x-1 active:shadow-none"
                    >
                      Launch Manager
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden border-t-2 border-zinc-800 bg-zinc-950 py-32 text-white">
            <div className="pointer-events-none absolute top-0 right-0 h-[800px] w-[800px] translate-x-1/3 -translate-y-1/3 rounded-full bg-orange-500/5 blur-[120px]" />

            <div className="container relative z-10 mx-auto px-4 md:px-6">
              <div className="grid items-center gap-16 lg:grid-cols-2">
                <div>
                  <div className="mb-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-orange-500">
                    <div className="h-px w-8 bg-orange-500" />
                    In Development
                  </div>
                  <h2 className="mb-8 font-display text-4xl leading-none font-black uppercase tracking-tight text-white sm:text-5xl md:text-6xl">
                    정식 대회
                    <br />
                    <span className="text-zinc-500">운영 예정</span>
                  </h2>
                  <p className="mb-10 max-w-lg text-lg font-medium leading-relaxed text-zinc-400">
                    참가비 결제, 예선/본선 토너먼트 대진표 등 대규모 대회 운영을 위한 통합 솔루션을 개발하고 있습니다. 랠리온의 다음 메이저 업데이트를 기대해주세요.
                  </p>

                  <ul className="mb-12 space-y-6">
                    {[
                      "대규모 토너먼트 대진표 자동 생성",
                      "참가비 결제 및 환불 시스템 연동",
                      "실시간 대회 결과 및 랭킹 집계",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center font-medium text-zinc-400"
                      >
                        <div className="mr-4 flex h-6 w-6 items-center justify-center border border-zinc-800 bg-zinc-900 text-orange-500">
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Button
                    disabled
                    className="h-14 w-full cursor-not-allowed rounded-none border border-zinc-800 bg-zinc-900 px-8 text-sm font-bold uppercase tracking-widest text-zinc-500 sm:w-auto"
                  >
                    Coming Soon
                  </Button>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="relative opacity-70 [perspective:1000px]"
                >
                  <div className="relative overflow-hidden border-2 border-dashed border-zinc-700 bg-zinc-950 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 [transform:rotateY(-5deg)_rotateX(5deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)]">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]" />

                    <div className="relative z-10">
                      <div className="mb-6 flex items-center justify-between border-b-2 border-dashed border-zinc-800 pb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-zinc-800" />
                          <div className="h-2 w-2 bg-zinc-800" />
                          <div className="h-2 w-2 bg-zinc-800" />
                        </div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-600">
                          Tournament Dashboard
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((court) => (
                          <div
                            key={court}
                            className="relative overflow-hidden border-2 border-dashed border-zinc-800 bg-zinc-900/30 p-4"
                          >
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between border-b border-dashed border-zinc-800 pb-2">
                                <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">
                                  Court 0{court}
                                </span>
                                <span className="border border-zinc-800 bg-zinc-900 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                                  Waiting
                                </span>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-xs font-medium text-zinc-600">
                                    Player A / Player B
                                  </span>
                                  <span className="font-display text-lg leading-none font-bold text-zinc-700">
                                    0
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-xs font-medium text-zinc-600">
                                    Player C / Player D
                                  </span>
                                  <span className="font-display text-lg leading-none font-bold text-zinc-700">
                                    0
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="relative flex min-h-[42rem] items-center overflow-hidden border-t-2 border-zinc-950 bg-emerald-600 py-40 md:min-h-[48rem] md:py-48">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
              <svg
                viewBox="0 0 610 1340"
                className="max-h-[200%] h-auto w-full rotate-90 text-zinc-950"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="5" y="5" width="600" height="1330" stroke="currentColor" strokeWidth="10" />
                <line x1="46" y1="5" x2="46" y2="1335" stroke="currentColor" strokeWidth="10" />
                <line x1="564" y1="5" x2="564" y2="1335" stroke="currentColor" strokeWidth="10" />
                <line x1="5" y1="670" x2="605" y2="670" stroke="currentColor" strokeWidth="24" />
                <line x1="5" y1="472" x2="605" y2="472" stroke="currentColor" strokeWidth="10" />
                <line x1="5" y1="868" x2="605" y2="868" stroke="currentColor" strokeWidth="10" />
                <line x1="5" y1="76" x2="605" y2="76" stroke="currentColor" strokeWidth="10" />
                <line x1="5" y1="1264" x2="605" y2="1264" stroke="currentColor" strokeWidth="10" />
                <line x1="305" y1="76" x2="305" y2="472" stroke="currentColor" strokeWidth="10" />
                <line x1="305" y1="868" x2="305" y2="1264" stroke="currentColor" strokeWidth="10" />
              </svg>
            </div>

            <div className="container relative z-10 mx-auto px-4 text-center md:px-6">
              <h2 className="mb-6 font-display text-5xl leading-none font-black uppercase tracking-tighter text-zinc-950 sm:text-6xl md:text-7xl">
                Ready to Serve?
              </h2>
              <p className="mx-auto mb-12 max-w-2xl text-lg font-medium text-zinc-800 md:text-xl">
                수천 명의 플레이어와 수백 개의 대회가 당신을 기다리고 있습니다. RallyOn과 함께 새로운 배드민턴 라이프를 시작하세요.
              </p>
              <Link href="/court-manager">
                <Button
                  size="lg"
                  className="h-16 rounded-none bg-zinc-950 px-10 text-base font-bold uppercase tracking-widest text-orange-500 shadow-[6px_6px_0px_0px_rgba(249,115,22,1)] transition-all hover:bg-zinc-800 active:translate-y-1 active:translate-x-1 active:shadow-none"
                >
                  Initialize Account
                </Button>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </PageShell>
  );
}
