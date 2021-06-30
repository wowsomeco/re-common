// code from: https://www.w3resource.com/javascript-exercises/javascript-date-exercise-18.php
// slightly modified (variable name & accept date + date string as arg)
export function calculateAge(
  dob: Date | string,
  until: Date | string = new Date()
): number {
  const dobDate = dob instanceof Date ? dob : new Date(dob);
  const untilDate = until instanceof Date ? until : new Date(until);
  const diffMs = untilDate.getTime() - dobDate.getTime();
  const ageDate = new Date(diffMs);

  let age = Math.abs(ageDate.getUTCFullYear() - 1970);

  // https://github.com/wowsomeco/flutterfly/blob/8ffaa8fc6ebddefe88f7fe6d420fc3d9542fdbd1/lib/src/common/extensions/datetime_extensions.dart#L17
  if (
    dobDate.getMonth() <= untilDate.getMonth() &&
    dobDate.getDate() < untilDate.getDate()
  ) {
    age--;
  }

  return age;
}
