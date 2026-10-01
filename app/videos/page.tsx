import Link from "next/link";

const videos = [
  {
    title: "Badminton Tournament Highlights",
    category: "Badminton",
  },
  {
    title: "Keyboard Performance",
    category: "Music",
  },
  {
    title: "Smart Automatic Dustbin Demonstration",
    category: "Innovation",
  },
];

export default function VideosPage() {
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

          <div className="text-6xl">🎥</div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Watch
          </p>

          <h1 className="mt-4 text-5xl font-bold">
            Videos
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Badminton matches, keyboard performances and
            science project demonstrations.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {videos.map((video, index) => (

            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900"
            >

              <div className="flex h-56 items-center justify-center bg-slate-950">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400 text-2xl text-slate-950">
                  ▶
                </div>

              </div>

              <div className="p-6">

                <p className="text-sm text-cyan-400">
                  {video.category}
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  {video.title}
                </h2>

                <p className="mt-3 text-sm text-slate-500">
                  Video will be added here.
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}