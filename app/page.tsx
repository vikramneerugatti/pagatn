import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* ================= NAVIGATION ================= */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* Logo / Name */}
          <Link
            href="/"
            className="text-xl font-bold tracking-wide hover:text-cyan-400 transition"
          >
            Pagat Neerugatti
          </Link>

          {/* Navigation Links */}
          <div className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">

            <Link
              href="/badminton"
              className="hover:text-cyan-400 transition"
            >
              Badminton
            </Link>

            <Link
              href="/music"
              className="hover:text-cyan-400 transition"
            >
              Music
            </Link>

            <Link
              href="/projects"
              className="hover:text-cyan-400 transition"
            >
              Projects
            </Link>

            <Link
              href="/achievements"
              className="hover:text-cyan-400 transition"
            >
              Achievements
            </Link>

            <Link
              href="/gallery"
              className="hover:text-cyan-400 transition"
            >
              Gallery
            </Link>

            <Link
              href="/videos"
              className="hover:text-cyan-400 transition"
            >
              Videos
            </Link>

          </div>

          {/* Mobile Menu Indicator */}
          <div className="lg:hidden text-slate-400 text-sm">
            Menu
          </div>

        </div>
      </nav>


      {/* ================= HERO SECTION ================= */}
      <section className="mx-auto flex min-h-[85vh] max-w-7xl items-center px-6 py-20">

        <div className="grid w-full gap-14 md:grid-cols-2 md:items-center">

          {/* Hero Text */}
          <div>

            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Young Innovator • Athlete • Musician
            </p>

            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
              Pagat
              <span className="block text-cyan-400">
                Neerugatti
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              A Grade 7 student passionate about badminton, keyboard music,
              science, technology and building creative projects using
              sensors, microcontrollers and actuators.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="/projects"
                className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Explore My Projects
              </Link>

              <Link
                href="/achievements"
                className="rounded-full border border-white/20 px-6 py-3 font-semibold transition hover:bg-white/10"
              >
                My Achievements
              </Link>

            </div>

          </div>


          {/* Profile Image */}
          <div className="flex justify-center">

            <div className="relative h-80 w-80 overflow-hidden rounded-full border-4 border-cyan-400/30 shadow-2xl shadow-cyan-500/20 md:h-[420px] md:w-[420px]">

              <Image
                src="/images/profile/pagat.png"
                alt="Pagat Neerugatti"
                fill
                priority
                className="object-cover"
              />

            </div>

          </div>

        </div>

      </section>


      {/* ================= PASSIONS SECTION ================= */}
      <section className="border-y border-white/10 bg-slate-900/50 px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              What I Love
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              My Passions
            </h2>

          </div>


          <div className="grid gap-6 md:grid-cols-3">


            {/* ================= BADMINTON ================= */}
            <Link
              href="/badminton"
              className="group rounded-3xl border border-white/10 bg-slate-950 p-8 transition hover:-translate-y-2 hover:border-cyan-400/40"
            >

              <div className="text-5xl transition group-hover:scale-110">
                🏸
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Badminton
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Developing skills, competing in tournaments and learning
                discipline, focus and sportsmanship through badminton.
              </p>

              <div className="mt-6 text-sm font-semibold text-cyan-400">
                View Badminton →
              </div>

            </Link>


            {/* ================= MUSIC ================= */}
            <Link
              href="/music"
              className="group rounded-3xl border border-white/10 bg-slate-950 p-8 transition hover:-translate-y-2 hover:border-cyan-400/40"
            >

              <div className="text-5xl transition group-hover:scale-110">
                🎹
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Keyboard & Music
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Exploring music through keyboard, performances,
                practice and continuous learning.
              </p>

              <div className="mt-6 text-sm font-semibold text-cyan-400">
                Explore Music →
              </div>

            </Link>


            {/* ================= INNOVATION ================= */}
            <Link
              href="/projects"
              className="group rounded-3xl border border-white/10 bg-slate-950 p-8 transition hover:-translate-y-2 hover:border-cyan-400/40"
            >

              <div className="text-5xl transition group-hover:scale-110">
                🤖
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Innovation
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Building science and IoT projects using sensors,
                microcontrollers, actuators and creative ideas.
              </p>

              <div className="mt-6 text-sm font-semibold text-cyan-400">
                View Projects →
              </div>

            </Link>

          </div>

        </div>

      </section>


      {/* ================= ABOUT SECTION ================= */}
      <section
        id="about"
        className="mx-auto max-w-5xl px-6 py-24 text-center"
      >

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          About Me
        </p>

        <h2 className="mt-4 text-3xl font-bold md:text-4xl">
          Learning by Doing
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
          I enjoy learning new things and turning ideas into real
          experiences. From badminton courts and music practice to
          science experiments and technology projects, I believe that
          curiosity, creativity and practice can turn an idea into
          something amazing.
        </p>

      </section>


      {/* ================= FEATURED ACHIEVEMENTS ================= */}
      <section className="border-y border-white/10 bg-slate-900/50 px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Highlights
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              My Achievements
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Sports achievements, music accomplishments, science
              exhibitions, awards and certificates.
            </p>

          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-3">


            {/* Badminton Achievement */}
            <Link
              href="/achievements"
              className="group rounded-3xl border border-white/10 bg-slate-950 p-8 text-center transition hover:-translate-y-2 hover:border-cyan-400/40"
            >

              <div className="text-5xl transition group-hover:scale-110">
                🏆
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Badminton
              </h3>

              <p className="mt-3 text-slate-400">
                Tournaments & Awards
              </p>

              <p className="mt-5 text-sm text-cyan-400">
                View Achievements →
              </p>

            </Link>


            {/* Music Achievement */}
            <Link
              href="/achievements"
              className="group rounded-3xl border border-white/10 bg-slate-950 p-8 text-center transition hover:-translate-y-2 hover:border-cyan-400/40"
            >

              <div className="text-5xl transition group-hover:scale-110">
                🎵
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Music
              </h3>

              <p className="mt-3 text-slate-400">
                Performances & Certificates
              </p>

              <p className="mt-5 text-sm text-cyan-400">
                View Achievements →
              </p>

            </Link>


            {/* Innovation Achievement */}
            <Link
              href="/achievements"
              className="group rounded-3xl border border-white/10 bg-slate-950 p-8 text-center transition hover:-translate-y-2 hover:border-cyan-400/40"
            >

              <div className="text-5xl transition group-hover:scale-110">
                🔬
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Innovation
              </h3>

              <p className="mt-3 text-slate-400">
                Science & Technology
              </p>

              <p className="mt-5 text-sm text-cyan-400">
                View Achievements →
              </p>

            </Link>

          </div>


          {/* View All Button */}
          <div className="mt-12 text-center">

            <Link
              href="/achievements"
              className="inline-block rounded-full border border-cyan-400/30 px-6 py-3 font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950"
            >
              View All Achievements
            </Link>

          </div>

        </div>

      </section>


      {/* ================= FEATURED PROJECTS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Science & Technology
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Featured Projects
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Exploring ideas through sensors, microcontrollers,
            actuators and programming.
          </p>

        </div>


        <div className="mt-12 grid gap-6 md:grid-cols-3">


          {/* Project 1 */}
          <Link
            href="/projects"
            className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900 transition hover:-translate-y-2 hover:border-cyan-400/40"
          >

            <div className="flex h-48 items-center justify-center bg-slate-950 text-7xl transition group-hover:scale-105">
              🗑️
            </div>

            <div className="p-6">

              <p className="text-sm text-cyan-400">
                Arduino • Sensor • Servo
              </p>

              <h3 className="mt-2 text-xl font-bold">
                Smart Automatic Dustbin
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                An automatic dustbin that detects an approaching object
                and opens its lid automatically.
              </p>

            </div>

          </Link>


          {/* Project 2 */}
          <Link
            href="/projects"
            className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900 transition hover:-translate-y-2 hover:border-cyan-400/40"
          >

            <div className="flex h-48 items-center justify-center bg-slate-950 text-7xl transition group-hover:scale-105">
              💡
            </div>

            <div className="p-6">

              <p className="text-sm text-cyan-400">
                Arduino • LDR • LED
              </p>

              <h3 className="mt-2 text-xl font-bold">
                Smart Street Light
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                A smart lighting system that automatically responds
                to surrounding brightness.
              </p>

            </div>

          </Link>


          {/* Project 3 */}
          <Link
            href="/projects"
            className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900 transition hover:-translate-y-2 hover:border-cyan-400/40"
          >

            <div className="flex h-48 items-center justify-center bg-slate-950 text-7xl transition group-hover:scale-105">
              🌱
            </div>

            <div className="p-6">

              <p className="text-sm text-cyan-400">
                Arduino • Soil Sensor • Pump
              </p>

              <h3 className="mt-2 text-xl font-bold">
                Automatic Plant Watering
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                A smart watering system that monitors soil moisture
                and activates a water pump when required.
              </p>

            </div>

          </Link>

        </div>


        <div className="mt-12 text-center">

          <Link
            href="/projects"
            className="inline-block rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Explore All Projects
          </Link>

        </div>

      </section>


      {/* ================= GALLERY PREVIEW ================= */}
      <section className="border-y border-white/10 bg-slate-900/50 px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
                Memories
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Photo Gallery
              </h2>

              <p className="mt-3 text-slate-400">
                Moments from sports, music, innovation and achievements.
              </p>

            </div>

            <Link
              href="/gallery"
              className="rounded-full border border-white/20 px-6 py-3 font-semibold transition hover:bg-white/10"
            >
              View Gallery →
            </Link>

          </div>

        </div>

      </section>


      {/* ================= VIDEOS PREVIEW ================= */}
      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="grid gap-10 md:grid-cols-2 md:items-center">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Watch
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              My Videos
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-slate-400">
              Watch badminton moments, keyboard performances and
              demonstrations of science and technology projects.
            </p>

            <Link
              href="/videos"
              className="mt-8 inline-block rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Watch Videos →
            </Link>

          </div>


          <div className="flex h-64 items-center justify-center rounded-3xl border border-white/10 bg-slate-900">

            <div className="text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400 text-3xl text-slate-950">
                ▶
              </div>

              <p className="mt-5 text-sm text-slate-500">
                Videos will be added here
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 bg-slate-950 px-6 py-10">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-8 md:grid-cols-3">

            {/* Name */}
            <div>

              <h3 className="text-xl font-bold">
                Pagat Neerugatti
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Young Innovator • Badminton Player • Keyboardist
              </p>

            </div>


            {/* Quick Links */}
            <div>

              <h4 className="font-semibold">
                Quick Links
              </h4>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-500">

                <Link
                  href="/badminton"
                  className="hover:text-cyan-400"
                >
                  Badminton
                </Link>

                <Link
                  href="/music"
                  className="hover:text-cyan-400"
                >
                  Music
                </Link>

                <Link
                  href="/projects"
                  className="hover:text-cyan-400"
                >
                  Projects
                </Link>

                <Link
                  href="/achievements"
                  className="hover:text-cyan-400"
                >
                  Achievements
                </Link>

                <Link
                  href="/gallery"
                  className="hover:text-cyan-400"
                >
                  Gallery
                </Link>

                <Link
                  href="/videos"
                  className="hover:text-cyan-400"
                >
                  Videos
                </Link>

              </div>

            </div>


            {/* Journey */}
            <div>

              <h4 className="font-semibold">
                My Journey
              </h4>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Learning, creating, competing and growing through
                sports, music, science and technology.
              </p>

            </div>

          </div>


          <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-600">

            © {new Date().getFullYear()} Pagat Neerugatti. All rights reserved.

          </div>

        </div>

      </footer>

    </main>
  );
}