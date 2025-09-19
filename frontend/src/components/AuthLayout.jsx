function AuthLayout({ children, aside }) {
  const containerClasses = [
    "relative overflow-hidden rounded-4xl border border-white/60 bg-white/70 shadow-2xl shadow-emerald-100/40 backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-emerald-200/70 dark:border-slate-800/70 dark:bg-slate-900/60 dark:shadow-emerald-900/40",
    aside ? "grid gap-10 p-8 sm:p-10 lg:grid-cols-[1.05fr,1fr]" : "p-8 sm:p-12",
  ].join(" ");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute -left-32 -top-24 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/20 animate-[pulse_14s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/20 animate-[pulse_18s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200/15 blur-3xl dark:bg-emerald-500/10" />
      <div className="relative z-10 w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className={containerClasses}>
          {aside && (
            <div className="relative hidden min-h-full flex-col justify-between rounded-3xl border border-white/50 bg-gradient-to-br from-emerald-400/25 via-sky-400/10 to-transparent p-8 text-slate-900 shadow-inner lg:flex dark:border-slate-800/60 dark:from-emerald-500/20 dark:via-slate-900 dark:text-slate-100">
              <div className="relative z-10 flex flex-col gap-8">{aside}</div>
              <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-white/30 blur-3xl dark:bg-emerald-500/15" />
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-sky-200/40 blur-2xl dark:bg-sky-500/20" />
            </div>
          )}
          <div className="relative flex flex-col justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;