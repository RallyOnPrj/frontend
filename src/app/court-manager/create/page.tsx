"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { createFreeGame, Grade } from "@/lib/game";
import { pushRecentGameId } from "@/lib/recent-games";

type LocalParticipant = {
  id: string;
  name: string;
  gender: "M" | "F";
  ageGroup: string;
  level: Grade;
  gamesAssigned: number;
};

type LocalCourt = {
  id: string;
  assignedParticipants: LocalParticipant[];
};

type LocalRound = {
  id: string;
  courts: LocalCourt[];
};

const AGE_GROUP_OPTIONS = ["10s", "20s", "30s", "40s", "50s", "60s"];
const LEVEL_OPTIONS: Grade[] = ["ROOKIE", "D", "C", "B", "A", "S", "SS"];

function buildCourts(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `court-${index + 1}`,
    assignedParticipants: [],
  }));
}

function createInitialRounds(courtCount: number, roundCount: number): LocalRound[] {
  return Array.from({ length: roundCount }, (_, index) => ({
    id: `round-${index + 1}`,
    courts: buildCourts(courtCount),
  }));
}

function recalculateAssignments(
  participants: LocalParticipant[],
  rounds: LocalRound[]
): LocalParticipant[] {
  return participants.map((participant) => {
    const gamesAssigned = rounds.reduce(
      (total, round) =>
        total +
        round.courts.reduce(
          (courtTotal, court) =>
            courtTotal +
            court.assignedParticipants.filter((player) => player.id === participant.id)
              .length,
          0
        ),
      0
    );

    return { ...participant, gamesAssigned };
  });
}

const BadmintonCourt = ({
  court,
  roundId,
  participantToAssign,
  assignParticipant,
}: {
  court: LocalCourt;
  roundId: string;
  participantToAssign: LocalParticipant | null;
  assignParticipant: (roundId: string, courtId: string) => void;
}) => {
  return (
    <div className="relative flex aspect-[2/1] flex-col justify-between overflow-hidden rounded-none border-4 border-slate-900 bg-emerald-700 p-2 shadow-inner">
      <div className="pointer-events-none absolute inset-2 border-2 border-white/30" />
      <div className="pointer-events-none absolute top-1 bottom-1 left-1/2 w-1 -translate-x-1/2 bg-white/50" />
      <div className="pointer-events-none absolute top-1/2 left-2 right-2 h-0.5 -translate-y-1/2 bg-white/30" />
      <div className="pointer-events-none absolute top-2 bottom-2 left-[35%] w-0.5 bg-white/30" />
      <div className="pointer-events-none absolute top-2 bottom-2 right-[35%] w-0.5 bg-white/30" />

      <div className="relative z-10 grid h-full w-full grid-cols-2 grid-rows-2">
        {[0, 1, 2, 3].map((index) => {
          const participant = court.assignedParticipants[index];

          return (
            <div key={index} className="flex items-center justify-center p-1">
              {participant ? (
                <div className="flex min-w-[64px] max-w-[90%] flex-col items-center justify-center rounded-none border-2 border-slate-900 bg-white px-2 py-1 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <div className="w-full truncate text-center text-[10px] leading-tight font-bold text-slate-900">
                    {participant.name}
                  </div>
                  <div className="mt-0.5 text-[8px] font-mono font-bold uppercase tracking-widest text-slate-500">
                    {participant.gender}/{participant.ageGroup}
                  </div>
                </div>
              ) : participantToAssign ? (
                <button
                  type="button"
                  onClick={() => assignParticipant(roundId, court.id)}
                  className="flex h-full max-h-[28px] w-full max-w-[70px] items-center justify-center rounded-none border-2 border-slate-900 bg-teal-400 text-[9px] font-bold uppercase tracking-widest text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:bg-teal-300 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
                >
                  Assign
                </button>
              ) : (
                <div className="h-1.5 w-1.5 rounded-none bg-white/30" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function CreateFreeGamePage() {
  const { isLoading, isLoggedIn } = useAuth();
  const [step, setStep] = useState(1);
  const [gameName, setGameName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [courts, setCourts] = useState(2);
  const [roundCount, setRoundCount] = useState(1);
  const [rounds, setRounds] = useState<LocalRound[]>(createInitialRounds(2, 1));
  const [participants, setParticipants] = useState<LocalParticipant[]>([]);
  const [participantToAssign, setParticipantToAssign] =
    useState<LocalParticipant | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    gender: "M" as "M" | "F",
    ageGroup: "20s",
    level: "C" as Grade,
  });
  const [createdGameId, setCreatedGameId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      window.location.href = "/login?returnTo=/court-manager/create";
    }
  }, [isLoading, isLoggedIn]);

  const addRoundBlock = () => {
    setRounds((prev) => [
      ...prev,
      { id: `round-${prev.length + 1}`, courts: buildCourts(courts) },
    ]);
  };

  const addCourtToRound = (roundId: string) => {
    setRounds((prev) =>
      prev.map((round) =>
        round.id === roundId
          ? {
              ...round,
              courts: [
                ...round.courts,
                {
                  id: `court-${round.courts.length + 1}`,
                  assignedParticipants: [],
                },
              ],
            }
          : round
      )
    );
  };

  const assignParticipant = (roundId: string, courtId: string) => {
    if (!participantToAssign) {
      return;
    }

    const nextRounds = rounds.map((round) =>
      round.id === roundId
        ? {
            ...round,
            courts: round.courts.map((court) =>
              court.id === courtId && court.assignedParticipants.length < 4
                ? {
                    ...court,
                    assignedParticipants: [
                      ...court.assignedParticipants,
                      participantToAssign,
                    ],
                  }
                : court
            ),
          }
        : round
    );

    setRounds(nextRounds);
    setParticipants((prev) => recalculateAssignments(prev, nextRounds));
    setParticipantToAssign(null);
  };

  const addParticipant = () => {
    if (!newParticipant.name.trim()) {
      return;
    }

    const nextParticipant: LocalParticipant = {
      id: String(participantCount + 1),
      name: newParticipant.name.trim(),
      gender: newParticipant.gender,
      ageGroup: newParticipant.ageGroup,
      level: newParticipant.level,
      gamesAssigned: 0,
    };

    setParticipants((prev) => [...prev, nextParticipant]);
    setParticipantCount((prev) => prev + 1);
    setNewParticipant({
      name: "",
      gender: "M",
      ageGroup: "20s",
      level: "C",
    });
  };

  const removeParticipant = (participantId: string) => {
    const nextRounds = rounds.map((round) => ({
      ...round,
      courts: round.courts.map((court) => ({
        ...court,
        assignedParticipants: court.assignedParticipants.filter(
          (participant) => participant.id !== participantId
        ),
      })),
    }));
    const nextParticipants = participants.filter(
      (participant) => participant.id !== participantId
    );
    setRounds(nextRounds);
    setParticipants(recalculateAssignments(nextParticipants, nextRounds));
    if (participantToAssign?.id === participantId) {
      setParticipantToAssign(null);
    }
  };

  const handleNext = async () => {
    setSubmitError("");

    if (step === 1) {
      setRounds(createInitialRounds(courts, roundCount));
      setStep(2);
      return;
    }

    if (step === 3) {
      setIsSubmitting(true);
      try {
        const result = await createFreeGame({
          title: gameName.trim() || "Weekend Morning Rally",
          courtCount: rounds.reduce(
            (max, round) => Math.max(max, round.courts.length),
            courts
          ),
          roundCount: rounds.length,
          gradeType: "REGIONAL",
          matchRecordMode: "RESULT",
          participants: participants.map((participant) => ({
            originalName: participant.name,
            gender: participant.gender === "M" ? "MALE" : "FEMALE",
            grade: participant.level,
            ageGroup: Number(participant.ageGroup.replace("s", "")) as 10 | 20 | 30 | 40 | 50 | 60,
          })),
        });

        const gameId = String(result.gameId);
        pushRecentGameId(gameId);
        setCreatedGameId(gameId);
        setStep(4);
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "세션 생성에 실패했습니다."
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setSubmitError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  const stepLabels = [
    "Configuration",
    "Roster",
    "Court Assignment",
    "System Ready",
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:px-8 lg:py-12">
      <div className="mb-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-1 text-[10px] font-mono uppercase tracking-widest text-teal-600">
              Module 01
            </div>
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-slate-900 md:text-3xl">
              Initialize Session
            </h1>
          </div>
          <div className="hidden items-center gap-2 text-[10px] font-mono uppercase tracking-widest sm:flex">
            <span className="text-slate-400">Phase</span>
            <span className="text-lg leading-none font-bold text-teal-600">
              {String(step).padStart(2, "0")}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400">04</span>
          </div>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex-1">
              <div className="mb-2 h-1.5 w-full overflow-hidden rounded-sm bg-slate-200">
                <div
                  className={`h-full bg-teal-500 transition-transform duration-500 ease-in-out ${
                    step >= index ? "translate-x-0" : "-translate-x-full"
                  }`}
                  style={{ transformOrigin: "left" }}
                />
              </div>
              <div
                className={`text-[9px] font-mono uppercase tracking-widest ${
                  step >= index ? "font-bold text-slate-900" : "text-slate-400"
                }`}
              >
                {stepLabels[index - 1]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex min-h-[500px] flex-col overflow-hidden rounded-sm border-2 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <div className="absolute top-0 left-0 h-4 w-4 border-r-2 border-b-2 border-slate-200" />
        <div className="absolute top-0 right-0 h-4 w-4 border-b-2 border-l-2 border-slate-200" />
        <div className="absolute bottom-0 left-0 h-4 w-4 border-t-2 border-r-2 border-slate-200" />
        <div className="absolute right-0 bottom-0 h-4 w-4 border-t-2 border-l-2 border-slate-200" />

        <div className="z-10 flex-1 p-6 md:p-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-2xl space-y-8"
              >
                <div className="mb-8 border-b-2 border-slate-100 pb-4">
                  <h2 className="font-display text-2xl font-bold uppercase text-slate-900">
                    Configuration
                  </h2>
                  <p className="mt-2 text-sm font-mono text-slate-500">
                    Enter basic parameters for the session.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-900">
                      Session Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Weekend Morning Rally"
                      className="w-full rounded-none border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium transition-colors focus:border-slate-900 focus:bg-white focus:outline-none"
                      value={gameName}
                      onChange={(event) => setGameName(event.target.value)}
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-900">
                        Date & Time
                      </label>
                      <div className="relative">
                        <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="datetime-local"
                          className="w-full rounded-none border-2 border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm font-medium transition-colors focus:border-slate-900 focus:bg-white focus:outline-none"
                          value={date}
                          onChange={(event) => setDate(event.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-900">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search venue"
                          className="w-full rounded-none border-2 border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm font-medium transition-colors focus:border-slate-900 focus:bg-white focus:outline-none"
                          value={location}
                          onChange={(event) => setLocation(event.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 border-t-2 border-slate-100 pt-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-900">
                        Active Courts
                      </label>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 rounded-none border-2 border-slate-200 text-slate-600 hover:border-slate-900 hover:bg-slate-50"
                          onClick={() => setCourts((prev) => Math.max(1, prev - 1))}
                        >
                          -
                        </Button>
                        <div className="flex h-12 w-20 items-center justify-center border-2 border-slate-900 bg-slate-900 font-display text-xl font-bold text-white">
                          {String(courts).padStart(2, "0")}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 rounded-none border-2 border-slate-200 text-slate-600 hover:border-slate-900 hover:bg-slate-50"
                          onClick={() => setCourts((prev) => prev + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-900">
                        Active Round
                      </label>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 rounded-none border-2 border-slate-200 text-slate-600 hover:border-slate-900 hover:bg-slate-50"
                          onClick={() => setRoundCount((prev) => Math.max(1, prev - 1))}
                        >
                          -
                        </Button>
                        <div className="flex h-12 w-20 items-center justify-center border-2 border-slate-900 bg-slate-900 font-display text-xl font-bold text-white">
                          {String(roundCount).padStart(2, "0")}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 rounded-none border-2 border-slate-200 text-slate-600 hover:border-slate-900 hover:bg-slate-50"
                          onClick={() => setRoundCount((prev) => prev + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="mb-8 flex items-end justify-between border-b-2 border-slate-100 pb-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold uppercase text-slate-900">
                      Roster Assembly
                    </h2>
                    <p className="mt-2 text-sm font-mono text-slate-500">
                      Add participants and assign levels.
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="mb-1 text-[10px] font-mono uppercase tracking-widest text-slate-400">
                      Total Count
                    </span>
                    <div className="font-display text-3xl leading-none font-bold text-teal-600">
                      {String(participants.length).padStart(2, "0")}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    className="flex-1 rounded-none border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium transition-colors focus:border-slate-900 focus:bg-white focus:outline-none"
                    value={newParticipant.name}
                    onChange={(event) =>
                      setNewParticipant((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        addParticipant();
                      }
                    }}
                  />
                  <select
                    className="w-20 rounded-none border-2 border-slate-200 bg-slate-50 px-2 py-3 text-sm font-medium transition-colors focus:border-slate-900 focus:bg-white focus:outline-none"
                    value={newParticipant.gender}
                    onChange={(event) =>
                      setNewParticipant((prev) => ({
                        ...prev,
                        gender: event.target.value as "M" | "F",
                      }))
                    }
                  >
                    <option value="M">M</option>
                    <option value="F">F</option>
                  </select>
                  <select
                    className="w-24 rounded-none border-2 border-slate-200 bg-slate-50 px-2 py-3 text-sm font-medium transition-colors focus:border-slate-900 focus:bg-white focus:outline-none"
                    value={newParticipant.ageGroup}
                    onChange={(event) =>
                      setNewParticipant((prev) => ({
                        ...prev,
                        ageGroup: event.target.value,
                      }))
                    }
                  >
                    {AGE_GROUP_OPTIONS.map((ageGroup) => (
                      <option key={ageGroup} value={ageGroup}>
                        {ageGroup}
                      </option>
                    ))}
                  </select>
                  <select
                    className="w-28 rounded-none border-2 border-slate-200 bg-slate-50 px-2 py-3 text-sm font-medium transition-colors focus:border-slate-900 focus:bg-white focus:outline-none"
                    value={newParticipant.level}
                    onChange={(event) =>
                      setNewParticipant((prev) => ({
                        ...prev,
                        level: event.target.value as Grade,
                      }))
                    }
                  >
                    {LEVEL_OPTIONS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={addParticipant}
                    className="h-auto rounded-none bg-slate-900 px-8 text-xs font-bold uppercase tracking-widest text-white hover:bg-slate-800"
                  >
                    Add
                  </Button>
                </div>

                <div className="border-2 border-slate-200 bg-white">
                  <div className="grid grid-cols-12 gap-4 border-b-2 border-slate-200 bg-slate-50 px-4 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
                    <div className="col-span-1 text-center">ID</div>
                    <div className="col-span-4">Name</div>
                    <div className="col-span-2 text-center">Gender</div>
                    <div className="col-span-2 text-center">Age</div>
                    <div className="col-span-2 text-center">Level</div>
                    <div className="col-span-1 text-right">Action</div>
                  </div>
                  <div className="max-h-[300px] divide-y-2 divide-slate-100 overflow-y-auto">
                    {participants.map((participant, index) => (
                      <div
                        key={participant.id}
                        className="grid grid-cols-12 items-center gap-4 px-4 py-2 transition-colors hover:bg-slate-50"
                      >
                        <div className="col-span-1 text-center font-mono text-xs text-slate-400">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="col-span-4 text-sm font-bold text-slate-900">
                          {participant.name}
                        </div>
                        <div className="col-span-2 text-center font-mono text-xs text-slate-600">
                          {participant.gender}
                        </div>
                        <div className="col-span-2 text-center font-mono text-xs text-slate-600">
                          {participant.ageGroup}
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <span className="border-2 border-slate-200 bg-slate-100 px-2 py-1 text-xs font-mono font-bold uppercase text-slate-700">
                            {participant.level}
                          </span>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none text-slate-400 hover:bg-red-50 hover:text-red-500"
                            onClick={() => removeParticipant(participant.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {participants.length === 0 && (
                      <div className="py-12 text-center font-mono text-xs uppercase tracking-widest text-slate-400">
                        No participants added
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="mb-8 flex flex-col justify-between gap-4 border-b-2 border-slate-100 pb-4 sm:flex-row sm:items-end">
                  <div>
                    <h2 className="font-display text-2xl font-bold uppercase text-slate-900">
                      Court Assignment
                    </h2>
                    <p className="mt-2 text-sm font-mono text-slate-500">
                      Review and adjust Round 01 matchups.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-none border-2 border-slate-300 font-mono text-[10px] uppercase tracking-widest text-slate-700 hover:bg-slate-100"
                  >
                    <Activity className="mr-2 h-3 w-3" />
                    Auto-Assign
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="border-2 border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
                        Assignment Summary
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 rounded-none border border-slate-300 text-[10px] font-bold uppercase tracking-widest"
                          onClick={addRoundBlock}
                        >
                          라운드 추가
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 rounded-none border border-slate-300 text-[10px] font-bold uppercase tracking-widest"
                          onClick={() =>
                            addCourtToRound(rounds[rounds.length - 1]?.id || "round-1")
                          }
                        >
                          코트 추가
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                      {participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between border border-slate-200 bg-white p-2 text-xs"
                        >
                          <span className="flex-1 truncate font-bold text-slate-900">
                            {participant.name}
                          </span>
                          <span className="ml-2 font-mono text-slate-500">
                            {participant.gender}/{participant.ageGroup}
                          </span>
                          <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 font-mono font-bold text-slate-900">
                            {participant.gamesAssigned}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`ml-2 h-6 rounded-none text-[10px] font-bold uppercase tracking-widest ${
                              participantToAssign?.id === participant.id
                                ? "bg-teal-100 text-teal-900"
                                : "bg-slate-100 text-slate-900"
                            }`}
                            onClick={() => setParticipantToAssign(participant)}
                          >
                            {participantToAssign?.id === participant.id
                              ? "Selecting..."
                              : "Assign"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {rounds.map((round, roundIndex) => (
                    <div key={round.id} className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="bg-slate-900 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-white">
                          Round {String(roundIndex + 1).padStart(2, "0")}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 rounded-none border border-slate-300 text-[10px] font-bold uppercase tracking-widest"
                          onClick={() => addCourtToRound(round.id)}
                        >
                          + 코트 추가
                        </Button>
                        <div className="h-px flex-1 bg-slate-200" />
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        {round.courts.map((court, courtIndex) => (
                          <div key={court.id} className="space-y-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                              Court {String(courtIndex + 1).padStart(2, "0")}
                            </span>
                            <BadmintonCourt
                              court={court}
                              roundId={round.id}
                              participantToAssign={participantToAssign}
                              assignParticipant={assignParticipant}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="relative mb-10">
                  <div className="absolute inset-0 bg-teal-500 opacity-20 blur-2xl" />
                  <div className="relative flex h-24 w-24 -rotate-3 items-center justify-center border-2 border-slate-900 bg-teal-500 text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                    <Check className="h-10 w-10 stroke-[3]" />
                  </div>
                </div>
                <div className="mb-3 text-[10px] font-mono uppercase tracking-widest text-teal-600">
                  Initialization Complete
                </div>
                <h2 className="mb-6 font-display text-4xl font-bold uppercase tracking-tight text-slate-900">
                  System Ready
                </h2>
                <p className="mx-auto mb-10 max-w-md text-sm font-medium leading-relaxed text-slate-500">
                  <strong className="text-slate-900">
                    {gameName || "Weekend Morning Rally"}
                  </strong>{" "}
                  has been successfully configured. Proceed to the operations desk to manage the live session.
                </p>

                <div className="flex w-full max-w-md flex-col gap-4 sm:flex-row">
                  <Link
                    href={`/court-manager/game/${createdGameId || ""}`}
                    className="flex-1"
                  >
                    <Button className="h-14 w-full rounded-none bg-slate-900 text-sm font-bold uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(16,185,129,1)] transition-transform hover:bg-slate-800 active:translate-y-1 active:translate-x-1 active:shadow-none">
                      Enter Operations
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="h-14 rounded-none border-2 border-slate-200 px-8 text-sm font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                    onClick={async () => {
                      if (!createdGameId) {
                        return;
                      }
                      await navigator.clipboard.writeText(
                        `${window.location.origin}/court-manager/game/${createdGameId}`
                      );
                    }}
                  >
                    Share Link
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {submitError && (
          <div className="border-t border-red-200 bg-red-50 px-6 py-3 text-sm font-medium text-red-600">
            {submitError}
          </div>
        )}

        {step < 4 && (
          <div className="z-20 flex items-center justify-between border-t-2 border-slate-900 bg-slate-50 p-4 md:p-6">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={step === 1 || isSubmitting}
              className="rounded-none font-mono text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={() => void handleNext()}
              disabled={isSubmitting}
              className="h-12 rounded-none bg-teal-500 px-8 font-bold uppercase tracking-widest text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:bg-teal-400 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
            >
              {isSubmitting
                ? "Creating..."
                : step === 3
                ? "Finalize"
                : "Proceed"}
              {step !== 3 && !isSubmitting && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
