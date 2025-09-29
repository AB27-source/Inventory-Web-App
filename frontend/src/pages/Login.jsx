import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiTrendingUp } from "react-icons/fi";
import UBLogoLight from "../assets/UBlogo-light.png";
import UBLogoDark from "../assets/UBlogo-dark.png";
import Home2Logo from "../assets/Home2_Suites_by_Hilton_logo.png";
import Home2Dark from "../assets/Home2-Logo-White.png";
import ComfortInnLogo from "../assets/comfort_inn.png";
import ComfortDark from "../assets/comfort_inn-white.png";
import { useDarkMode } from "../utilities/DarkModeProvider.jsx";
import useLocalStorage from "../utilities/useLocalStorage.jsx";
import { useAuth } from "../utilities/AuthProvider.jsx";
import DarkModeToggle from "../utilities/DarkModeToggle.jsx";
import AuthLayout from "../components/AuthLayout.jsx";
import ToastStack from "../components/ToastStack.jsx";

function Login() {
  const { currentTheme } = useDarkMode();
  const navigate = useNavigate();
  const [email, setEmail] = useLocalStorage("userEmail", "");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [toasts, setToasts] = useState([]);
  const toastTimeoutsRef = useRef([]);

  const { authProviderLogin } = useAuth();

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    toastTimeoutsRef.current = toastTimeoutsRef.current.filter((entry) => {
      if (entry.id === id) {
        window.clearTimeout(entry.timeoutId);
        return false;
      }
      return true;
    });
  };

  const pushToast = ({ title, description, tone = "info" }) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, title, description, tone }]);

    const timeoutId = window.setTimeout(() => {
      dismissToast(id);
    }, 5000);

    toastTimeoutsRef.current.push({ id, timeoutId });
  };

  useEffect(() => () => {
    toastTimeoutsRef.current.forEach(({ timeoutId }) => window.clearTimeout(timeoutId));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");
    const loginResponse = await authProviderLogin(email, password);
    if (loginResponse === true) {
      pushToast({
        tone: "success",
        title: "Welcome back",
        description: "You have signed in successfully.",
      });
      window.setTimeout(() => navigate("/"), 600);
    } else {
      const message =
        typeof loginResponse === "string" && loginResponse.trim().length > 0
          ? loginResponse
          : "We couldn’t verify those credentials.";
      setLoginError(message);
      pushToast({
        tone: "error",
        title: "Sign in failed: Incorrect Username or Password",
        description: message,
      });
    }
  };

  const asideContent = (
    <>
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
          <div
            className="relative w-full h-[150px] rounded-3xl border border-white/20 bg-white/10 p-6 
                  backdrop-blur-sm shadow-lg shadow-emerald-900/10 ring-1 ring-white/10 
                  dark:bg-slate-900/20 flex items-center justify-center"
          >
            <p
              className="text-lg font-semibold uppercase text-center tracking-[0.3em] 
                 text-emerald-700 opacity-80 animate-fade-in-up [animation-delay:400ms] 
                 dark:text-emerald-200"
            >
              Coming Soon
            </p>
          </div>
        </figure>
      </div>
    </>
  );

  return (
    <AuthLayout aside={asideContent}>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-300">
              <FiTrendingUp className="h-4 w-4" />
              Welcome back
            </span>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
              Sign in to UB Operations Hub
            </h1>
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

        {/* {loginError && (
          <div className="flex items-start gap-3 rounded-3xl border border-rose-200/70 bg-rose-50/80 p-4 text-sm text-rose-700 shadow-sm transition-all duration-500 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
            <FiAlertTriangle className="mt-0.5 h-5 w-5" />
            <p>{loginError}</p>
          </div>
        )} */}

        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
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
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              id="email"
              className="block w-full rounded-2xl border border-transparent bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-inner shadow-slate-200/60 transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-400/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-emerald-400/70 dark:focus:bg-slate-900/60"
              placeholder="name@company.com"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400"
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              id="password"
              placeholder="••••••••"
              className="block w-full rounded-2xl border border-transparent bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-inner shadow-slate-200/60 transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-400/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-emerald-400/70 dark:focus:bg-slate-900/60"
              required
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex cursor-pointer select-none items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/70 px-3 py-2 text-sm text-slate-600 transition-all duration-300 hover:border-emerald-300/70 dark:border-slate-700/60 dark:bg-slate-800/40 dark:text-slate-300">
              <input
                id="remember"
                aria-describedby="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-900"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="inline-flex items-center justify-center rounded-2xl border border-transparent px-4 py-2 text-sm font-medium text-emerald-600 transition-colors duration-300 hover:text-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-emerald-300 dark:hover:text-emerald-200 dark:focus-visible:ring-offset-slate-900"
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/50 transition-all duration-500 hover:from-emerald-600 hover:via-sky-500 hover:to-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
          >
            Sign in
          </button>
        </form>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Don’t have an account yet?
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="ml-2 inline-flex items-center justify-center rounded-2xl border border-transparent px-3 py-1 text-sm font-semibold text-emerald-600 transition-colors duration-300 hover:text-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-emerald-300 dark:hover:text-emerald-200 dark:focus-visible:ring-offset-slate-900"
          >
            Sign up
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Login;
