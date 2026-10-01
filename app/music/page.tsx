"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

type MusicAchievement = {
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

export default function MusicPage() {
  const supabase = createClient();

  const [musicAchievements, setMusicAchievements] = useState<
    MusicAchievement[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMusicAchievements() {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("category", "Music")
        .order("year", { ascending: false });

      if (error) {
        console.error(
          "PUBLIC MUSIC ERROR:",
          error
        );

        setMusicAchievements([]);
      } else {
        setMusicAchievements(data || []);
      }

      setLoading(false);
    }

    loadMusicAchievements();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* NAVIGATION */}

      <nav className="border-b border-white/10">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="text-xl font-bold"
          >
            Pagat Neerugatti
          </Link>

          <Link
            href="/"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Home
          </Link>

        </div>

      </nav>

      {/* HERO */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="text-center">

          <div className="text-6xl">
            🎹
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            My Musical Journey
          </p>

          <h1 className="mt-4 text-5xl font-bold">
            Keyboard & Music
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Music gives me another way to express creativity.
            I enjoy learning keyboard, practising music and
            performing for others.
          </p>

        </div>

        {/* LOADING */}

        {loading && (

          <div className="mt-16 text-center">

            <div className="text-4xl">
              ⏳
            </div>

            <p className="mt-4 text-slate-500">
              Loading music achievements...
            </p>

          </div>

        )}

        {/* EMPTY */}

        {!loading && musicAchievements.length === 0 && (

          <div className="mt-16 rounded-3xl border border-dashed border-white/10 p-12 text-center">

            <div className="text-6xl">
              🎹
            </div>

            <p className="mt-5 text-slate-500">
              Music achievements and performances will be
              added soon.
            </p>

          </div>

        )}

        {/* MUSIC ACHIEVEMENTS */}

        {!loading && musicAchievements.length > 0 && (

          <div className="mt-16 grid gap-6 md:grid-cols-2">

            {musicAchievements.map((item) => (

              <div
                key={item.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900 transition hover:-translate-y-1 hover:border-cyan-400/40"
              >

                {/* IMAGE */}

                {item.image_url ? (

                  <div className="h-64 overflow-hidden bg-slate-950">

                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />

                  </div>

                ) : (

                  <div className="flex h-64 items-center justify-center bg-slate-950">

                    <span className="text-7xl">
                      🎹
                    </span>

                  </div>

                )}

                {/* CONTENT */}

                <div className="p-8">

                  <div className="flex items-center justify-between">

                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-400">
                      {item.year || "Music"}
                    </span>

                    <span className="text-4xl">
                      🎵
                    </span>

                  </div>

                  {/* TITLE */}

                  <h2 className="mt-6 text-2xl font-bold">
                    {item.title}
                  </h2>

                  {/* ACHIEVEMENT */}

                  {item.achievement && (

                    <p className="mt-3 font-semibold text-cyan-400">
                      {item.achievement}
                    </p>

                  )}

                  {/* EVENT / LOCATION */}

                  {item.location && (

                    <p className="mt-3 text-slate-400">
                      📍 {item.location}
                    </p>

                  )}

                  {/* DESCRIPTION */}

                  {item.description && (

                    <p className="mt-6 leading-7 text-slate-400">
                      {item.description}
                    </p>

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