const NAME_KEY = "heatquest:name";

export function getStudentName(): string {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(NAME_KEY) ?? "";
}

export function setStudentName(name: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(NAME_KEY, name);
}

export function clearStudentName() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(NAME_KEY);
}
