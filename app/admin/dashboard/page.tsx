"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin");
        return;
      }

      setEmail(user.email || "");
      setChecking(false);
    }

    checkUser();
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/admin");
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">
          Checking authentication...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Header */}

      <header className="border-b border-white/10">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>

            <h1 className="text-xl font-bold">
              Pagat Admin
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Portfolio Management
            </p>

          </div>

          <div className="flex items-center gap-4">

            <span className="hidden text-sm text-slate-500 md:block">
              {email}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
            >
              Logout
            </button>

          </div>

        </div>

      </header>


      {/* Dashboard */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Dashboard
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            Manage Pagat's Portfolio
          </h2>

          <p className="mt-4 max-w-2xl text-slate-400">
            Add and manage achievements, music activities,
            science projects, photographs and videos.
          </p>

        </div>


        {/* Management Cards */}

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">


          {/* Badminton */}

          <Link
            href="/admin/achievements"
            className="group rounded-3xl border border-white/10 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-cyan-400/40"
          >

            <div className="text-5xl">
              🏸
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              Badminton
            </h3>

            <p className="mt-3 text-slate-400">
              Add tournaments, rankings, medals and achievements.
            </p>

            <p className="mt-6 text-sm font-semibold text-cyan-400">
              Manage →
            </p>

          </Link>


          {/* Music */}

          <Link
            href="/admin/music"
            className="group rounded-3xl border border-white/10 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-cyan-400/40"
          >

            <div className="text-5xl">
              🎹
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              Music
            </h3>

            <p className="mt-3 text-slate-400">
              Add performances, competitions and certificates.
            </p>

            <p className="mt-6 text-sm font-semibold text-cyan-400">
              Manage →
            </p>

          </Link>


          {/* Projects */}

          <Link
            href="/admin/projects"
            className="group rounded-3xl border border-white/10 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-cyan-400/40"
          >

            <div className="text-5xl">
              🤖
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              Projects
            </h3>

            <p className="mt-3 text-slate-400">
              Add science, IoT and technology projects.
            </p>

            <p className="mt-6 text-sm font-semibold text-cyan-400">
              Manage →
            </p>

          </Link>


          {/* Gallery */}

          <Link
            href="/admin/gallery"
            className="group rounded-3xl border border-white/10 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-cyan-400/40"
          >

            <div className="text-5xl">
              📸
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              Gallery
            </h3>

            <p className="mt-3 text-slate-400">
              Upload and organize photographs.
            </p>

            <p className="mt-6 text-sm font-semibold text-cyan-400">
              Manage →
            </p>

          </Link>


          {/* Videos */}

          <Link
            href="/admin/videos"
            className="group rounded-3xl border border-white/10 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-cyan-400/40"
          >

            <div className="text-5xl">
              🎥
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              Videos
            </h3>

            <p className="mt-3 text-slate-400">
              Add YouTube and project demonstration videos.
            </p>

            <p className="mt-6 text-sm font-semibold text-cyan-400">
              Manage →
            </p>

          </Link>


          {/* Profile */}

          <div
            className="rounded-3xl border border-white/10 bg-slate-900 p-8"
          >

            <div className="text-5xl">
              👤
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              Profile
            </h3>

            <p className="mt-3 text-slate-400">
              Profile photo and personal portfolio information.
            </p>

            <p className="mt-6 text-sm text-slate-600">
              Coming next
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}