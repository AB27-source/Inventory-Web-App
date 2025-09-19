import React, { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiMail } from "react-icons/fi";
import UBLogoLight from "../assets/UBlogo-light.png";
import UBLogoDark from "../assets/UBlogo-dark.png";
import Home2Logo from "../assets/Home2_Suites_by_Hilton_logo.png";
import Home2Dark from "../assets/Home2-Logo-White.png";
import ComfortInnLogo from "../assets/comfort_inn.png";
import ComfortDark from "../assets/comfort_inn-white.png";
import { useDarkMode } from "../utilities/DarkModeProvider.jsx";
import DarkModeToggle from "../utilities/DarkModeToggle.jsx";
import AuthLayout from "../components/AuthLayout.jsx";

function ResetPassword() {
  const { currentTheme } = useDarkMode();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const [status, setStatus] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", text: "" });
    setIsSubmitting(true);

    try {
      await axios.post(
        "http://localhost:8000/api/v1/auth/request-reset-email/",
        { email }
      );
      setStatus({
        type: "success",
        text: "If an account with this email exists, a password reset link has been sent.",
      });
    } catch (error) {
      const responseMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "We couldn't process your request right now. Please try again.";
      setStatus({ type: "error", text: responseMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const asideContent = useMemo(
    () => (
      <div className="relative flex h-full flex-col items-center justify-evenly py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-emerald-400/15 via-sky-400/10 to-emerald-500/15 blur-2xl opacity-0 animate-tint-fade dark:from-emerald-400/20 dark:via-sky-400/15 dark:to-emerald-500/20" />
        </div>

        <figure className="flex w-full max-w-[260px] flex-col items-center">
          <div className="relative w-full rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm shadow-lg shadow-emerald-900/10 ring-1 ring-white/10 dark:bg-slate-900/20">
            <img
              src={currentTheme === "dark" ? Home2Dark : Home2Logo}
              alt="Home2 Suites by Hilton"
              className="mx-auto max-h-24 w-auto opacity-80 animate-fade-in-up"
            />
          </div>
        </figure>

        <figure className="flex w-full max-w-[260px] flex-col items-center">
          <div className="relative w-full rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm shadow-lg shadow-emerald-900/10 ring-1 ring-white/10 dark:bg-slate-900/20">
            <img
              src={currentTheme === "dark" ? ComfortDark : ComfortInnLogo}
              alt="Comfort Inn"
              className="mx-auto max-h-24 w-auto opacity-80 animate-fade-in-up [animation-delay:200ms]"
            />
          </div>
        </figure>

        <figure className="flex w-full max-w-[260px] flex-col items-center">
          <div className="relative flex h-[150px] w-full items-center justify-center rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm shadow-lg shadow-emerald-900/10 ring-1 ring-white/10 dark:bg-slate-900/20">
            <p className="text-center text-lg font-semibold uppercase tracking-[0.3em] text-emerald-700 opacity-80 animate-fade-in-up [animation-delay:400ms] dark:text-emerald-200">
              Always Secure
            </p>
          </div>
        </figure>
      </div>
    ),
    [currentTheme]
  );

  return (
    <AuthLayout aside={asideContent}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-300">
              <FiMail className="h-4 w-4" />
              Reset access
            </span>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
              Send a password reset link
            </h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Enter the email associated with your UB Operations Hub account and
              we'll guide you through resetting your password.
            </p>
          </div>
          <img
            className="h-16 w-auto rounded-2xl border border-slate-200/60 bg-white/80 p-3 shadow-md shadow-emerald-100/40 dark:border-slate-700/60 dark:bg-slate-900/60 dark:shadow-emerald-900/40"
            src={currentTheme === "dark" ? UBLogoDark : UBLogoLight}
            alt="UB Hospitality Group logo"
          />
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm transition-colors duration-500 hover:border-emerald-300/80 dark:border-slate-700/60 dark:bg-slate-800/40">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium uppercase tracking-[0.25em]">
              Theme
            </span>
            <DarkModeToggle />
          </div>
        </div>

        {status.text && (
          <div
            className={`flex items-start gap-3 rounded-3xl border p-4 text-sm shadow-sm transition-all duration-500 ${
              status.type === "success"
                ? "border-emerald-200/70 bg-emerald-50/80 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200"
                : "border-rose-200/70 bg-rose-50/80 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200"
            }`}
          >
            {status.type === "success" ? (
              <FiMail className="mt-0.5 h-5 w-5" />
            ) : (
              <FiAlertTriangle className="mt-0.5 h-5 w-5" />
            )}
            <p>{status.text}</p>
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400"
            >
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              name="email"
              id="email"
              className="block w-full rounded-2xl border border-transparent bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-inner shadow-slate-200/60 transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-400/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-emerald-400/70 dark:focus:bg-slate-900/60"
              placeholder="name@company.com"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/50 transition-all duration-500 hover:from-emerald-600 hover:via-sky-500 hover:to-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-80 dark:focus-visible:ring-offset-slate-900"
          >
            {isSubmitting ? "Sending reset link..." : "Send reset link"}
          </button>
        </form>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          Remembered your password?
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="ml-2 inline-flex items-center justify-center rounded-2xl border border-transparent px-3 py-1 text-sm font-semibold text-emerald-600 transition-colors duration-300 hover:text-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-emerald-300 dark:hover:text-emerald-200 dark:focus-visible:ring-offset-slate-900"
          >
            Back to sign in
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}

export default ResetPassword;
