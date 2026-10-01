import Link from "next/link";

const galleryItems = [
  {
    title: "Badminton Tournament",
    category: "Badminton",
    emoji: "🏸",
  },
  {
    title: "Tournament Achievement",
    category: "Achievements",
    emoji: "🏆",
  },
  {
    title: "Keyboard Performance",
    category: "Music",
    emoji: "🎹",
  },
  {
    title: "Science Exhibition",
    category: "Innovation",
    emoji: "🔬",
  },
  {
    title: "Technology Project",
    category: "Innovation",
    emoji: "🤖",
  },
  {
    title: "Award Ceremony",
    category: "Achievements",
    emoji: "🏅",
  },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link href="/" className="text-xl font-bold">
            Pagat Neerugatti
          </Link>

          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Home
          </Link>

        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="text-center">

          <div className="text-6xl">📸</div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Memories
          </p>

          <h1 className="mt-4 text-5xl font-bold">
            Gallery
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Moments from badminton, music, science projects,
            competitions and achievements.
          </p>

        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {galleryItems.map((item, index) => (

            <div
              key={index}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900"
            >

              <div className="flex h-64 items-center justify-center bg-slate-950 text-7xl transition group-hover:scale-105">

                {item.emoji}

              </div>

              <div className="p-6">

                <p className="text-sm text-cyan-400">
                  {item.category}
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  {item.title}
                </h2>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}