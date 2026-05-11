"use client";

import React, { useMemo, useState } from "react";
import { Check, ChevronRight, ClipboardList, Compass, Lightbulb, ShieldCheck, Sparkles, Timer, Wand2 } from "lucide-react";

type FrictionKey = "cognitive" | "practical" | "social" | "timing" | "confidence";
type NudgeKey = "prompt" | "default" | "socialProof" | "frictionReduction" | "commitment" | "feedback" | "timing" | "identity";
type Lifecycle = "none" | "ai_drafted" | "edited_from_ai" | "human_rewritten";

type BehaviourForm = {
  desired: string;
  current: string;
  target: string;
  situation: string;
  context: string;
  channels: string;
  risk: "Low" | "Moderate" | "Sensitive";
};

type GeneratedNudge = {
  title: string;
  nudge: NudgeKey;
  rationale: string;
  test: string;
  risk: string;
  signal: string;
};

const frictionCards: Record<FrictionKey, { title: string; question: string; detail: string }> = {
  cognitive: {
    title: "Cognitive friction",
    question: "Is it unclear what to do?",
    detail: "People may not know what belongs in a channel, which format to use, or when to post.",
  },
  practical: {
    title: "Practical friction",
    question: "Is the desired behaviour harder than the old one?",
    detail: "The old path may be faster because email, private chat, or verbal updates require less setup.",
  },
  social: {
    title: "Social friction",
    question: "Does the behaviour feel exposed or unusual?",
    detail: "Posting publicly can feel risky when norms and expectations are not visible yet.",
  },
  timing: {
    title: "Timing friction",
    question: "Does the reminder happen too late?",
    detail: "The cue may arrive after people have already chosen the familiar behaviour.",
  },
  confidence: {
    title: "Confidence friction",
    question: "Are people unsure whether they are doing it correctly?",
    detail: "People may hesitate because they do not know what a good update looks like.",
  },
};

const nudgeLibrary: Record<NudgeKey, { title: string; principle: string; example: string; effect: string; bestFor: FrictionKey[] }> = {
  prompt: {
    title: "Prompt nudge",
    principle: "Place a clear reminder where the decision happens.",
    example: "Pin a project update template in the Teams channel: Update, Decision, Blocker, Next Step.",
    effect: "Reduces ambiguity at the moment of action.",
    bestFor: ["cognitive", "timing", "confidence"],
  },
  default: {
    title: "Default nudge",
    principle: "Make the desired behaviour the easiest starting point.",
    example: "Create projects from a Teams template with standard channels already in place.",
    effect: "Reduces setup friction and uncertainty.",
    bestFor: ["practical", "cognitive"],
  },
  socialProof: {
    title: "Social proof nudge",
    principle: "Show that peers already use the desired behaviour.",
    example: "Share examples of effective project update channels from similar teams.",
    effect: "Normalizes the behaviour socially.",
    bestFor: ["social", "confidence"],
  },
  frictionReduction: {
    title: "Friction reduction nudge",
    principle: "Remove small barriers that keep old habits alive.",
    example: "Pin the relevant channel, standardize names, and reduce duplicate places for updates.",
    effect: "Makes the new path easier than the old one.",
    bestFor: ["practical", "timing"],
  },
  commitment: {
    title: "Commitment nudge",
    principle: "Create a lightweight shared agreement.",
    example: "Agree that project decisions go into the Decisions channel before meetings.",
    effect: "Creates consistency without formal enforcement.",
    bestFor: ["social", "timing"],
  },
  feedback: {
    title: "Feedback nudge",
    principle: "Make positive movement visible without ranking people.",
    example: "Reflect weekly on whether fewer updates were lost in private email chains.",
    effect: "Reinforces progress and shared learning.",
    bestFor: ["confidence", "social"],
  },
  timing: {
    title: "Timing nudge",
    principle: "Trigger behaviour just before the relevant decision moment.",
    example: "Add a meeting reminder asking people to update the Teams channel before status review.",
    effect: "Improves behavioural timing.",
    bestFor: ["timing", "practical"],
  },
  identity: {
    title: "Identity nudge",
    principle: "Connect the behaviour to a shared team identity.",
    example: "Use the language: transparent teams work in shared channels.",
    effect: "Links the behaviour to belonging and professional norms.",
    bestFor: ["social", "confidence"],
  },
};

const initialForm: BehaviourForm = {
  desired: "Use Teams channels for project updates",
  current: "Send updates through email threads and private chats",
  target: "Project team members",
  situation: "Weekly status updates before project meetings",
  context: "M365 adoption across project delivery teams",
  channels: "Teams, Outlook calendar reminders, Planner",
  risk: "Moderate",
};

const ethics = [
  "Transparent enough to explain",
  "Easy to opt out of",
  "Aligned with user benefit",
  "Does not shame or manipulate",
  "Supports autonomy",
  "Fits institutional culture",
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function generateNudges(form: BehaviourForm, friction: FrictionKey, selected: NudgeKey[]): GeneratedNudge[] {
  const active = selected.length ? selected : Object.entries(nudgeLibrary)
    .filter(([, value]) => value.bestFor.includes(friction))
    .map(([key]) => key as NudgeKey)
    .slice(0, 3);

  return active.slice(0, 4).map((key) => {
    const item = nudgeLibrary[key];
    const base = `${form.desired || "the desired behaviour"}`;
    return {
      title: item.title,
      nudge: key,
      rationale: `${item.principle} This may help because ${frictionCards[friction].title.toLowerCase()} is making "${base}" less natural than the current habit.`,
      test: key === "prompt"
        ? `For two weeks, pin a simple update template in the relevant Teams channel and ask ${form.target} to use it before ${form.situation.toLowerCase()}.`
        : key === "timing"
        ? `For two weeks, place a reminder one working day before ${form.situation.toLowerCase()} so the channel update happens before the meeting cycle.`
        : key === "commitment"
        ? `Open one project meeting by agreeing where decisions and blockers will be posted, then review the agreement at the next meeting.`
        : key === "socialProof"
        ? `Share one calm example of a useful channel update from a peer team, without naming individuals as better or worse.`
        : key === "default"
        ? `Set up one project space with the expected channels and update pattern already visible before the team begins work.`
        : `Run a small experiment that makes ${base.toLowerCase()} easier to perform than ${form.current.toLowerCase()}.`,
      risk: key === "socialProof"
        ? "May feel comparative if examples are presented as winners. Keep the language observational and non-competitive."
        : key === "identity"
        ? "May feel slogan-like if not connected to real team practice. Invite the team to adapt the wording."
        : "May be ignored if introduced as another rule. Explain the purpose and keep participation reversible.",
      signal: key === "feedback"
        ? "Weekly reflection notes show fewer lost decisions and clearer follow-through."
        : `More ${form.target.toLowerCase()} place updates in the shared channel before the weekly review.`,
    };
  });
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs uppercase tracking-[0.18em] text-[#6E665C]">{children}</p>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={cx("rounded-2xl border border-[#D8CDBD] bg-[#F8F5EE] p-5 shadow-[0_1px_0_rgba(26,24,20,0.04)]", className)}>{children}</section>;
}

function GhostAiMarker({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#B8843D]/35 bg-[#B8843D]/10 p-3 text-sm text-[#5C4526] opacity-60" aria-label="AI suggestion marker">
      <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.14em]"><Sparkles className="h-3.5 w-3.5" /> Nudge Coach suggestion</div>
      {children}
    </div>
  );
}

export default function ChangeNudgingStudioPrototype() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<BehaviourForm>(initialForm);
  const [friction, setFriction] = useState<FrictionKey>("social");
  const [selectedNudges, setSelectedNudges] = useState<NudgeKey[]>(["prompt", "timing", "commitment"]);
  const [chosenPlan, setChosenPlan] = useState(0);
  const [ethicsChecked, setEthicsChecked] = useState<string[]>([ethics[0], ethics[2], ethics[4]]);
  const [lifecycle, setLifecycle] = useState<Lifecycle>("ai_drafted");
  const [owner, setOwner] = useState("Adoption lead");
  const [period, setPeriod] = useState("2 weeks");

  const nudges = useMemo(() => generateNudges(form, friction, selectedNudges), [form, friction, selectedNudges]);
  const selectedPlan = nudges[chosenPlan] || nudges[0];

  const steps = [
    "Reframe",
    "Behaviour",
    "Friction",
    "Nudge library",
    "Generate",
    "Ethics",
    "Mini plan",
  ];

  const updateForm = (key: keyof BehaviourForm, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const toggleNudge = (key: NudgeKey) => setSelectedNudges((prev) => prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]);
  const toggleEthic = (value: string) => setEthicsChecked((prev) => prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]);

  return (
    <main className="min-h-screen bg-[#F4F0E8] text-[#1A1814]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-7 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SectionLabel>Change Nudging Studio</SectionLabel>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">Strategic micro-interventions for enterprise change</h1>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-[#5E574E]">Design small, ethical interventions that make better work behaviours easier, safer, and more natural to choose.</p>
          </div>
          <Card className="bg-[#E9E1D4]">
            <SectionLabel>Current session</SectionLabel>
            <p className="mt-3 text-xl font-medium">Teams updates instead of fragmented email chains</p>
            <p className="mt-3 text-sm leading-6 text-[#5E574E]">Module state persists across the session. AI appears only as restrained ghost guidance and never pre-fills editable fields.</p>
          </Card>
        </header>

        <nav className="mb-6 overflow-x-auto rounded-2xl border border-[#D8CDBD] bg-[#E9E1D4] p-2" aria-label="Prototype steps">
          <ol className="flex min-w-max gap-2">
            {steps.map((name, index) => (
              <li key={name}>
                <button
                  onClick={() => setStep(index)}
                  className={cx(
                    "rounded-xl px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-[#4F5D49]",
                    step === index ? "bg-[#1A1814] text-[#F8F5EE]" : "text-[#5E574E] hover:bg-[#F8F5EE]"
                  )}
                  aria-current={step === index ? "step" : undefined}
                >
                  <span className="mr-2 text-xs">{index + 1}</span>{name}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {step === 0 && (
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <SectionLabel>Behavioural reframe</SectionLabel>
              <h2 className="mt-3 text-3xl font-semibold">Most adoption problems are not awareness problems.</h2>
              <p className="mt-4 text-lg leading-8 text-[#5E574E]">People often know what the training said. Old behaviours persist when the familiar path is easier, safer, better timed, or more socially obvious.</p>
              <blockquote className="mt-6 border-l-4 border-[#7D8B73] pl-5 text-xl leading-8 text-[#2B2823]">Not every change needs another campaign. Sometimes the smarter move is to change the context in which people decide.</blockquote>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                [Compass, "Reshape the path", "Make the desired behaviour easier to find."],
                [ClipboardList, "Clarify the action", "Reduce uncertainty about what good looks like."],
                [ShieldCheck, "Make participation safer", "Lower social risk without forcing compliance."],
                [Timer, "Improve the timing", "Place cues at the moment of decision."],
              ].map(([Icon, title, text]) => {
                const I = Icon as typeof Compass;
                return <Card key={String(title)}><I className="h-6 w-6 text-[#4F5D49]" /><h3 className="mt-4 text-xl font-medium">{title as string}</h3><p className="mt-2 text-sm leading-6 text-[#5E574E]">{text as string}</p></Card>;
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <SectionLabel>Define the behaviour</SectionLabel>
              <h2 className="mt-3 text-2xl font-semibold">Make the change concrete and observable.</h2>
              <div className="mt-5 grid gap-4">
                {([
                  ["desired", "Desired behaviour"],
                  ["current", "Current competing behaviour"],
                  ["target", "Target group"],
                  ["situation", "Situation or moment"],
                  ["context", "Change context"],
                  ["channels", "Available channels"],
                ] as Array<[keyof BehaviourForm, string]>).map(([key, label]) => (
                  <label key={key} className="grid gap-2 text-sm font-medium">
                    {label}
                    <input value={form[key]} onChange={(e) => { updateForm(key, e.target.value); setLifecycle("edited_from_ai"); }} className="rounded-xl border border-[#D8CDBD] bg-[#FFFDF8] px-4 py-3 text-base font-normal outline-none focus:ring-2 focus:ring-[#7D8B73]" />
                  </label>
                ))}
              </div>
            </Card>
            <div className="grid gap-4">
              <Card className="bg-[#E9E1D4]">
                <SectionLabel>Behaviour statement</SectionLabel>
                <p className="mt-3 text-xl leading-8">Help <strong>{form.target}</strong> shift from <strong>{form.current}</strong> to <strong>{form.desired}</strong> during <strong>{form.situation}</strong>.</p>
              </Card>
              <GhostAiMarker>Suggested direction: keep the behaviour narrow enough that a facilitator can observe it without interpreting attitude or intent.</GhostAiMarker>
              <Card>
                <SectionLabel>AI text lifecycle</SectionLabel>
                <p className="mt-3 text-sm text-[#5E574E]">Current state: <span className="font-mono text-[#1A1814]">{lifecycle}</span></p>
                <button onClick={() => setLifecycle("human_rewritten")} className="mt-4 rounded-xl border border-[#D8CDBD] px-4 py-2 text-sm hover:bg-[#E9E1D4]">Mark as human rewritten</button>
              </Card>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <SectionLabel>Friction diagnosis</SectionLabel>
            <h2 className="mt-3 text-2xl font-semibold">Identify what makes the old behaviour easier.</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {(Object.keys(frictionCards) as FrictionKey[]).map((key) => (
                <button key={key} onClick={() => setFriction(key)} className={cx("rounded-2xl border p-5 text-left transition focus:outline-none focus:ring-2 focus:ring-[#4F5D49]", friction === key ? "border-[#4F5D49] bg-[#E3E8DC]" : "border-[#D8CDBD] bg-[#F8F5EE] hover:bg-[#E9E1D4]")}>
                  <h3 className="text-lg font-medium">{frictionCards[key].title}</h3>
                  <p className="mt-3 text-sm font-medium text-[#4F5D49]">{frictionCards[key].question}</p>
                  <p className="mt-3 text-sm leading-6 text-[#5E574E]">{frictionCards[key].detail}</p>
                </button>
              ))}
            </div>
            <Card className="mt-5">
              <blockquote className="border-l-4 border-[#7D8B73] pl-5 text-xl leading-8">Most failed adoption efforts treat resistance as attitude. Often it is simply friction.</blockquote>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div>
            <SectionLabel>Nudge strategy library</SectionLabel>
            <h2 className="mt-3 text-2xl font-semibold">Select intervention patterns that fit the diagnosed friction.</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {(Object.keys(nudgeLibrary) as NudgeKey[]).map((key) => {
                const item = nudgeLibrary[key];
                const recommended = item.bestFor.includes(friction);
                const active = selectedNudges.includes(key);
                return (
                  <button key={key} onClick={() => toggleNudge(key)} className={cx("rounded-2xl border p-5 text-left transition focus:outline-none focus:ring-2 focus:ring-[#4F5D49]", active ? "border-[#4F5D49] bg-[#E3E8DC]" : "border-[#D8CDBD] bg-[#F8F5EE] hover:bg-[#E9E1D4]")}>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-medium">{item.title}</h3>
                      {active && <Check className="h-5 w-5 text-[#4F5D49]" />}
                    </div>
                    {recommended && <p className="mt-3 inline-flex rounded-full border border-[#B8843D]/35 px-3 py-1 text-xs text-[#6D4D24] opacity-60">Context fit</p>}
                    <p className="mt-3 text-sm leading-6 text-[#5E574E]">{item.principle}</p>
                    <p className="mt-3 text-sm leading-6 text-[#5E574E]"><strong>Example:</strong> {item.example}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><SectionLabel>Nudge generator</SectionLabel><h2 className="mt-3 text-2xl font-semibold">Generated intervention ideas</h2></div>
              <button onClick={() => setChosenPlan(0)} className="rounded-xl bg-[#1A1814] px-4 py-3 text-sm text-[#F8F5EE] hover:bg-[#2B2823]"><Wand2 className="mr-2 inline h-4 w-4" />Refresh from current inputs</button>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {nudges.map((item, index) => (
                <button key={item.title} onClick={() => setChosenPlan(index)} className={cx("rounded-2xl border p-5 text-left transition focus:outline-none focus:ring-2 focus:ring-[#4F5D49]", chosenPlan === index ? "border-[#4F5D49] bg-[#E3E8DC]" : "border-[#D8CDBD] bg-[#F8F5EE] hover:bg-[#E9E1D4]")}>
                  <Lightbulb className="h-5 w-5 text-[#4F5D49]" />
                  <h3 className="mt-4 text-xl font-medium">{item.title}</h3>
                  <dl className="mt-4 grid gap-3 text-sm leading-6">
                    <div><dt className="font-medium">Recommended nudge</dt><dd className="text-[#5E574E]">{nudgeLibrary[item.nudge].example}</dd></div>
                    <div><dt className="font-medium">Why it may work</dt><dd className="text-[#5E574E]">{item.rationale}</dd></div>
                    <div><dt className="font-medium">Measurement signal</dt><dd className="text-[#5E574E]">{item.signal}</dd></div>
                  </dl>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && selectedPlan && (
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <Card>
              <SectionLabel>Ethical nudge check</SectionLabel>
              <h2 className="mt-3 text-2xl font-semibold">Supportive, explainable, and autonomy-preserving.</h2>
              <div className="mt-5 grid gap-3">
                {ethics.map((item) => (
                  <label key={item} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#D8CDBD] bg-[#FFFDF8] p-3 text-sm">
                    <input type="checkbox" checked={ethicsChecked.includes(item)} onChange={() => toggleEthic(item)} className="h-4 w-4 accent-[#4F5D49]" />
                    {item}
                  </label>
                ))}
              </div>
            </Card>
            <Card>
              <SectionLabel>Selected intervention</SectionLabel>
              <h3 className="mt-3 text-2xl font-semibold">{selectedPlan.title}</h3>
              <p className="mt-4 leading-7 text-[#5E574E]">{selectedPlan.test}</p>
              <div className="mt-5 rounded-xl border border-[#D8CDBD] bg-[#FFFDF8] p-4">
                <p className="text-sm font-medium">Possible risk</p>
                <p className="mt-2 text-sm leading-6 text-[#5E574E]">{selectedPlan.risk}</p>
              </div>
              <GhostAiMarker>Openly explain the intervention as a small experiment designed to reduce uncertainty and make shared work easier.</GhostAiMarker>
            </Card>
          </div>
        )}

        {step === 6 && selectedPlan && (
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <Card>
              <SectionLabel>Mini nudge plan</SectionLabel>
              <h2 className="mt-3 text-2xl font-semibold">End with a small behavioural experiment.</h2>
              <dl className="mt-5 grid gap-4 md:grid-cols-2">
                <PlanItem label="Behaviour goal" value={form.desired} />
                <PlanItem label="Target group" value={form.target} />
                <PlanItem label="Selected nudge" value={selectedPlan.title} />
                <PlanItem label="Implementation step" value={selectedPlan.test} />
                <label className="grid gap-2 text-sm font-medium">Owner<input value={owner} onChange={(e) => setOwner(e.target.value)} className="rounded-xl border border-[#D8CDBD] bg-[#FFFDF8] px-4 py-3 text-base font-normal outline-none focus:ring-2 focus:ring-[#7D8B73]" /></label>
                <label className="grid gap-2 text-sm font-medium">Test period<input value={period} onChange={(e) => setPeriod(e.target.value)} className="rounded-xl border border-[#D8CDBD] bg-[#FFFDF8] px-4 py-3 text-base font-normal outline-none focus:ring-2 focus:ring-[#7D8B73]" /></label>
                <PlanItem label="Success signal" value={selectedPlan.signal} />
                <PlanItem label="Review question" value="What became easier, safer, or more natural — and what friction still remains?" />
              </dl>
            </Card>
            <Card className="bg-[#E9E1D4]">
              <SectionLabel>Printable summary</SectionLabel>
              <p className="mt-4 text-xl leading-8">A good nudge does not push harder. It makes the better path easier to find.</p>
              <div className="mt-6 rounded-xl border border-[#D8CDBD] bg-[#F8F5EE] p-4 text-sm leading-6 text-[#5E574E]">
                <p><strong>Owner:</strong> {owner}</p>
                <p><strong>Period:</strong> {period}</p>
                <p><strong>Ethical checks reviewed:</strong> {ethicsChecked.length} of {ethics.length}</p>
              </div>
              <button onClick={() => window.print()} className="mt-5 w-full rounded-xl bg-[#1A1814] px-4 py-3 text-sm text-[#F8F5EE] hover:bg-[#2B2823]">Print mini plan</button>
            </Card>
          </div>
        )}

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#D8CDBD] pt-5 text-sm text-[#6E665C]">
          <p>Prototype note: local state only; production would add persistence, permissions, audit history, and append-only reasoning versions.</p>
          <div className="flex gap-3">
            <button disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))} className="rounded-xl border border-[#D8CDBD] px-4 py-2 disabled:opacity-40">Back</button>
            <button disabled={step === steps.length - 1} onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} className="rounded-xl bg-[#1A1814] px-4 py-2 text-[#F8F5EE] disabled:opacity-40">Next <ChevronRight className="inline h-4 w-4" /></button>
          </div>
        </footer>
      </div>
    </main>
  );
}

function PlanItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#D8CDBD] bg-[#FFFDF8] p-4">
      <dt className="text-sm font-medium text-[#1A1814]">{label}</dt>
      <dd className="mt-2 text-sm leading-6 text-[#5E574E]">{value}</dd>
    </div>
  );
}
