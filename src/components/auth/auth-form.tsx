"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState<"email" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const supabase = createClient();
  const demoMode = !supabase;

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    // Demo mode: no backend — drop straight into the app.
    if (demoMode) {
      router.push("/dashboard");
      return;
    }

    setLoading("email");
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setNotice("Check your inbox to confirm your email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(null);
    }
  }

  async function handleGoogle() {
    setError(null);
    if (demoMode) {
      router.push("/dashboard");
      return;
    }
    setLoading("google");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setLoading(null);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md"
    >
      <div className="glass-strong rounded-3xl p-8 shadow-card">
        <h1 className="font-display text-2xl font-bold">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {mode === "login"
            ? "Sign in to keep climbing the leaderboard."
            : "Join free and start tipping in seconds."}
        </p>

        {demoMode && (
          <p className="mt-4 rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 px-3 py-2 text-xs text-neon-cyan">
            Demo mode — Supabase isn&apos;t configured, so any button drops you
            straight into the app.
          </p>
        )}

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading !== null}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-white/5 px-4 py-3 text-sm font-medium transition hover:border-white/25 hover:bg-white/10 disabled:opacity-50"
        >
          {loading === "google" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-ink-subtle">
          <span className="h-px flex-1 bg-line" /> or {mode === "login" ? "sign in" : "sign up"} with email
          <span className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          {mode === "register" && (
            <InputField
              icon={User}
              type="text"
              placeholder="Username"
              value={username}
              onChange={setUsername}
              required
            />
          )}
          <InputField
            icon={Mail}
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={setEmail}
            required={!demoMode}
          />
          <InputField
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            required={!demoMode}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}
          {notice && <p className="text-sm text-neon-green">{notice}</p>}

          <Button type="submit" className="w-full" disabled={loading !== null}>
            {loading === "email" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : mode === "login" ? (
              "Sign in"
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          {mode === "login" ? (
            <>
              New here?{" "}
              <Link href="/register" className="font-medium text-neon-green hover:underline">
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-neon-green hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </motion.div>
  );
}

function InputField({
  icon: Icon,
  ...props
}: {
  icon: typeof Mail;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const { onChange, ...rest } = props;
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
      <input
        {...rest}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-xl border border-line bg-white/[0.02] py-3 pl-10 pr-3.5 text-sm outline-none transition placeholder:text-ink-subtle",
          "focus:border-neon-green/50 focus:ring-2 focus:ring-neon-green/20"
        )}
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
