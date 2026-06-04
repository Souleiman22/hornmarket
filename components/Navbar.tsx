"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useTheme } from "./providers/ThemeProvider";
import { useLang } from "./providers/LanguageProvider";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useLang();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
          <span className="bg-orange-500 text-white text-sm font-black px-2 py-0.5 rounded-lg">HM</span>
          <span className="text-orange-500">Horn</span><span>Market</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/annonces" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 text-sm font-medium transition">
            {t.browse}
          </Link>
          {session ? (
            <>
              <Link href="/messages" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 text-sm font-medium transition">
                {t.messages}
              </Link>
              <Link href="/favorites" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 text-sm font-medium transition">
                {t.favorites}
              </Link>
              <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 text-sm font-medium transition">
                {t.mySpace}
              </Link>
              <Link
                href="/annonces/new"
                className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-orange-600 transition shadow-sm"
              >
                {t.post}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 text-sm transition"
              >
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 text-sm font-medium transition">
                {t.login}
              </Link>
              <Link
                href="/register"
                className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-orange-600 transition shadow-sm"
              >
                {t.register}
              </Link>
            </>
          )}

          {/* Language switcher */}
          <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden text-xs font-bold">
            <button
              onClick={() => setLang("fr")}
              className={`px-2.5 py-1 transition ${lang === "fr" ? "bg-orange-500 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >FR</button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 transition ${lang === "en" ? "bg-orange-500 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >EN</button>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            className="text-gray-500 dark:text-gray-400 hover:text-orange-500 transition text-lg"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggle} className="text-gray-500 dark:text-gray-400 text-lg" aria-label="Toggle dark mode">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            className="text-gray-600 dark:text-gray-300 text-2xl leading-none"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-4 flex flex-col gap-3">
          <Link href="/annonces" className="text-gray-700 dark:text-gray-300 text-sm font-medium hover:text-orange-500" onClick={() => setOpen(false)}>{t.browse}</Link>
          {session ? (
            <>
              <Link href="/messages" className="text-gray-700 dark:text-gray-300 text-sm font-medium hover:text-orange-500" onClick={() => setOpen(false)}>{t.messages}</Link>
              <Link href="/favorites" className="text-gray-700 dark:text-gray-300 text-sm font-medium hover:text-orange-500" onClick={() => setOpen(false)}>{t.favorites}</Link>
              <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 text-sm font-medium hover:text-orange-500" onClick={() => setOpen(false)}>{t.mySpace}</Link>
              <Link href="/annonces/new" className="bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full text-center hover:bg-orange-600" onClick={() => setOpen(false)}>{t.post}</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-400 text-sm text-left hover:text-gray-600">{t.logout}</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 dark:text-gray-300 text-sm font-medium hover:text-orange-500" onClick={() => setOpen(false)}>{t.login}</Link>
              <Link href="/register" className="bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full text-center hover:bg-orange-600" onClick={() => setOpen(false)}>{t.register}</Link>
            </>
          )}
          <div className="flex gap-2 pt-1">
            <button onClick={() => setLang("fr")} className={`px-3 py-1 rounded-full text-xs font-bold border ${lang === "fr" ? "bg-orange-500 text-white border-orange-500" : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}>FR</button>
            <button onClick={() => setLang("en")} className={`px-3 py-1 rounded-full text-xs font-bold border ${lang === "en" ? "bg-orange-500 text-white border-orange-500" : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}>EN</button>
          </div>
        </div>
      )}
    </nav>
  );
}
