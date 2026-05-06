"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
  useState,
} from "react";
import { ArrowDown2 } from "iconsax-reactjs";
import { EyeIcon, EyeOffIcon } from "@/components/icons/Icons";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode;
  helperText?: string;
  errorText?: string;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    { label, icon, helperText, errorText, id, className, ...props },
    ref
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const describedBy = errorText
      ? `${inputId}-error`
      : helperText
        ? `${inputId}-helper`
        : undefined;

    return (
      <div className={className}>
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
        <div className="relative">
          {icon ? (
            <span
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]"
              aria-hidden
            >
              {icon}
            </span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={errorText ? true : undefined}
            aria-describedby={describedBy}
            className="input-base"
            style={icon ? undefined : { paddingLeft: 14 }}
            {...props}
          />
        </div>
        {errorText ? (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-[12px] leading-[18px] text-[color:var(--color-error)]"
          >
            {errorText}
          </p>
        ) : helperText ? (
          <p
            id={`${inputId}-helper`}
            className="mt-1.5 flex items-center gap-1.5 text-[12px] leading-[18px] text-[color:var(--color-text-secondary)]"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

type PasswordInputProps = Omit<TextInputProps, "icon" | "type"> & {
  icon?: ReactNode;
};

export function PasswordInput({
  label,
  icon,
  helperText,
  errorText,
  id,
  className,
  ...props
}: PasswordInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [visible, setVisible] = useState(false);
  const describedBy = errorText
    ? `${inputId}-error`
    : helperText
      ? `${inputId}-helper`
      : undefined;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="field-label">
        {label}
      </label>
      <div className="relative">
        {icon ? (
          <span
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]"
            aria-hidden
          >
            {icon}
          </span>
        ) : null}
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          aria-invalid={errorText ? true : undefined}
          aria-describedby={describedBy}
          className="input-base"
          style={{ paddingRight: 44, paddingLeft: icon ? 42 : 14 }}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)]"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {errorText ? (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-[12px] leading-[18px] text-[color:var(--color-error)]"
        >
          {errorText}
        </p>
      ) : helperText ? (
        <p
          id={`${inputId}-helper`}
          className="mt-1.5 flex items-center gap-1.5 text-[12px] leading-[18px] text-[color:var(--color-success)]"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

type SelectProps = InputHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export function Select({
  label,
  options,
  placeholder,
  id,
  className,
  ...props
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <div className={className}>
      <label htmlFor={selectId} className="field-label">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          className="input-base appearance-none pr-10"
          style={{ paddingLeft: 14 }}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]"
          aria-hidden
        >
          <ArrowDown2 size={18} color="currentColor" variant="Linear" />
        </span>
      </div>
    </div>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div
      className="relative flex items-center justify-center"
      role="separator"
      aria-label={label}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[color:var(--color-border)]"
      />
      <span className="relative bg-[color:var(--color-surface)] px-3 text-[12px] font-medium text-[color:var(--color-text-secondary)]">
        {label}
      </span>
    </div>
  );
}
