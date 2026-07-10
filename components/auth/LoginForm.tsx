"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/services/authService";
import { isValidEmail } from "@/lib/utils/validation/validation";
import { Button } from "@/components/shared/Button/Button";
import { IconButton } from "@/components/shared/IconButton/IconButton";
import styles from "./LoginForm.module.css";

interface FieldErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      next.email = "Enter a valid email address.";
    }
    if (!password) {
      next.password = "Password is required.";
    }
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      setFormError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>T</div>
        </div>

        <h1 className={styles.heading}>Welcome back</h1>
        <p className={styles.subheading}>Sign in to view your portfolio.</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {formError && <div className={styles.formError}>{formError}</div>}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <div className={styles.inputWrap}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email)}
                disabled={submitting}
              />
            </div>
            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <div className={styles.inputWrap}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(errors.password)}
                disabled={submitting}
              />
              <IconButton
                icon={showPassword ? "eye-off" : "eye"}
                label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                className={styles.togglePasswordPosition}
              />
            </div>
            {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
          </div>

          <Button type="submit" fullWidth loading={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>

          <Button
            type="button"
            variant="text"
            fullWidth
            onClick={() => setNotice("Password reset isn't available in this demo.")}
          >
            Forgot password?
          </Button>

          {notice && <p className={styles.notice}>{notice}</p>}
        </form>

        <div className={styles.divider} />

        <p className={styles.signupPrompt}>Don&apos;t have an account?</p>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={() => setNotice("Account creation isn't part of this demo — use Sign in instead.")}
        >
          Create a Trove account
        </Button>

        <p className={styles.hint}>This is a demo — any email and password will sign you in.</p>
      </div>
    </div>
  );
}
