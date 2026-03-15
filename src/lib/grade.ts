export type BackendGrade =
  | "초심"
  | "D급"
  | "C급"
  | "B급"
  | "A급"
  | "S급"
  | "SS급";

export type UiGameGrade = "ROOKIE" | "D" | "C" | "B" | "A" | "S" | "SS";
export type ProfileGradeSelection =
  | "초심"
  | "D"
  | "C"
  | "B"
  | "A"
  | "S"
  | "SS";

const UI_TO_BACKEND_GRADE: Record<UiGameGrade, BackendGrade> = {
  ROOKIE: "초심",
  D: "D급",
  C: "C급",
  B: "B급",
  A: "A급",
  S: "S급",
  SS: "SS급",
};

const PROFILE_TO_BACKEND_GRADE: Record<ProfileGradeSelection, BackendGrade> = {
  초심: "초심",
  D: "D급",
  C: "C급",
  B: "B급",
  A: "A급",
  S: "S급",
  SS: "SS급",
};

const BACKEND_TO_UI_GRADE: Record<BackendGrade, UiGameGrade> = {
  초심: "ROOKIE",
  "D급": "D",
  "C급": "C",
  "B급": "B",
  "A급": "A",
  "S급": "S",
  "SS급": "SS",
};

const BACKEND_TO_PROFILE_GRADE: Record<BackendGrade, ProfileGradeSelection> = {
  초심: "초심",
  "D급": "D",
  "C급": "C",
  "B급": "B",
  "A급": "A",
  "S급": "S",
  "SS급": "SS",
};

export function toBackendGrade(
  grade?: UiGameGrade | ProfileGradeSelection | BackendGrade | string | null
): BackendGrade | undefined {
  if (!grade) {
    return undefined;
  }

  if (grade in UI_TO_BACKEND_GRADE) {
    return UI_TO_BACKEND_GRADE[grade as UiGameGrade];
  }

  if (grade in PROFILE_TO_BACKEND_GRADE) {
    return PROFILE_TO_BACKEND_GRADE[grade as ProfileGradeSelection];
  }

  if (grade in BACKEND_TO_UI_GRADE) {
    return grade as BackendGrade;
  }

  return undefined;
}

export function toUiGameGrade(
  grade?: BackendGrade | string | null
): UiGameGrade | undefined {
  if (!grade) {
    return undefined;
  }

  return BACKEND_TO_UI_GRADE[grade as BackendGrade];
}

export function toProfileGradeSelection(
  grade?: BackendGrade | string | null
): ProfileGradeSelection | "" {
  if (!grade) {
    return "";
  }

  return BACKEND_TO_PROFILE_GRADE[grade as BackendGrade] ?? "";
}

export function formatGradeLabel(
  grade?: BackendGrade | UiGameGrade | ProfileGradeSelection | string | null
) {
  if (!grade) {
    return "급수 없음";
  }

  if (grade === "ROOKIE") {
    return "초심";
  }

  if (grade in PROFILE_TO_BACKEND_GRADE) {
    return grade;
  }

  const uiGrade = toUiGameGrade(grade as BackendGrade | string | null);
  if (uiGrade) {
    return uiGrade === "ROOKIE" ? "초심" : uiGrade;
  }

  return grade;
}
