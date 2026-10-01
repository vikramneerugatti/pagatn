"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

// Instructs Next.js to skip static build checks for this route
export const dynamic = "force-dynamic";

type Achievement = {
  id: number;
  title: string;
  category: string;
  year: number | null;
  achievement: string | null;
  location: string | null;
  description: string | null;
  image_url: string | null;
  certificate_url: string | null;
};

export default function BadmintonPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Suppress server initialization by declaring inside browser mounting execution block
    const supabase = createClient();

    async function loadBadmintonAchievements() {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("category", "Badminton")
        .order("year", { ascending: false });

      if (error) {
        console.error("PUBLIC BADMINTON ERROR:", error);
        setAchievements([]);
      } else {
        setAchievements(data || []);
      }

      setLoading(false);
    }

    loadBadmintonAchievements();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* NAVIGATION */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold">
            Pagat Neerugatti
          </Link>
          <Link href="/" className="text-sm text-slate-400 transition hover:text-white">
            ← Home
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <div className="text-6xl">🏸</div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            My Sports Journey
          </p>
          <h1 className="mt-4 text-5xl font-bold">Badminton</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Badminton is one of my favourite sports. I enjoy training, competing in tournaments and continuously improving my skills.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="mt-16 text-center">
            <div className="text-4xl">⏳</div>
            <p className="mt-4 text-slate-500">Loading badminton achievements...</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && achievements.length === 0 && (
          <div className="mt-16 rounded-3xl border border-dashed border-white/10 p-12 text-center">
            <div className="text-6xl">🏸</div>
            <p className="mt-5 text-slate-500">Badminton achievements will be added soon.</p>
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {!loading && achievements.length > 0 && (
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900 transition hover:-translate-y-1 hover:border-cyan-400/40"
              >
                {/* PHOTO */}
                {item.image_url ? (
                  <div className="h-56 overflow-hidden bg-slate-950">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center bg-slate-950">
                    <span className="text-6xl">🏸</span>
                  </div>
                )}

                {/* CONTENT */}
                <div className="p-7">
                  {/* YEAR */}
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-400">
                      {item.year || "Achievement"}
                    </span>
                    <span className="text-3xl">🏆</span>
                  </div>

                  {/* TITLE */}
                  <h2 className="mt-6 text-2xl font-bold">{item.title}</h2>

                  {/* RESULT */}
                  {item.achievement && (
                    <p className="mt-3 font-semibold text-cyan-400">{item.achievement}</p>
                  )}

                  {/* CATEGORY */}
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {item.category}
                  </p>

                  {/* LOCATION */}
                  {item.location && (
                    <p className="mt-3 text-sm text-slate-500">📍 {item.location}</p>
                  )}

                  {/* DESCRIPTION */}
                  {item.description && (
                    <p className="mt-6 leading-7 text-slate-400">{item.description}</p>
                  )}

                  {/* CERTIFICATE */}
                  {item.certificate_url && (
                    <a
                      href={item.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center rounded-xl border border-cyan-400/20 px-4 py-2 text-sm text-cyan-400 transition hover:bg-cyan-400/10"
                    >
                      📄 View Certificate
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-slate-600">
          © {new Date().getFullYear()} Pagat Neerugatti
        </div>
      </footer>
    </main>
  );
}