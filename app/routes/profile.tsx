import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { type User, getMe, logout } from "~/lib/auth";

export function meta() {
  return [
    { title: "Profile | Schick" },
    { name: "description", content: "Manage profile and account settings." },
  ];
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    getMe().then(setUser);
  }, []);

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  if (user === undefined) {
    return (
      <main className="mx-auto max-w-md px-5 py-8">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-zinc-200" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-5 py-14 text-center">
        <div className="mb-6 flex justify-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-zinc-100">
            <ProfileIcon className="size-8 text-zinc-400" />
          </span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-950">
          Sign in to Schick
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Access your saved items, history, and personal recommendations.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex h-12 items-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-5 py-8 space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-950">Profile</h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-zinc-100">
            <ProfileIcon className="size-5 text-zinc-500" />
          </span>
          <div>
            <p className="text-sm font-medium text-zinc-950">{user.email}</p>
            <p className="text-xs text-zinc-400">Member</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full rounded-xl border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950 shadow-sm"
      >
        Sign out
      </button>
    </main>
  );
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
