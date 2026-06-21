import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { login, register } from "~/lib/auth";
import { useLanguage } from "~/lib/i18n";

export function meta() {
  return [
    { title: "Sign in | Schick" },
    { name: "description", content: "Sign in to your Schick account." },
  ];
}

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-14">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          Schick
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {mode === "login" ? t("login.welcomeBack") : t("login.createYourAccount")}
        </p>
      </div>

      {mode === "login" ? (
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4"
        >
          <AuthField
            id="email"
            label={t("login.email")}
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            placeholder="you@example.com"
          />

          <AuthField
            id="password"
            label={t("login.password")}
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            placeholder="••••••••"
          />

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-zinc-950 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? t("login.pleaseWait") : t("login.signIn")}
          </button>
        </form>
      ) : (
        <SignupWizard onSwitchToLogin={() => setMode("login")} />
      )}

      <p className="mt-5 text-center text-sm text-zinc-500">
        {mode === "login" ? t("login.noAccount") : t("login.hasAccount")}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError(null);
          }}
          className="font-semibold text-zinc-950 underline-offset-2 hover:underline"
        >
          {mode === "login" ? t("login.signUp") : t("login.signIn")}
        </button>
      </p>
    </main>
  );
}

type SignupStep = 1 | 2 | 3 | 4;

function SignupWizard({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState<SignupStep>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [name, setName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const canUsePassword = passwordStrength.score >= 3;
  const passwordsMatch = password.length > 0 && password === passwordAgain;

  function nextStep() {
    setError(null);
    if (step === 1 && !agreeTerms) {
      setError(t("signup.errorTerms"));
      return;
    }
    if (step === 2) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError(t("checkout.validEmail"));
        return;
      }
      if (!canUsePassword) {
        setError(t("signup.errorPasswordWeak"));
        return;
      }
      if (!passwordsMatch) {
        setError(t("signup.errorPasswordMatch"));
        return;
      }
    }
    if (step === 3 && !name.trim()) {
      setError(t("signup.errorName"));
      return;
    }
    setStep((current) => Math.min(current + 1, 4) as SignupStep);
  }

  async function completeSignup(e: React.FormEvent) {
    e.preventDefault();
    if (step !== 3) {
      nextStep();
      return;
    }

    if (!name.trim()) {
      setError(t("signup.errorName"));
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await register(email, password);
      await login(email, password);
      try {
        localStorage.setItem(
          "schick_signup_profile",
          JSON.stringify({
            name: name.trim(),
            marketingConsent,
          })
        );
      } catch {
        // Profile details are optional client preferences until a profile API exists.
      }
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  }

  if (step === 4) {
    return (
      <section className="rounded-3xl border border-zinc-100 bg-white p-8 text-center shadow-sm md:p-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c8a96e]">
          {t("signup.welcomeEyebrow")}
        </p>
        <h2
          className="mt-3 text-4xl font-light text-zinc-950 md:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("signup.welcomeTitle", { name: name.trim() || t("profile.profile") })}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
          {t("signup.welcomeDescription")}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/profile", { replace: true })}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            {t("signup.goToAccount")}
          </button>
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 px-8 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            {t("cart.continueShopping")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form
      onSubmit={completeSignup}
      className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm md:p-8"
    >
      <SignupStepper step={step} />

      {step === 1 && (
        <section className="space-y-5">
          <StepHeader
            eyebrow={t("signup.stepOneEyebrow")}
            title={t("signup.termsTitle")}
            description={t("signup.termsDescription")}
          />
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5 text-sm leading-relaxed text-zinc-500">
            <p>{t("signup.licenseIntro")}</p>
            <ul className="mt-4 space-y-2">
              <li>• {t("signup.licenseTermOne")}</li>
              <li>• {t("signup.licenseTermTwo")}</li>
              <li>• {t("signup.licenseTermThree")}</li>
            </ul>
          </div>
          <CheckboxField
            checked={agreeTerms}
            onChange={setAgreeTerms}
            label={t("signup.agreeTerms")}
          />
        </section>
      )}

      {step === 2 && (
        <section className="space-y-5">
          <StepHeader
            eyebrow={t("signup.stepTwoEyebrow")}
            title={t("signup.securityTitle")}
            description={t("signup.securityDescription")}
          />
          <AuthField
            id="signup-email"
            label={t("login.email")}
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            placeholder="you@example.com"
          />
          <AuthField
            id="signup-password"
            label={t("signup.password")}
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <PasswordStrengthMeter strength={passwordStrength} />
          <AuthField
            id="signup-password-again"
            label={t("signup.passwordAgain")}
            type="password"
            value={passwordAgain}
            onChange={setPasswordAgain}
            autoComplete="new-password"
            placeholder="••••••••"
          />
          {passwordAgain && (
            <p className={`text-xs ${passwordsMatch ? "text-emerald-600" : "text-red-600"}`}>
              {passwordsMatch ? t("signup.passwordsMatch") : t("signup.passwordsDoNotMatch")}
            </p>
          )}
        </section>
      )}

      {step === 3 && (
        <section className="space-y-5">
          <StepHeader
            eyebrow={t("signup.stepThreeEyebrow")}
            title={t("signup.profileTitle")}
            description={t("signup.profileDescription")}
          />
          <AuthField
            id="signup-name"
            label={t("signup.name")}
            value={name}
            onChange={setName}
            autoComplete="name"
            placeholder={t("signup.namePlaceholder")}
          />
          <CheckboxField
            checked={marketingConsent}
            onChange={setMarketingConsent}
            label={t("signup.marketingConsent")}
            description={t("signup.marketingConsentDescription")}
          />
        </section>
      )}

      {error && (
        <p className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => {
              setError(null);
              setStep((current) => Math.max(current - 1, 1) as SignupStep);
            }}
            className="h-12 rounded-xl border border-zinc-200 px-6 text-sm font-semibold text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
          >
            {t("checkout.previousStep")}
          </button>
        ) : (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="h-12 rounded-xl border border-zinc-200 px-6 text-sm font-semibold text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
          >
            {t("signup.backToSignIn")}
          </button>
        )}

        <button
          type={step === 3 ? "submit" : "button"}
          disabled={loading}
          onClick={step === 3 ? undefined : nextStep}
          className="h-12 rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading
            ? t("login.pleaseWait")
            : step === 3
              ? t("signup.finishSignup")
              : t("signup.continue")}
        </button>
      </div>
    </form>
  );
}

function SignupStepper({ step }: { step: SignupStep }) {
  const { t } = useLanguage();
  const steps = [
    t("signup.stepTerms"),
    t("signup.stepSecurity"),
    t("signup.stepProfile"),
  ];

  return (
    <ol className="mb-8 grid gap-3 sm:grid-cols-3">
      {steps.map((label, index) => {
        const current = index + 1;
        const isActive = current === step;
        const isComplete = current < step;
        return (
          <li key={label} className="flex items-center gap-3">
            <span
              className={[
                "flex size-8 items-center justify-center rounded-full border text-[10px] font-semibold",
                isActive
                  ? "border-zinc-950 bg-zinc-950 text-white"
                  : isComplete
                    ? "border-[#c8a96e] bg-[#c8a96e] text-white"
                    : "border-zinc-200 text-zinc-300",
              ].join(" ")}
            >
              {isComplete ? "✓" : current}
            </span>
            <span
              className={[
                "text-xs font-semibold uppercase tracking-[0.12em]",
                isActive ? "text-zinc-950" : "text-zinc-400",
              ].join(" ")}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function StepHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c8a96e]">
        {eyebrow}
      </p>
      <h2
        className="mt-2 text-3xl font-light text-zinc-950"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{description}</p>
    </div>
  );
}

function AuthField({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-medium text-zinc-600">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none ring-zinc-950 transition focus:border-zinc-400 focus:ring-2"
        placeholder={placeholder}
      />
    </div>
  );
}

function CheckboxField({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-2xl border border-zinc-100 p-4 transition hover:border-zinc-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 size-4 accent-zinc-950"
      />
      <span>
        <span className="block text-sm font-medium text-zinc-950">{label}</span>
        {description && (
          <span className="mt-1 block text-xs leading-relaxed text-zinc-400">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

interface PasswordStrength {
  score: number;
  labelKey: string;
  checks: { key: string; passed: boolean }[];
}

function getPasswordStrength(password: string): PasswordStrength {
  const checks = [
    { key: "signup.passwordRuleLength", passed: password.length >= 8 },
    { key: "signup.passwordRuleCase", passed: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { key: "signup.passwordRuleNumber", passed: /\d/.test(password) },
    { key: "signup.passwordRuleSymbol", passed: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((check) => check.passed).length;
  const labelKey =
    score <= 1
      ? "signup.passwordWeak"
      : score <= 3
        ? "signup.passwordGood"
        : "signup.passwordStrong";

  return { score, labelKey, checks };
}

function PasswordStrengthMeter({ strength }: { strength: PasswordStrength }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl bg-zinc-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-zinc-600">{t("signup.passwordSafety")}</p>
        <p className="text-xs font-semibold text-zinc-950">{t(strength.labelKey)}</p>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <span
            key={index}
            className={[
              "h-1 rounded-full",
              index < strength.score ? "bg-zinc-950" : "bg-zinc-200",
            ].join(" ")}
          />
        ))}
      </div>
      <ul className="mt-4 grid gap-2 text-xs text-zinc-500 sm:grid-cols-2">
        {strength.checks.map((check) => (
          <li key={check.key} className="flex items-center gap-2">
            <span className={check.passed ? "text-emerald-600" : "text-zinc-300"}>
              {check.passed ? "✓" : "○"}
            </span>
            {t(check.key)}
          </li>
        ))}
      </ul>
    </div>
  );
}
