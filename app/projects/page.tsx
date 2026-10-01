import Link from "next/link";
import { projects } from "@/data/content";

export default function ProjectsPage() {
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

          <div className="text-6xl">🤖</div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Science • Technology • Creativity
          </p>

          <h1 className="mt-4 text-5xl font-bold">
            Innovation & Projects
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            I enjoy creating science and technology projects using
            sensors, microcontrollers, actuators and programming.
          </p>

        </div>

        <div className="mt-16 space-y-8">

          {projects.map((project, index) => (

            <article
              key={index}
              className="grid gap-8 rounded-3xl border border-white/10 bg-slate-900 p-8 md:grid-cols-[280px_1fr]"
            >

              <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950">
                <span className="text-sm text-slate-600">
                  Project Photo
                </span>
              </div>

              <div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-400">
                    {project.year}
                  </span>

                  <span className="text-sm text-slate-500">
                    {project.technology}
                  </span>
                </div>

                <h2 className="mt-5 text-3xl font-bold">
                  {project.title}
                </h2>

                <p className="mt-4 leading-7 text-slate-400">
                  {project.description}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">

                  <div className="rounded-xl bg-slate-950 p-4">
                    <p className="text-xs uppercase text-slate-500">
                      Microcontroller
                    </p>

                    <p className="mt-2 font-semibold">
                      {project.microcontroller}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-4">
                    <p className="text-xs uppercase text-slate-500">
                      Sensors
                    </p>

                    <p className="mt-2 font-semibold">
                      {project.sensors.join(", ")}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-4">
                    <p className="text-xs uppercase text-slate-500">
                      Actuators
                    </p>

                    <p className="mt-2 font-semibold">
                      {project.actuators.join(", ")}
                    </p>
                  </div>

                </div>

              </div>

            </article>

          ))}

        </div>

      </section>

    </main>
  );
}