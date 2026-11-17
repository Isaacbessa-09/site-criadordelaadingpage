"use client";

import { useState } from "react";
import { LayoutTemplate, Loader2 } from "lucide-react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await fetch("/api/login", { method: "POST", body: JSON.stringify({ password }) });
    if (r.ok) {
      const next = new URLSearchParams(location.search).get("next") || "/";
      location.href = next.startsWith("/") ? next : "/";
    } else {
      setErr("Senha incorreta.");
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <span className="grid size-11 place-items-center rounded-xl bg-zinc-900 text-white">
          <LayoutTemplate size={20} />
        </span>
        <h1 className="mt-5 text-xl font-semibold">Landing Studio</h1>
        <p className="mt-1 text-sm text-zinc-500">Digite a senha para acessar o editor.</p>
        <label htmlFor="pw" className="mt-6 block text-xs font-semibold text-zinc-700">Senha</label>
        <input
          id="pw"
          type="password"
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
        <button disabled={busy || !password} className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50">
          {busy && <Loader2 size={16} className="animate-spin" />} Entrar
        </button>
      </form>
    </main>
  );
}
