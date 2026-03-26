export const PARTICIPANT_NAME_PATTERN = /^(?=.*[A-Za-z가-힣])[A-Za-z가-힣 ]+$/;

export const PARTICIPANT_NAME_ERROR =
  "참가자 이름은 한글 또는 영문만 입력할 수 있습니다.";

export function validateParticipantName(name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return "참가자 이름을 입력해주세요.";
  }

  if (!PARTICIPANT_NAME_PATTERN.test(trimmedName)) {
    return PARTICIPANT_NAME_ERROR;
  }

  return "";
}
