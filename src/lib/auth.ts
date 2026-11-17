// Senha única de acesso ao editor (uso pessoal). Defina APP_PASSWORD nas variáveis de ambiente.
export const AUTH_COOKIE = "ls_auth";

export async function authToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`landing-studio:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}
