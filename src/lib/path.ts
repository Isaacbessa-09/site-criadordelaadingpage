/* eslint-disable @typescript-eslint/no-explicit-any */
// Lê/escreve valores por caminho "items.2.title".
export function getIn(obj: any, path: string): any {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export function setIn<T>(obj: T, path: string, value: any): T {
  const keys = path.split(".");
  const clone: any = Array.isArray(obj) ? [...(obj as any)] : { ...(obj as any) };
  let cur = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const next = cur[k];
    cur[k] = Array.isArray(next) ? [...next] : { ...(next ?? {}) };
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return clone;
}

export function uid(prefix = "s"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}
