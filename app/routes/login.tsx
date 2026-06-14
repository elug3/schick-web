import { useState } from "react";
import { useNavigate } from "react-router";
import { login, register } from "~/lib/auth";

export function meta() {
  return [
    { title: "Sign in | Schick" },
    { name: "description", content: "Sign in to your Schick account." },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "register") {
        await register(email, password);
        await login(email, password);
      } else {
        await login(email, password);
      }
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-14">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          Schick
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4"
      >
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-xs font-medium text-zinc-600"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none ring-zinc-950 transition focus:border-zinc-400 focus:ring-2"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-zinc-600"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none ring-zinc-950 transition focus:border-zinc-400 focus:ring-2"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-zinc-950 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading
            ? "Please wait…"
            : mode === "login"
            ? "Sign in"
            : "Create account"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-zinc-500">
        {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError(null);
          }}
          className="font-semibold text-zinc-950 underline-offset-2 hover:underline"
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </main>
  );
}
