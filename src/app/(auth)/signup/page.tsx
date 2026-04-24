"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { AuthStoryPanel } from "@/components/auth/AuthStoryPanel";
import {
  Divider,
  PasswordInput,
  Select,
  TextInput,
} from "@/components/auth/FormField";
import {
  BuildingIcon,
  CheckCircleIcon,
  GoogleIcon,
  LockIcon,
  MailIcon,
  MicrosoftIcon,
  UserIcon,
} from "@/components/icons/Icons";

type FormState = {
  fullName: string;
  email: string;
  password: string;
  company: string;
  role: string;
  agree: boolean;
};

const roleOptions = [
  { value: "recruiter", label: "Recruiter" },
  { value: "candidate-marketing", label: "Candidate Marketing" },
  { value: "operations-manager", label: "Recruitment Operations Manager" },
  { value: "account-manager", label: "Account Manager" },
  { value: "team-lead", label: "Team Lead" },
];

export default function SignupPage() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    password: "",
    company: "",
    role: "",
    agree: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const passwordStrong = useMemo(() => {
    const p = form.password;
    return (
      p.length >= 8 &&
      /[A-Za-z]/.test(p) &&
      /\d/.test(p) &&
      /[^A-Za-z0-9]/.test(p)
    );
  }, [form.password]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.fullName.trim()) next.fullName = "Enter your full name";
    if (!form.email.trim()) next.email = "Enter your work email";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email address";
    if (!form.password) next.password = "Create a password";
    else if (!passwordStrong)
      next.password =
        "Use at least 8 characters with letters, numbers, and symbols";
    if (!form.company.trim()) next.company = "Enter your company name";
    if (!form.role) next.role = "Select your role";
    if (!form.agree) next.agree = "Please accept the terms to continue";
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
          heading="Create your account"
          emoji="🚀"
          subheading="Join Recruit and start finding the right talent faster."
        />
      </section>

      <section className="order-1 flex items-center px-6 py-10 sm:px-10 sm:py-12 lg:order-2 lg:px-12">
        <div className="mx-auto w-full max-w-[440px] space-y-6">
          <div className="space-y-2">
            <h2 className="text-[26px] font-bold leading-[34px] tracking-tight text-[color:var(--color-text)]">
              Sign up
            </h2>
            <p className="text-[14px] leading-[22px] text-[color:var(--color-text-secondary)]">
              Create your account to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <TextInput
              label="Full name"
              name="fullName"
              autoComplete="name"
              placeholder="Enter your full name"
              icon={<UserIcon />}
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              errorText={errors.fullName}
            />

            <TextInput
              label="Work email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your work email"
              icon={<MailIcon />}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              errorText={errors.email}
            />

            <div>
              <PasswordInput
                label="Password"
                name="password"
                autoComplete="new-password"
                placeholder="Create a password"
                icon={<LockIcon />}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                errorText={errors.password}
              />
              {!errors.password ? (
                <p
                  className={`mt-1.5 flex items-center gap-1.5 text-[12px] leading-[18px] ${
                    passwordStrong
                      ? "text-[color:var(--color-success)]"
                      : "text-[color:var(--color-text-secondary)]"
                  }`}
                >
                  <CheckCircleIcon />
                  At least 8 characters with a mix of letters, numbers &amp; symbols
                </p>
              ) : null}
            </div>

            <TextInput
              label="Company name"
              name="company"
              autoComplete="organization"
              placeholder="Enter your company name"
              icon={<BuildingIcon />}
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              errorText={errors.company}
            />

            <Select
              label="Role"
              name="role"
              placeholder="Select your role"
              options={roleOptions}
              value={form.role}
              onChange={(e) =>
                update("role", (e.target as HTMLSelectElement).value)
              }
            />
            {errors.role ? (
              <p className="-mt-2 text-[12px] leading-[18px] text-[color:var(--color-error)]">
                {errors.role}
              </p>
            ) : null}

            <label className="flex items-start gap-2.5 pt-1 text-[13px] leading-[20px] text-[color:var(--color-text-secondary)]">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => update("agree", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[color:var(--color-border-strong)] text-[color:var(--color-brand-500)] accent-[color:var(--color-brand-500)]"
                aria-invalid={errors.agree ? true : undefined}
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="link-brand">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="link-brand">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agree ? (
              <p className="-mt-2 text-[12px] leading-[18px] text-[color:var(--color-error)]">
                {errors.agree}
              </p>
            ) : null}

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? "Creating account..." : "Create account"}
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
            Already have an account?{" "}
            <Link href="/login" className="link-brand">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
