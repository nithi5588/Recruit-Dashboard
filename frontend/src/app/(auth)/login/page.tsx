"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AuthStoryPanel } from "@/components/auth/AuthStoryPanel";
import {
  Divider,
  PasswordInput,
  TextInput,
} from "@/components/auth/FormField";
import {
  GoogleIcon,
  LockIcon,
  MailIcon,
  MicrosoftIcon,
} from "@/components/icons/Icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Enter your email address";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      next.email = "Enter a valid email address";
    if (!password) next.password = "Enter your password";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitting(true);
    // TODO: wire to auth API
    setTimeout(() => setSubmitting(false), 800);
  }

  return (
    <>
      <section className="order-2 bg-[color:var(--color-bg-base)] lg:order-1">
        <AuthStoryPanel
          heading="Welcome back"
          emoji="👋"
          subheading="Sign in to your recruiter account and continue managing candidates."
        />
      </section>

      <section className="order-1 flex items-center px-6 py-10 sm:px-10 sm:py-12 lg:order-2 lg:px-12">
        <div className="mx-auto w-full max-w-[420px] space-y-7">
          <div className="space-y-2">
            <h2 className="text-[26px] font-bold leading-[34px] tracking-tight text-[color:var(--color-text)]">
              Sign in
            </h2>
            <p className="text-[14px] leading-[22px] text-[color:var(--color-text-secondary)]">
              Welcome back! Please sign in to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <TextInput
              label="Email address"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email"
              icon={<MailIcon />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              errorText={errors.email}
            />

            <div className="space-y-2">
              <PasswordInput
                label="Password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                icon={<LockIcon />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                errorText={errors.password}
              />
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="link-brand text-[13px]"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <Divider label="or continue with" />

          <div className="space-y-3">
            <button type="button" className="btn-secondary">
              <GoogleIcon />
              Continue with Google
            </button>
            <button type="button" className="btn-secondary">
              <MicrosoftIcon />
              Continue with Microsoft
            </button>
          </div>

          <p className="text-center text-[13px] text-[color:var(--color-text-secondary)]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="link-brand">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
