import { useState } from "react";
import { User, Moon, Smartphone, Loader2 } from "lucide-react";

const opt = (...vals) => vals.map((v) => ({ value: v, label: v }));

// Values are sent to FastAPI exactly as written here (including "Undergradute").
export const OPTIONS = {
  gender: opt("Male", "Female"),
  academic_level: [
    { value: "Undergradute", label: "Undergraduate" }, // label corrected for display only
    { value: "Graduate", label: "Graduate" },
    { value: "High School", label: "High School" },
  ],
  most_used_platform: opt("Facebook", "LinkedIn", "Instagram", "Snapchat", "Twitter", "YouTube", "TikTok",
    "LINE", "KakaoTalk", "VKontakte", "WhatsApp", "WeChat"),
  purpose_of_use: opt("Networking", "Education", "Entertainment", "News"),
  stress_level: opt("Low", "Medium", "High", "Very High"),
};

const DEFAULTS = {
  age: "22", gender: "Male", country: "India", academic_level: "Undergradute",
  most_used_platform: "Instagram", purpose_of_use: "Entertainment",
  avg_Daily_Usage_Hours: "5.5", daily_Unlocks: "85", study_Hours: "4",
  physical_Activity_Hours: "1.5", sleep_Hours_Per_Night: "7.5", stress_level: "Medium",
};

const HOUR_KEYS = ["avg_Daily_Usage_Hours", "study_Hours", "physical_Activity_Hours", "sleep_Hours_Per_Night"];
const isInt = (s) => /^-?\d+$/.test(String(s).trim());
const isNum = (s) => String(s).trim() !== "" && Number.isFinite(Number(s));

export function validate(v) {
  const e = {};
  if (!isInt(v.age)) e.age = "Enter a whole number.";
  else if (Number(v.age) < 10 || Number(v.age) > 100) e.age = "Age must be between 10 and 100.";

  if (!v.country.trim()) e.country = "Country is required.";
  else if (v.country.trim().length > 80) e.country = "Country is too long.";

  for (const key of Object.keys(OPTIONS)) {
    if (!OPTIONS[key].some((o) => o.value === v[key])) e[key] = "Choose one of the listed options.";
  }
  for (const key of HOUR_KEYS) {
    if (!isNum(v[key])) e[key] = "Enter a number.";
    else if (Number(v[key]) < 0 || Number(v[key]) > 24) e[key] = "Must be between 0 and 24 hours.";
  }
  if (!isInt(v.daily_Unlocks)) e.daily_Unlocks = "Enter a whole number.";
  else if (Number(v.daily_Unlocks) < 0) e.daily_Unlocks = "Cannot be negative.";
  return e;
}

export function toPayload(v) {
  return {
    age: parseInt(v.age, 10),
    gender: v.gender,
    country: v.country.trim(),
    academic_level: v.academic_level,
    most_used_platform: v.most_used_platform,
    purpose_of_use: v.purpose_of_use,
    avg_Daily_Usage_Hours: Number(v.avg_Daily_Usage_Hours),
    daily_Unlocks: parseInt(v.daily_Unlocks, 10),
    study_Hours: Number(v.study_Hours),
    physical_Activity_Hours: Number(v.physical_Activity_Hours),
    sleep_Hours_Per_Night: Number(v.sleep_Hours_Per_Night),
    stress_level: v.stress_level,
  };
}

const inputCls =
  "w-full rounded-xl border bg-field px-3.5 py-2.5 text-sm text-white placeholder:text-lav/40 transition focus:border-iris";
const borderFor = (err) => (err ? "border-red-400/70" : "border-edge");

function Field({ id, label, unit, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-lav">
        {label}
        {unit && <span className="ml-1 font-normal text-lav/50">({unit})</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-300" role="alert">{error}</p>}
    </div>
  );
}

function SelectField({ id, label, value, onChange, options, error }) {
  return (
    <Field id={id} label={label} error={error}>
      <select id={id} value={value} onChange={(e) => onChange(id, e.target.value)} className={`${inputCls} ${borderFor(error)}`}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  );
}

function NumberField({ id, label, unit, value, onChange, error, step = 1, min }) {
  return (
    <Field id={id} label={label} unit={unit} error={error}>
      <input id={id} type="number" inputMode="numeric" step={step} min={min} value={value}
        onChange={(e) => onChange(id, e.target.value)} className={`${inputCls} ${borderFor(error)}`} />
    </Field>
  );
}

function HoursField({ id, label, value, onChange, error }) {
  const n = Number(value);
  const sliderValue = Number.isFinite(n) ? Math.min(24, Math.max(0, n)) : 0;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-lav">{label}</label>
        <div className="flex items-center gap-1.5">
          <input id={id} type="number" inputMode="decimal" step="0.5" min="0" max="24" value={value}
            onChange={(e) => onChange(id, e.target.value)}
            className={`w-20 rounded-lg border bg-field px-2.5 py-1.5 text-right text-sm text-white focus:border-iris ${borderFor(error)}`} />
          <span className="text-xs text-lav/50">hours</span>
        </div>
      </div>
      <input type="range" min="0" max="24" step="0.5" value={sliderValue}
        aria-label={`${label} slider`} onChange={(e) => onChange(id, e.target.value)} />
      {error && <p className="mt-1 text-xs text-red-300" role="alert">{error}</p>}
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <fieldset className="rounded-[18px] border border-edge bg-panel/80 p-5 sm:p-6">
      <legend className="sr-only">{title}</legend>
      <div className="mb-5 flex items-center gap-2.5">
        <Icon size={18} className="text-iris" aria-hidden="true" />
        <h2 className="font-display text-xl text-white">{title}</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export default function PredictionForm({ onSubmit, loading }) {
  const [values, setValues] = useState(DEFAULTS);
  const [errors, setErrors] = useState({});

  const change = (key, val) => {
    setValues((v) => ({ ...v, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (loading) return;
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(toPayload(values));
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Section icon={User} title="About You">
        <NumberField id="age" label="Age" unit="years" min="10" value={values.age} onChange={change} error={errors.age} />
        <SelectField id="gender" label="Gender" value={values.gender} onChange={change} options={OPTIONS.gender} error={errors.gender} />
        <Field id="country" label="Country" error={errors.country}>
          <input id="country" type="text" value={values.country} onChange={(e) => change("country", e.target.value)}
            className={`${inputCls} ${borderFor(errors.country)}`} />
        </Field>
        <SelectField id="academic_level" label="Academic Level" value={values.academic_level} onChange={change}
          options={OPTIONS.academic_level} error={errors.academic_level} />
      </Section>

      <Section icon={Moon} title="Daily Rhythm">
        <HoursField id="sleep_Hours_Per_Night" label="Sleep per night" value={values.sleep_Hours_Per_Night} onChange={change} error={errors.sleep_Hours_Per_Night} />
        <HoursField id="study_Hours" label="Study hours" value={values.study_Hours} onChange={change} error={errors.study_Hours} />
        <HoursField id="physical_Activity_Hours" label="Physical activity" value={values.physical_Activity_Hours} onChange={change} error={errors.physical_Activity_Hours} />
        <SelectField id="stress_level" label="Stress Level" value={values.stress_level} onChange={change} options={OPTIONS.stress_level} error={errors.stress_level} />
      </Section>

      <Section icon={Smartphone} title="Digital Habits">
        <SelectField id="most_used_platform" label="Most Used Platform" value={values.most_used_platform} onChange={change}
          options={OPTIONS.most_used_platform} error={errors.most_used_platform} />
        <SelectField id="purpose_of_use" label="Purpose of Use" value={values.purpose_of_use} onChange={change}
          options={OPTIONS.purpose_of_use} error={errors.purpose_of_use} />
        <HoursField id="avg_Daily_Usage_Hours" label="Average daily usage" value={values.avg_Daily_Usage_Hours} onChange={change} error={errors.avg_Daily_Usage_Hours} />
        <NumberField id="daily_Unlocks" label="Daily Unlocks" unit="per day" min="0" value={values.daily_Unlocks} onChange={change} error={errors.daily_Unlocks} />
      </Section>

      <button type="submit" disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#B7A0FF] to-[#9B83F5] px-6 py-3.5 text-sm font-semibold text-[#090D22] shadow-lg shadow-iris/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? (<><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Predicting…</>) : "Predict score"}
      </button>
    </form>
  );
}
