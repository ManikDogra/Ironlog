import { motion, useReducedMotion } from "framer-motion";

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: 0.12 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] } })
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Soft aurora background */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          aria-hidden
          className="absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(40% 40% at 50% 50%, rgba(99,102,241,0.55) 0%, rgba(99,102,241,0.15) 40%, transparent 70%)"
          }}
          animate={prefersReducedMotion ? undefined : { x: [0, 30, -20, 0], y: [0, -10, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-40 -right-24 h-[36rem] w-[36rem] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(40% 40% at 50% 50%, rgba(236,72,153,0.45) 0%, rgba(236,72,153,0.12) 40%, transparent 70%)"
          }}
          animate={prefersReducedMotion ? undefined : { x: [0, -20, 15, 0], y: [0, 15, -10, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <motion.a
          href="#"
          className="group inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-2xl">🏋️</span>
          <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent group-hover:brightness-110">
            GymLog
          </span>
        </motion.a>

        <nav className="hidden gap-6 md:flex text-sm text-slate-300">
          <a className="hover:text-white transition" href="#features">Features</a>
          <a className="hover:text-white transition" href="#progress">Progress</a>
          <a className="hover:text-white transition" href="#faq">FAQ</a>
        </nav>

        <motion.div className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <a
            href="#signin"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur hover:border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Sign In
          </a>
          <a
            href="#get-started"
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Get Started
          </a>
        </motion.div>
      </header>

      {/* Hero */}
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-6 pt-6">
        <motion.div className="mx-auto max-w-3xl text-center">
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 backdrop-blur"
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            New: Smooth PR tracking & charts
          </motion.div>

          <motion.h1
            className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
          >
            Train. Track. <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">Transform</span>.
          </motion.h1>

          <motion.p
            className="mt-4 text-base text-slate-300 md:text-lg"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
          >
            A clean, fast way to log sets & reps, visualize progress, and stay consistent — without the clutter.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
          >
            <a
              href="#get-started"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-white/10 transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Start Logging
            </a>
            <a
              href="#learn-more"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 backdrop-blur transition hover:border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>

        {/* Feature cards */}
        <section id="features" className="mx-auto mt-16 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Workout Logger",
              desc: "Fast input for sets, reps, weight with auto-PR detection.",
              icon: "📈"
            },
            {
              title: "Progress Charts",
              desc: "Visualize strength and bodyweight trends over time.",
              icon: "📊"
            },
            {
              title: "Photo Timeline",
              desc: "Daily/weekly photos with swipe-through comparison.",
              icon: "🖼️"
            }
          ].map((f, idx) => (
            <motion.article
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.06 * idx, duration: 0.5 }}
            >
              {/* animated border glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100" style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(99,102,241,0.25), transparent 70%)" }} />
              <div className="relative z-10">
                <div className="mb-3 text-2xl">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{f.desc}</p>
              </div>
            </motion.article>
          ))}
        </section>

        {/* Scroll cue */}
        <motion.div
          className="mt-14 hidden h-10 w-6 items-start justify-center rounded-full border border-white/15 p-1 sm:flex"
          initial={{ opacity: 0 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="h-2 w-2 rounded-full bg-white" />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mx-auto mt-16 w-full max-w-7xl px-6 pb-10 pt-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} GymLog — Built for lifters who love clean UI.
      </footer>
    </div>
  );
}
